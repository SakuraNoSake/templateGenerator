// products/dou/index.js
import {validateGUID, validateINN} from '../../utils/validators.js';
import { generateUUID, getCurrentDate, getCurrentTimestamp } from '../../utils/generators.js';
import { DOU_CONSTANTS } from './config/constants.js';
import { generateStatementsFile } from './templates/statements.js';
import { generateGroupsFile } from './templates/groups.js';
import { generatePersonalFilesFile } from './templates/person.js';
import { generateStaffFile } from './templates/staff.js';

export function initDOU() {
    console.log('Инициализация ДОУ с константами:', DOU_CONSTANTS);

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

    // Проверяем, что мы на форме ДОУ
    if (!generateBtn) {
        console.log('Не найдены элементы формы ДОУ');
        return;
    }

    // ===== ОБРАБОТЧИК ШАБЛОНОВ =====

    // Обработчик изменения выбора шаблона
    if (templateTypeSelect) {
        templateTypeSelect.addEventListener('change', function() {
            const selectedValue = this.value;

            // Обновляем текст кнопки в зависимости от шаблона
            const buttonTexts = {
                'statements': 'Заявления',
                'personal_files': 'Личные дела',
                'groups': 'Группы',
                'staff': 'Кадры'
            };

            if (generateBtn && buttonTexts[selectedValue]) {
                generateBtn.innerHTML = `<i class="fas fa-file-excel"></i> Сгенерировать ${buttonTexts[selectedValue]} и скачать XLSX файл`;
            }

            // Показываем/скрываем поля статуса и типа заявлений
            const statusField = document.querySelector('[for="requestStatus"]')?.parentElement;
            const typeField = document.querySelector('[for="requestType"]')?.parentElement;
            const dooNameField = document.querySelector('[for="dooName"]')?.parentElement;
            const dooInnField = document.querySelector('[for="dooInn"]')?.parentElement;
            const rowsCountField = document.querySelector('[for="rowsCount"]')?.parentElement;
            const guidDooField = document.querySelector('[for="guidDoo"]')?.parentElement;

            if (selectedValue === 'statements') {
                // Для заявлений показываем все поля
                if (statusField) statusField.style.display = 'block';
                if (typeField) typeField.style.display = 'block';
                if (dooNameField) dooNameField.style.display = 'block';
                if (dooInnField) dooInnField.style.display = 'block';
                if (rowsCountField) rowsCountField.style.display = 'block';
                // Скрываем ненужные поля
                if (guidDooField) guidDooField.style.display = 'none';

                // Обновляем подсказку для количества строк
                const rowExample = document.querySelector('#rowsCount + .example');
                if (rowExample) {
                    rowExample.textContent = 'Максимум 10,000 строк за одну генерацию.';
                }
            } else if (selectedValue === 'staff') {
                // Поля для шабона кадров
                if (guidDooField) guidDooField.style.display = 'block';
                if (rowsCountField) rowsCountField.style.display = 'block';

                // Скрываем ненужные поля для кадров
                if (typeField) typeField.style.display = 'none';
                if (statusField) statusField.style.display = 'none';
                if (dooInnField) dooInnField.style.display = 'none';
                if (dooNameField) dooNameField.style.display = 'none';
            } else {
                // Для других шаблонов скрываем поля
                if (statusField) statusField.style.display = 'none';
                if (typeField) typeField.style.display = 'none';
                if (dooNameField) dooNameField.style.display = 'none';
                if (dooInnField) dooInnField.style.display = 'none';
                if (rowsCountField) rowsCountField.style.display = 'none';

                // Обновляем подсказку для количества строк
                const rowExample = document.querySelector('#rowsCount + .example');
                if (rowExample) {
                    rowExample.textContent = 'Для данного шаблона будет создан пустой файл.';
                }
            }

            console.log(`Выбран шаблон: ${this.options[this.selectedIndex].text}`);
        });

        // Инициализируем при загрузке
        templateTypeSelect.dispatchEvent(new Event('change'));
    }

    // ===== ОСНОВНАЯ ФУНКЦИЯ ГЕНЕРАЦИИ =====

    function generateAndDownloadXLSX(rowsCount, dooName, dooInn, templateType = 'statements', requestStatus = 1, requestType = 1, guidDoo) {
        loading.classList.add('active');
        generateBtn.disabled = true;

        const buttonTexts = {
            'statements': 'Заявления',
            'personal_files': 'Личные дела',
            'groups': 'Группы',
            'staff': 'Кадры'
        };

        generateBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Генерация ${buttonTexts[templateType] || 'файла'}...`;

        // Имитация задержки для лучшего UX
        setTimeout(() => {
            try {
                let result;

                // Вызываем соответствующую функцию для выбранного шаблона
                switch(templateType) {
                    case 'statements':
                        result = generateStatementsFile(rowsCount, dooName, dooInn, requestStatus, requestType);
                        break;
                    case 'groups':
                        result = generateGroupsFile();
                        break;
                    case 'personal_files':
                        result = generatePersonalFilesFile();
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

    function validateForm() {
        const dooName = dooNameInput.value.trim();
        const dooInn = dooInnInput.value.trim();
        const rowsCount = parseInt(rowsCountInput.value);
        const templateType = templateTypeSelect ? templateTypeSelect.value : 'statements';
        const requestStatus = requestStatusSelect ? parseInt(requestStatusSelect.value) : 1;
        const requestType = requestTypeSelect ? parseInt(requestTypeSelect.value) : 1;
        const guidDoo = guidDooInput.value.trim();

        // Для шаблона "Заявления" проверяем обязательные поля
        if (templateType === 'statements') {
            if (!dooName) {
                alert('Пожалуйста, введите краткое наименование ДОО');
                dooNameInput.focus();
                return false;
            }

            if (!dooInn) {
                alert('Пожалуйста, введите ИНН ДОО');
                dooInnInput.focus();
                return false;
            }

            if (!validateINN(dooInn)) {
                alert('Пожалуйста, введите корректный ИНН (10 или 12 цифр)');
                dooInnInput.focus();
                return false;
            }

            if (isNaN(rowsCount) || rowsCount < 1) {
                alert('Пожалуйста, введите корректное число строк (больше 0)');
                rowsCountInput.focus();
                return false;
            }

            if (rowsCount > 10000) {
                if (!confirm(`Вы пытаетесь сгенерировать ${rowsCount} строк. Это может занять некоторое время. Продолжить?`)) {
                    return false;
                }
            }

            return {
                dooName,
                dooInn: dooInn.replace(/\D/g, ''),
                rowsCount,
                templateType,
                requestStatus,
                requestType
            };
        } else if (templateType === 'staff') {
            if (!guidDoo) {
                alert('Пожалуйста, введите GUID Доо');
                guidDooInput.focus();
                return false;
            }

            if(!validateGUID(guidDoo)){
                alert('Пожалуйста, введите корректный GUID Доо (16 цифр)')
                guidDooInput.focus();
                return false;
            }

            if (isNaN(rowsCount) || rowsCount < 1) {
                alert('Пожалуйста, введите корректное число строк (больше 0)');
                rowsCountInput.focus();
                return false;
            }

            if (rowsCount > 10000) {
                if (!confirm(`Вы пытаетесь сгенерировать ${rowsCount} строк. Это может занять некоторое время. Продолжить?`)) {
                    return false;
                }
            }

            return {
                guidDoo: guidDoo.replace(/\D/g, ''),
                rowsCount,
                templateType,
            }
        } else {
            // Для других шаблонов поля ДОО не обязательны
            return {
                dooName: '',
                dooInn: '',
                rowsCount: 0,
                templateType,
                requestStatus: 1,
                requestType: 1
            };
        }
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
                    validated.guidDoo
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

    if (dooInnInput) dooInnInput.dispatchEvent(new Event('input'));
    if (guidDooInput) guidDooInput.dispatchEvent(new Event('input'));

    console.log('Генератор XLSX файлов для ДОУ успешно инициализирован!');
    console.log('Доступные шаблоны:', DOU_CONSTANTS.templates);
}