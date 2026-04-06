// js/products/spo/index.js

import { initProduct } from '../../core/initProduct.js';
import { SPO_CONFIG } from './config/constants.js';
import {generateSpoPersonFile} from "./templates/person.js";
import {isRequired} from "../../utils/validators.js";

export function initSPO() {
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
            educProgramInput: document.getElementById('spoEducProgramName')
        },

        fields: {
            rowsCount: document.querySelector('[for="rowsCountSpo"]')?.parentElement,
            orgName: document.querySelector('[for="spoOrgName"]')?.parentElement,
            orgUid: document.querySelector('[for="spoOrgUid"]')?.parentElement,
            groupName: document.querySelector('[for="spoGroupName"]')?.parentElement,
            educProgram: document.querySelector('[for="spoEducProgramName"]')?.parentElement
        },

        generators: {
            spoPersonTemplate: generateSpoPersonFile
        },

        validators: {
            spoPersonTemplate: (data) => {
                if(!isRequired(data.orgName)) return alert('Введите краткое название ОО'), false;
                if(!isRequired(data.orgUid)) return alert('Введите UID-организации'), false;
                if(!isRequired(data.groupName)) return alert('Введите название группы'), false;
                if(!isRequired(data.educProgram)) return alert('Введите название ОП'), false;
                return true;
            }
        },

        collectData: (el) => ({
            templateType: el.templateTypeSelect.value,
            rowsCount: Number(el.rowsCountInput.value),
            orgName: el.orgNameInput.value,
            orgUid: el.orgUidInput.value,
            groupName: el.groupNameInput.value,
            educProgram: el.educProgramInput.value
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
            }
        }
    });
}