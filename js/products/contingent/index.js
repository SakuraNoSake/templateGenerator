import {initProduct} from "../../core/initProduct.js";
import {CONTINGENT_CONFIG} from "./config/config.js";
import {generateContingentFile} from "./templates/contingent.js";
import {isRequired, validateGUID} from "../../utils/validators.js";
import {generateStaffFile} from "./templates/staff.js";

export function initContingent() {
    const  orgGuidInput = document.getElementById('orgGuid');
    orgGuidInput.addEventListener('input', (e)=>{
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .slice(0, 16)
    })

    initProduct({
        constants: CONTINGENT_CONFIG,

        elements: {
            generateBtn: document.getElementById('generateBtnCont'),
            templateTypeSelect: document.getElementById('templateTypeContingent'),

            rowsCountInput: document.getElementById('rowsCountCont'),
            orgGuidInput: document.getElementById('orgGuid'),
            contGroupNameInput: document.getElementById('contGroupName'),
            loading: document.getElementById('loadingCont'),
        },

        fields: {
            rowsCount: document.querySelector('[for="rowsCountCont"]')?.parentElement,
            orgGuid: document.querySelector('[for="orgGuid"]')?.parentElement,
            groupName: document.querySelector('[for="contGroupName"]')?.parentElement
        },

        generators: {
            person: generateContingentFile,
            staff: generateStaffFile
        },

        validators: {
            person: (data) => {

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
            staff: (data) => {
                if (!validateGUID(data.orgGuid)) {
                    alert('Введите валидный GUID ДОО - 16 символов');
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
            groupName: el.contGroupNameInput.value,
        }),

        buildArgs: (data) => {
            switch (data.templateType) {
                case 'person':
                    return [
                        data.rowsCount,
                        data.orgGuid,
                        data.groupName
                    ];
                case 'staff':
                    return [
                        data.rowsCount,
                        data.orgGuid
                    ];
            }
        }
    })
}