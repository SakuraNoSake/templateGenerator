import {initProduct} from "../../core/initProduct.js";
import {SCHOOL_CONFIG} from "./config/constants.js";
import {generatePersonSchoolFile} from "./templates/person.js";
import {isRequired} from "../../utils/validators.js";

export function initSchool() {
    initProduct({
        constants: SCHOOL_CONFIG,

        elements: {
            generateBtn: document.getElementById('generateBtnSchool'),
            templateTypeSelect: document.getElementById('templateTypeSchool'),
            loading: document.getElementById('loadingSchool'),

            rowsCountInput: document.getElementById('rowsCountSchool'),
            orgGuidInput: document.getElementById('schoolOrgGuid'),
            groupNameInput: document.getElementById('schoolGroupName'),
        },

        fields: {
            rowsCount: document.querySelector('[for="rowsCountSchool"]')?.parentElement,
            orgGuid: document.querySelector('[for="schoolOrgGuid"]')?.parentElement,
            groupName: document.querySelector('[for="schoolGroupName"]')?.parentElement,
        },

        generators: {
            personSchool: generatePersonSchoolFile,
        },

        validators: {
            personSchool: (data) => {
                if(!isRequired(data.orgGuid)) return alert('Введите CUID организации'), false
                if(!isRequired(data.groupName)) return alert('Введите название класса/группы'), false
                return true;
            }
        },

        collectData: (el) => ({
            templateType: el.templateTypeSelect.value,
            rowsCount: Number(el.rowsCountInput.value),
            orgGuid: el.orgGuidInput.value,
            groupName: el.groupNameInput.value,
        }),

        buildArgs: (data) => {
            switch (data.templateType) {
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
                        data.groupName
                    ];
            }
        }
    })
}