import { initProduct } from '../../core/initProduct.js';
import { DOU_CONFIG } from './config/config.js';

import { generateStatementsFile } from './templates/statements.js';
import { generateGroupsFile } from './templates/groups.js';
import { generatePersonFile } from './templates/person.js';

import {
    isRequired,
    validateINN,
} from '../../utils/validators.js';

export function initDOU() {
    const dooInnInput = document.getElementById('dooInn');
    const educProgramIdInput = document.getElementById('educProgramId');
    const commonValidators = {
        dooName(data) {
            if (!isRequired(data.dooName)) {
                alert('Введите название организации');
                return false;
            }
            return true;
        },

        dooInn(data) {
            if (!validateINN(data.dooInn)) {
                alert('ИНН организации должен состоять из 10 или 12 цифр');
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
        }
    };

    [dooInnInput, educProgramIdInput].forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value
                .replace(/\D/g, '')
                .slice(0, 12)
        });
    });

    function runValidators(data, validators) {
        return validators.every(validator => validator(data));
    }

    initProduct({
        constants: DOU_CONFIG,

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
        },

        validators: {
            statements: (data) => {
                if (!runValidators(data, [
                    commonValidators.dooName,
                    commonValidators.dooInn,
                    commonValidators.rowsCount
                ])) {
                    return false;
                }

                if (data.requestStatus === 3) {
                    if (!isRequired(data.educProgramId)) {
                        alert('Введите ИД образовательной программы');
                        return false;
                    }

                    if (!isRequired(data.groupUid)) {
                        alert('Введите Юид группы');
                        return false;
                    }
                }

                return true;
            },

            personal_files: (data) => {
                if (!runValidators(data, [
                    commonValidators.dooName,
                    commonValidators.dooInn,
                    commonValidators.rowsCount
                ])) {
                    return false;
                }

                if (!isRequired(data.groupName)) {
                    alert('Введите название группы');
                    return false;
                }
                return true;
            },

            groups: (data) => {
                return runValidators(data, [
                    commonValidators.dooName,
                    commonValidators.dooInn,
                    commonValidators.rowsCount
                ]);
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