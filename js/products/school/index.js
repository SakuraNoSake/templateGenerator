import {initProduct} from "../../core/initProduct.js";
import {SCHOOL_CONFIG} from "./config/config.js";
import {generatePersonSchoolFile} from "./templates/person.js";
import {isRequired, validateGUID, validateINN} from "../../utils/validators.js";
import {generateRequestSchoolFile} from "./templates/request.js";
import {generateGroupSchoolFile} from "./templates/group.js";

export function initSchool() {
    //Валидация числовых импутов
    const orgGuidInput = document.getElementById('schoolOrgGuid');
    const schoolInnInput = document.getElementById('schoolInn');

    [orgGuidInput, schoolInnInput].forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value
                .replace(/\D/g, '')
                .slice(0, 16)
        });
    });

    initProduct({
        constants: SCHOOL_CONFIG,

        elements: {
            generateBtn: document.getElementById('generateBtnSchool'),
            templateTypeSelect: document.getElementById('templateTypeSchool'),
            loading: document.getElementById('loadingSchool'),

            rowsCountInput: document.getElementById('rowsCountSchool'),
            orgGuidInput: document.getElementById('schoolOrgGuid'),
            groupNameInput: document.getElementById('schoolGroupName'),
            schoolInnInput: document.getElementById('schoolInn'),
            shortSchoolNameInput: document.getElementById('shortSchoolName')
        },

        fields: {
            rowsCount: document.querySelector('[for="rowsCountSchool"]')?.parentElement,
            orgGuid: document.querySelector('[for="schoolOrgGuid"]')?.parentElement,
            groupName: document.querySelector('[for="schoolGroupName"]')?.parentElement,
            shortSchoolName: document.querySelector('[for="shortSchoolName"]')?.parentElement,
            schoolInn: document.querySelector('[for="schoolInn"]')?.parentElement
        },

        generators: {
            personSchool: generatePersonSchoolFile,
            statementSchool: generateRequestSchoolFile,
            groupSchool: generateGroupSchoolFile
        },

        validators: {
            statementSchool: (data) => {
                if (!validateINN(data.schoolInn)) {
                    alert('ИНН организации должен состоять из 10 или 12 цифр');
                    return false;
                }

                if (!isRequired(data.shortSchoolName)) {
                    alert('Введите краткое название ОО: ');
                    return false;
                }

                if (data.rowsCount <= 0) {
                    alert('Введите количество строк');
                    return false;
                }

                return true;
            },

            personSchool: (data) => {

                if (!validateGUID(data.orgGuid)) {
                    alert('UID организации должен содержать 16 цифр');
                    return false;
                }

                if (!isRequired(data.groupName)) {
                    alert('Введите название класса/группы');
                    return false;
                }

                if (data.rowsCount <= 0) {
                    alert('Введите количество строк');
                    return false;
                }

                return true;
            },
            groupSchool: (data) => {

                if (!validateGUID(data.orgGuid)) {
                    alert('UID организации должен содержать 16 цифр');
                    return false;
                }

                if (!isRequired(data.shortSchoolName)) {
                    alert('Введите краткое название ОО: ');
                    return false;
                }

                if (data.rowsCount <= 0) {
                    alert('Введите количество строк');
                    return false;
                }

                return true;
            }
        },

        collectData: (el) => ({
            templateType: el.templateTypeSelect.value,
            rowsCount: Number(el.rowsCountInput.value),
            orgGuid: el.orgGuidInput.value,
            groupName: el.groupNameInput.value,
            shortSchoolName: el.shortSchoolNameInput.value,
            schoolInn: el.schoolInnInput.value
        }),

        buildArgs: (data) => {
            switch (data.templateType) {
                case 'statementSchool':
                    return [
                        data.rowsCount,
                        data.shortSchoolName,
                        data.schoolInn
                    ];
                case 'personSchool':
                    return [
                        data.rowsCount,
                        data.orgGuid,
                        data.groupName
                    ];
                case 'groupSchool':
                    return [
                        data.rowsCount,
                        data.orgGuid,
                        data.shortSchoolName
                    ];
            }
        }
    })
}