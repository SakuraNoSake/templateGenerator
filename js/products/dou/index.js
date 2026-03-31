import {
    isRequired, isValidGUID,
    isValidINN,
    isValidRowsCount,
    normalizeNumber,
    validateGUID,
    validateINN
} from '../../utils/validators.js';
import { DOU_CONSTANTS } from './config/constants.js';
import { generateStatementsFile } from './templates/statements.js';
import { generateGroupsFile } from './templates/groups.js';
import { generatePersonFile } from './templates/person.js';
import { generateStaffFile } from './templates/staff.js';

export function initDOU() {
    console.log('Инициализация ДОУ с константами:', DOU_CONSTANTS);
    const { buttonTexts, templateConfig } = DOU_CONSTANTS;

    // Элементы DOM для ДОУ
    const generateBtn = document.getElementById('generateBtn');
    const rowsCountInput = document.getElementById('rowsCount');
    const dooNameInput = document.getElementById('dooName');
    const dooInnInput = document.getElementById('dooInn');
    const guidDooInput = document.getElementById('guidDoo');
    const loading = document.getElementById('loading');
    const templateTypeSelect = document.getElementById('templateType');
    const requestStatusSelect = document.getElementById('requestStatus');
    const requestTypeSelect = document.getElementById('requestType');
    const groupNameInput = document.getElementById('groupName')
    const educProgramIdInput = document.getElementById('educProgramId')
    const groupUidInput = document.getElementById('groupUid')

    const fields = {
        status: document.querySelector('[for="requestStatus"]')?.parentElement,
        type: document.querySelector('[for="requestType"]')?.parentElement,
        dooName: document.querySelector('[for="dooName"]')?.parentElement,
        dooInn: document.querySelector('[for="dooInn"]')?.parentElement,
        rowsCount: document.querySelector('[for="rowsCount"]')?.parentElement,
        guidDoo: document.querySelector('[for="guidDoo"]')?.parentElement,
        groupName: document.querySelector('[for="groupName"]')?.parentElement,
        educProgramId: document.querySelector('[for="educProgramId"]')?.parentElement,
        groupUid: document.querySelector('[for="groupUid"]')?.parentElement
    };


    // Проверяем, что мы на форме ДОУ
    if (!generateBtn) {
        console.log('Не найдены элементы формы ДОУ');
        return;
    }

    function clearInputs() {
        [
            dooNameInput,
            dooInnInput,
            rowsCountInput,
            guidDooInput,
            groupNameInput,
            educProgramIdInput,
            groupUidInput
        ].forEach(input => {
            if (input) {
                input.value = '';
                input.style.borderColor = '#e0e0e0';
                input.style.backgroundColor = '';
            }
        });
    }

    // ===== ОБРАБОТЧИК ШАБЛОНОВ =====
    function updateFormVisibility() {
        const template = templateTypeSelect.value;
        const status = requestStatusSelect?.value;

        Object.values(fields).forEach(field => {
            if (field) field.style.display = 'none';
        });

        (templateConfig[template] || []).forEach(key => {
            if (fields[key]) fields[key].style.display = 'flex';
        });

        if (template === 'statements' && status === '3') {
            if (fields.educProgramId && fields.groupUid) {
                fields.educProgramId.style.display = 'flex';
                fields.groupUid.style.display = 'flex';
            }
        }
    }

    if (templateTypeSelect) {
        templateTypeSelect.addEventListener('change', () => {
            const selectedValue = templateTypeSelect.value;
            clearInputs();
            if (generateBtn && buttonTexts[selectedValue]) {
                generateBtn.innerHTML = `<i class="fas fa-file-excel"></i> Сгенерировать ${buttonTexts[selectedValue]} и скачать XLSX файл`;
            }
            updateFormVisibility();
        });
        templateTypeSelect.dispatchEvent(new Event('change'));
    }

    if (requestStatusSelect) {
        requestStatusSelect.addEventListener('change', updateFormVisibility);
    }

    // ===== ОСНОВНАЯ ФУНКЦИЯ ГЕНЕРАЦИИ =====
    function generateAndDownloadXLSX(rowsCount, dooName, dooInn, templateType = 'statements', requestStatus = 1, requestType = 1, guidDoo, groupName, educProgramId, groupUid) {
        loading.classList.add('active');
        generateBtn.disabled = true;

        // const buttonTexts = {
        //     'statements': 'Заявления',
        //     'personal_files': 'Личные дела',
        //     'groups': 'Группы',
        //     'staff': 'Кадры'
        // };

        generateBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Генерация ${buttonTexts[templateType] || 'файла'}...`;

        // Имитация задержки для лучшего UX
        setTimeout(() => {
            try {
                let result;

                // Вызываем соответствующую функцию для выбранного шаблона
                switch(templateType) {
                    case 'statements':
                        result = generateStatementsFile(rowsCount, dooName, dooInn, requestStatus, requestType, educProgramId, groupUid);
                        break;
                    case 'groups':
                        result = generateGroupsFile(rowsCount, dooName, dooInn);
                        break;
                    case 'personal_files':
                        result = generatePersonFile(rowsCount, dooName, dooInn, groupName);
                        break;
                    case 'staff':
                        result = generateStaffFile(rowsCount, guidDoo);
                        break;
                    default:
                        throw new Error(`Неизвестный шаблон: ${templateType}`);
                }

                // Генерируем бинарные данные XLSX
                const wbout = XLSX.write(result.wb, {bookType: 'xlsx', type: 'array'});

                // Создаем Blob и скачиваем файл
                const blob = new Blob([wbout], {type: 'application/octet-stream'});
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = result.filename;

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                console.log(`Файл "${result.filename}" успешно сгенерирован`);
                if (templateType === 'statements') {
                    console.log(`Количество записей: ${result.count}`);
                    console.log(`Для ДОО: "${dooName}" (ИНН: ${dooInn})`);
                    console.log(`Статус заявлений: ${requestStatus}, Тип заявлений: ${requestType}`);
                } else if (templateType === 'staff') {
                    console.log(`Количество записей: ${result.count}`);
                    console.log(`GUID ДОО: "${guidDoo}"`);
                }

            } catch (error) {
                console.error('Ошибка при генерации файла:', error);
                alert('Произошла ошибка при генерации файла. Пожалуйста, попробуйте снова.');
            } finally {
                loading.classList.remove('active');
                generateBtn.disabled = false;
                generateBtn.innerHTML = `<i class="fas fa-file-excel"></i> Сгенерировать ${buttonTexts[templateType] || 'файл'} и скачать XLSX файл`;
            }
        }, 500);
    }

    // ===== ВАЛИДАЦИЯ ФОРМЫ =====
    function showError(message, input) {
        alert(message);
        input?.focus();
        return false;
    }

    const templateValidators = {
        statements: (data, inputs) => {
            if (!validateBaseFields(data, inputs)) return false;

            if (data.requestType === 3) {
                if (!isRequired(data.educProgramId)) {
                    return showError('Введите ID образовательной программы', inputs.educProgramIdInput);
                }

                if (!isRequired(data.groupUid)) {
                    return showError('Введите UID группы', inputs.groupUidInput);
                }
            }

            return true;
        },

        staff: (data, inputs) => {
            if (!isRequired(data.guidDoo)) {
                return showError('Введите GUID ДОО', inputs.guidDooInput);
            }

            if (!isValidGUID(data.guidDoo)) {
                return showError('Некорректный GUID', inputs.guidDooInput);
            }

            if (!isValidRowsCount(data.rowsCount)) {
                return showError('Некорректное число строк', inputs.rowsCountInput);
            }

            return true;
        },

        groups: (data, inputs) => {
            return validateBaseFields(data, inputs);
        },

        personal_files: (data, inputs) => {
            if (!validateBaseFields(data, inputs)) return false;

            if (!isRequired(data.groupName)) {
                return showError('Введите название группы', inputs.groupNameInput);
            }
            return true;
        }
    };

    function validateBaseFields({ dooName, dooInn, rowsCount }, inputs) {
        if (!isRequired(dooName)) {
            return showError('Введите наименование ДОО', inputs.dooNameInput);
        }

        if (!isRequired(dooInn)) {
            return showError('Введите ИНН ДОО', inputs.dooInnInput);
        }

        if (!isValidINN(dooInn)) {
            return showError('Некорректный ИНН', inputs.dooInnInput);
        }

        if (!isValidRowsCount(rowsCount)) {
            return showError('Некорректное число строк', inputs.rowsCountInput);
        }

        if (rowsCount > 10000) {
            if (!confirm(`Сгенерировать ${rowsCount} строк?`)) {
                return false;
            }
        }

        return true;
    }

    function validateForm() {
        const data = {
            dooName: dooNameInput.value.trim(),
            dooInn: dooInnInput.value.trim(),
            rowsCount: parseInt(rowsCountInput.value),
            templateType: templateTypeSelect?.value || 'statements',
            requestStatus: parseInt(requestStatusSelect?.value || 1),
            requestType: parseInt(requestTypeSelect?.value || 1),
            guidDoo: guidDooInput.value.trim(),
            groupName: groupNameInput.value.trim(),
            educProgramId: educProgramIdInput.value.trim(),
            groupUid: groupUidInput.value.trim()
        };

        const inputs = {
            dooNameInput,
            dooInnInput,
            rowsCountInput,
            guidDooInput,
            groupNameInput,
            educProgramIdInput,
            groupUidInput
        };

        const validator = templateValidators[data.templateType];

        if (validator && !validator(data, inputs)) {
            return false;
        }

        return {
            ...data,
            dooInn: normalizeNumber(data.dooInn),
            guidDoo: normalizeNumber(data.guidDoo)
        };
    }

    // ===== ОБРАБОТЧИК КЛИКА ПО КНОПКЕ =====

    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const validated = validateForm();

            if (validated) {
                generateAndDownloadXLSX(
                    validated.rowsCount,
                    validated.dooName,
                    validated.dooInn,
                    validated.templateType,
                    validated.requestStatus,
                    validated.requestType,
                    validated.guidDoo,
                    validated.groupName,
                    validated.educProgramId,
                    validated.groupUid
                );
            }
        });
    }


    // ===== ОБРАБОТЧИКИ КЛАВИШИ ENTER =====

    function handleEnterKey(e) {
        if (e.key === 'Enter' && generateBtn) {
            generateBtn.click();
        }
    }

    [rowsCountInput, dooNameInput, dooInnInput].forEach(input => {
        if (input) input.addEventListener('keypress', handleEnterKey);
    });

    // ===== ВАЛИДАЦИЯ ИНН ПРИ ВВОДЕ =====

    if (dooInnInput) {
        dooInnInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '').substring(0, 12);
            e.target.value = value;

            if (value.length > 0) {
                const isValid = validateINN(value);
                e.target.style.borderColor = isValid ? '#4CAF50' : '#ff6b6b';
                e.target.style.backgroundColor = isValid ? '#f0fff0' : '#fff0f0';
            } else {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.backgroundColor = '';
            }
        });
    }


    // ===== ПОДСВЕТКА ОБЯЗАТЕЛЬНЫХ ПОЛЕЙ =====

    if (dooNameInput) {
        dooNameInput.addEventListener('input', function(e) {
            e.target.style.borderColor = e.target.value.trim() ? '#4CAF50' : '#e0e0e0';
            e.target.style.backgroundColor = e.target.value.trim() ? '#f0fff0' : '';
        });
        dooNameInput.dispatchEvent(new Event('input'));
    }

    //Валидация GUID ДОУ при вводе
    if (guidDooInput) {
        guidDooInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '').substring(0, 16);
            e.target.value = value;
            if (value.length > 0) {
                const isValid = validateGUID(value);
                e.target.style.borderColor = isValid ? '#4CAF50' : '#ff6b6b';
                e.target.style.backgroundColor = isValid ? '#f0fff0' : '#fff0f0';
            } else {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.backgroundColor = '';
            }
        });
    }

    //Валидация названия группы
    if (groupNameInput) {
        groupNameInput.addEventListener('input', function(e) {
            e.target.style.borderColor = e.target.value.trim() ? '#4CAF50' : '#e0e0e0';
            e.target.style.backgroundColor = e.target.value.trim() ? '#f0fff0' : '';
        });
        groupNameInput.dispatchEvent(new Event('input'));
    }

    // Валидация ИД ОП, по которой будет выдано направление
    if (educProgramIdInput) {
        educProgramIdInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value;

            if (value.length > 0) {
                // просто проверка: есть ли число
                e.target.style.borderColor = '#4CAF50';
                e.target.style.backgroundColor = '#f0fff0';
            } else {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.backgroundColor = '';
            }
        });
    }

    //Валидация Юид группы
    if (groupUidInput) {
        groupUidInput.addEventListener('input', function(e) {
            e.target.style.borderColor = e.target.value.trim() ? '#4CAF50' : '#e0e0e0';
            e.target.style.backgroundColor = e.target.value.trim() ? '#f0fff0' : '';
        });
        groupUidInput.dispatchEvent(new Event('input'));
    }

    if (dooInnInput) dooInnInput.dispatchEvent(new Event('input'));
    if (guidDooInput) guidDooInput.dispatchEvent(new Event('input'));
    if (groupNameInput) groupNameInput.dispatchEvent(new Event('input'));

    console.log('Генератор XLSX файлов для ДОУ успешно инициализирован!');
    console.log('Доступные шаблоны:', DOU_CONSTANTS.templates);
}