import { initProduct } from '../../core/initProduct.js';
import { SPO_CONFIG } from './config/config.js';
import {generateSpoPersonFile} from "./templates/person.js";
import {isRequired, validateGUID} from "../../utils/validators.js";
import {generateEducProgramFile} from "./templates/educProgram.js";
import {generateGroupSpoFile} from "./templates/group.js";

export function initSPO() {
    const orgUidInput = document.getElementById('spoOrgUid');
    const educProgramIdInput = document.getElementById('spoEducProgramId');
    const commonValidators = {
        orgName(data) {
            if (!isRequired(data.orgName)) {
                alert('Введите название организации');
                return false;
            }
            return true;
        },

        orgUid(data) {
            if (!validateGUID(data.orgUid)) {
                alert('Введите UID-организации 16 цифр');
                return false;
            }
            return true;
        },

        rowsCount(data) {
            if (data.rowsCount <= 0) {
                alert('Введите количество строк');
                return false;
            }
            return true;
        },

        educProgram(data) {
            if (!isRequired(data.educProgram)) {
                alert('Введите обзаровательную программу');
                return false;
            }
            return true;
        }
    };

    [orgUidInput, educProgramIdInput].forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value
                .replace(/\D/g, '')
                .slice(0, 16)
        });
    });

    function runValidators(data, validators) {
        return validators.every(validator => validator(data));
    }


    initProduct({
        constants: SPO_CONFIG,

        elements: {
            generateBtn: document.getElementById('generateBtnSpo'),
            templateTypeSelect: document.getElementById('templateTypeSpo'),
            loading: document.getElementById('loading'),

            rowsCountInput: document.getElementById('rowsCountSpo'),
            orgNameInput: document.getElementById('spoOrgName'),
            orgUidInput: document.getElementById('spoOrgUid'),
            groupNameInput: document.getElementById('spoGroupName'),
            educProgramInput: document.getElementById('spoEducProgramName'),
            spoEducProgramIdInput: document.getElementById('spoEducProgramId')
        },

        fields: {
            rowsCount: document.querySelector('[for="rowsCountSpo"]')?.parentElement,
            orgName: document.querySelector('[for="spoOrgName"]')?.parentElement,
            orgUid: document.querySelector('[for="spoOrgUid"]')?.parentElement,
            groupName: document.querySelector('[for="spoGroupName"]')?.parentElement,
            educProgram: document.querySelector('[for="spoEducProgramName"]')?.parentElement,
            educProgramId: document.querySelector('[for="spoEducProgramId"]')?.parentElement
        },

        generators: {
            spoPersonTemplate: generateSpoPersonFile,
            spoGroupTemplate: generateGroupSpoFile,
            spoEducProgramTemplate: generateEducProgramFile
        },

        validators: {
            spoPersonTemplate: (data) => {
                if (!runValidators(data, [
                    commonValidators.orgName,
                    commonValidators.orgUid,
                    commonValidators.rowsCount,
                    commonValidators.educProgram
                ])) {
                    return false;
                }

                if (!isRequired(data.groupName)) {
                    alert('Введите название группы');
                    return false;
                }
                return true;
            },

            spoGroupTemplate: (data) => {
                if (!runValidators(data, [
                    commonValidators.orgName,
                    commonValidators.orgUid,
                    commonValidators.rowsCount,
                    commonValidators.educProgram
                ])) {
                    return false;
                }

                if (!isRequired(data.educProgramId)) {
                    alert('Введите ИД образовательной программы');
                    return false;
                }
                return true;
            },

            spoEducProgramTemplate: (data) => {
                return runValidators(data, [
                    commonValidators.orgName,
                    commonValidators.orgUid,
                    commonValidators.rowsCount
                ]);
            }
        },

        collectData: (el) => ({
            templateType: el.templateTypeSelect.value,
            rowsCount: Number(el.rowsCountInput.value),
            orgName: el.orgNameInput.value,
            orgUid: el.orgUidInput.value,
            groupName: el.groupNameInput.value,
            educProgram: el.educProgramInput.value,
            educProgramId: el.spoEducProgramIdInput.value
        }),

        buildArgs: (data) => {
            switch (data.templateType) {
                case 'spoPersonTemplate':
                    return [
                        data.rowsCount,
                        data.orgName,
                        data.orgUid,
                        data.groupName,
                        data.educProgram
                    ];
                case 'spoGroupTemplate':
                    return [
                        data.rowsCount,
                        data.orgName,
                        data.orgUid,
                        data.educProgramId,
                        data.educProgram
                    ];

                case 'spoEducProgramTemplate':
                    return [
                        data.rowsCount,
                        data.orgName,
                        data.orgUid
                    ];
            }
        }
    });
}