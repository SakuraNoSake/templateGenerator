export function initProduct(config) {
    const {
        constants,
        elements,
        fields,
        generators,
        validators,
        extraVisibilityLogic,
        collectData,
        buildArgs
    } = config;

    const { buttonTexts, templateConfig } = constants;

    if (!elements.generateBtn) {
        console.log('Кнопка генерации не найдена');
        return;
    }

    function updateFormVisibility() {
        const template = elements.templateTypeSelect.value;

        Object.values(fields).forEach(field => {
            if (field) field.style.display = 'none';
        });

        (templateConfig[template] || []).forEach(key => {
            if (fields[key]) fields[key].style.display = 'flex';
        });

        if (extraVisibilityLogic) {
            extraVisibilityLogic(template, elements, fields);
        }
    }

    function resetFields(fields) {
        Object.values(fields).forEach(field => {
            if (!field) return;

            const input = field.querySelector('input, textarea');

            if (!input) return;

            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });
    }

    function generateFile(templateType, args) {
        const generator = generators[templateType];

        if (!generator) {
            throw new Error(`Неизвестный шаблон: ${templateType}`);
        }

        return generator(...args);
    }

    function downloadFile(result) {
        const wbout = XLSX.write(result.wb, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // ===== TEMPLATE CHANGE =====
    elements.templateTypeSelect.addEventListener('change', () => {
        const val = elements.templateTypeSelect.value;

        if (elements.generateBtn && buttonTexts[val]) {
            elements.generateBtn.innerHTML =
                `<i class="fas fa-file-excel"></i> Сгенерировать ${buttonTexts[val]} и скачать XLSX файл`;
        }
        resetFields(fields);
        updateFormVisibility();
    });

    if (elements.requestStatusSelect) {
        elements.requestStatusSelect.addEventListener('change', updateFormVisibility);
    }

    elements.templateTypeSelect.dispatchEvent(new Event('change'));


    // ===== GENERATE =====
    elements.generateBtn.addEventListener('click', () => {
        const data = collectData(elements);

        const validator = validators?.[data.templateType];

        if (validator && !validator(data, elements)) return;

        try {
            elements.loading?.classList.add('active');
            elements.generateBtn.disabled = true;

            const result = generateFile(
                data.templateType,
                buildArgs(data)
            );

            downloadFile(result);

        } catch (e) {
            console.error(e);
            alert('Ошибка при генерации файла');
        } finally {
            elements.loading?.classList.remove('active');
            elements.generateBtn.disabled = false;
        }
    });

    console.log(`Инициализирован продукт: ${constants.productName}`);
}