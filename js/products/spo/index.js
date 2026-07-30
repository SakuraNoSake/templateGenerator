import { initProduct } from '../../core/initProduct.js';
import { SPO_CONFIG } from './config/config.js';
import {generateSpoPersonFile} from "./templates/person.js";
import {isRequired, validateGUID, validateINN, validateKPP} from "../../utils/validators.js";
import {generateEducProgramFile} from "./templates/educProgram.js";
import {generateGroupSpoFile} from "./templates/group.js";

export function initSPO() {
    const orgUidInput = document.getElementById('spoOrgUid');
    const orgInn = document.getElementById('orgInn');
    const orgKpp = document.getElementById('orgKpp');
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

        educProgram(data) {
            if (!isRequired(data.educProgram)) {
                alert('Введите обзаровательную программу');
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
    };

    orgUidInput.addEventListener('input', (e)=>{
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .slice(0, 16)
    })

    orgInn.addEventListener('input', (e)=>{
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .slice(0, 10)
    })

    orgKpp.addEventListener('input', (e)=>{
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .slice(0, 9)
    })

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
            orgInnInput: document.getElementById('orgInn'),
            orgKppInput: document.getElementById('orgKpp'),
            rkIdGroupInput: document.getElementById('rkIdGroup'),
            rkUidEducProgramInput: document.getElementById('rkUidEducProgram'),
            educProgramInput: document.getElementById('spoEducProgramName'),
            spoEducProgramIdInput: document.getElementById('spoEducProgramId')
        },

        fields: {
            rowsCount: document.querySelector('[for="rowsCountSpo"]')?.parentElement,
            orgName: document.querySelector('[for="spoOrgName"]')?.parentElement,
            orgInn: document.querySelector('[for="orgInn"]')?.parentElement,
            orgKpp: document.querySelector('[for="orgKpp"]')?.parentElement,
            orgUid: document.querySelector('[for="spoOrgUid"]')?.parentElement,
            rkIdGroup: document.querySelector('[for="rkIdGroup"]')?.parentElement,
            rkUidEducProgram: document.querySelector('[for="rkUidEducProgram"]')?.parentElement,
            educProgram: document.querySelector('[for="spoEducProgramName"]')?.parentElement,
            educProgramId: document.querySelector('[for="spoEducProgramId"]')?.parentElement,
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
                    commonValidators.rowsCount,
                ])) {
                    return false;
                }

                if (!isRequired(data.orgInn)) {
                    alert('Введите ИНН организации');
                    return false;
                }

                if(!validateINN(data.orgInn)){
                    alert('ИНН организации должен состоять из 10 цифр');
                    return false;
                }

                if(!validateKPP(data.orgKpp)){
                    alert('КПП организации должен состоять из 9 цифр');
                    return false;
                }

                if (!isRequired(data.rkIdGroup)) {
                    alert('Введите РК-UID группы');
                    return false;
                }

                if (!isRequired(data.rkUidEducProgram)) {
                    alert('Введите РК-UID образовательной программы');
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
            orgInn: el.orgInnInput.value,
            orgKpp: el.orgKppInput.value,
            rkIdGroup: el.rkIdGroupInput.value,
            rkUidEducProgram: el.rkUidEducProgramInput.value,
            educProgram: el.educProgramInput.value,
            educProgramId: el.spoEducProgramIdInput.value
        }),

        buildArgs: (data) => {
            switch (data.templateType) {
                case 'spoPersonTemplate':
                    return [
                        data.rowsCount,
                        data.orgName,
                        data.orgInn,
                        data.orgKpp,
                        data.rkIdGroup,
                        data.rkUidEducProgram
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