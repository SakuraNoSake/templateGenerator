import {
    isRequired, isValidGUID,
    isValidINN,
    isValidRowsCount,
    normalizeNumber,
    validateGUID,
    validateINN
} from '../../utils/validators.js';

import {SPO_CONFIG} from "./config/constants.js";

export function initSPO() {
    console.log('Инициализация СПО:', SPO_CONFIG);
    const { buttonTexts, templateConfig } = SPO_CONFIG;

//     DOOM элементы
    const templateTypeSelect = document.getElementById('templateTypeSpo');
    const loading = document.getElementById('loading');
    const generateBtn = document.getElementById('generateBtnSpo');
    const rowsCountInput = document.getElementById('rowsCountSpo');
    const organizationNameInput = document.getElementById('spoOrgName');
    const organizationUidInput = document.getElementById('spoOrgUid');
    const groupIdInput = document.getElementById('spoGroupId');
    const educProgramInput = document.getElementById('spoEducProgramName');

    const fields = {
        rowsCount: document.querySelector('[for="rowsCountSpo"]')?.parentElement,
        orgName: document.querySelector('[for="spoOrgName"]')?.parentElement,
        orgUid: document.querySelector('[for="spoOrgUid"]')?.parentElement,
        groupId: document.querySelector('[for="spoGroupId"]')?.parentElement,
        educProgram : document.querySelector('[for="spoEducProgramName"]')?.parentElement,
    }

    if(!generateBtn) {
        console.log('Элементы для СПО не найдены');
    }

    // ===== ОБРАБОТЧИК ШАБЛОНОВ =====
    //     Подумать можно ли вынести функцию updateFormVisibility в общий файл и использовать ее для всех продуктов

    if (templateTypeSelect) {
        templateTypeSelect.addEventListener('change', () => {
            const selectedValue = templateTypeSelect.value;

            if (generateBtn && buttonTexts[selectedValue]) {
                generateBtn.innerHTML = `<i class="fas fa-file-excel"></i> Сгенерировать ${buttonTexts[selectedValue]} и скачать XLSX файл`;
            }
            // updateFormVisibility();
        })
        templateTypeSelect.dispatchEvent(new Event('change'));
    }

    // ===== ОСНОВНАЯ ФУНКЦИЯ ГЕНЕРАЦИИ =====
    


}