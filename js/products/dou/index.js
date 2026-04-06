// js/products/dou/index.js

import { initProduct } from '../../core/initProduct.js';
import { DOU_CONSTANTS } from './config/constants.js';

import { generateStatementsFile } from './templates/statements.js';
import { generateGroupsFile } from './templates/groups.js';
import { generatePersonFile } from './templates/person.js';
import { generateStaffFile } from './templates/staff.js';

import {
    isRequired,
    isValidGUID,
    isValidINN,
    isValidRowsCount
} from '../../utils/validators.js';

export function initDOU() {
    initProduct({
        constants: DOU_CONSTANTS,

        elements: {
            generateBtn: document.getElementById('generateBtn'),
            templateTypeSelect: document.getElementById('templateType'),
            loading: document.getElementById('loading'),

            dooNameInput: document.getElementById('dooName'),
            dooInnInput: document.getElementById('dooInn'),
            rowsCountInput: document.getElementById('rowsCount'),
            guidDooInput: document.getElementById('guidDoo'),
            groupNameInput: document.getElementById('groupName'),
            educProgramIdInput: document.getElementById('educProgramId'),
            groupUidInput: document.getElementById('groupUid'),

            requestStatusSelect: document.getElementById('requestStatus'),
            requestTypeSelect: document.getElementById('requestType')
        },

        fields: {
            dooName: document.querySelector('[for="dooName"]')?.parentElement,
            dooInn: document.querySelector('[for="dooInn"]')?.parentElement,
            rowsCount: document.querySelector('[for="rowsCount"]')?.parentElement,
            guidDoo: document.querySelector('[for="guidDoo"]')?.parentElement,
            groupName: document.querySelector('[for="groupName"]')?.parentElement,
            educProgramId: document.querySelector('[for="educProgramId"]')?.parentElement,
            groupUid: document.querySelector('[for="groupUid"]')?.parentElement,
            status: document.querySelector('[for="requestStatus"]')?.parentElement,
            type: document.querySelector('[for="requestType"]')?.parentElement
        },

        generators: {
            statements: generateStatementsFile,
            groups: generateGroupsFile,
            personal_files: generatePersonFile,
            staff: generateStaffFile
        },

        validators: {
            statements: (data) => {
                if (!isRequired(data.dooName)) return alert('Введите ДОО'), false;
                if (!isValidINN(data.dooInn)) return alert('ИНН некорректен'), false;
                return true;
            },
            staff: (data) => {
                if (!isValidGUID(data.guidDoo)) return alert('GUID некорректен'), false;
                return true;
            }
        },

        collectData: (el) => ({
            templateType: el.templateTypeSelect.value,
            dooName: el.dooNameInput.value,
            dooInn: el.dooInnInput.value,
            rowsCount: Number(el.rowsCountInput.value),
            guidDoo: el.guidDooInput.value,
            groupName: el.groupNameInput.value,
            educProgramId: el.educProgramIdInput.value,
            groupUid: el.groupUidInput.value,
            requestStatus: Number(el.requestStatusSelect.value),
            requestType: Number(el.requestTypeSelect.value)
        }),

        buildArgs: (data) => {
            switch (data.templateType) {
                case 'statements':
                    return [
                        data.rowsCount,
                        data.dooName,
                        data.dooInn,
                        data.requestStatus,
                        data.requestType,
                        data.educProgramId,
                        data.groupUid
                    ];
                case 'groups':
                    return [data.rowsCount, data.dooName, data.dooInn];
                case 'personal_files':
                    return [data.rowsCount, data.dooName, data.dooInn, data.groupName];
                case 'staff':
                    return [data.rowsCount, data.guidDoo];
            }
        },

        extraVisibilityLogic: (template, el, fields) => {
            if (template === 'statements' && el.requestStatusSelect.value === '3') {
                fields.educProgramId.style.display = 'flex';
                fields.groupUid.style.display = 'flex';
            }
        }
    });
}