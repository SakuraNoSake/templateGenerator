// utils/validators.js
export function validateINN(inn) {
    if (!inn) return false;
    const cleanedInn = inn.replace(/\D/g, '');
    if (cleanedInn.length !== 10 && cleanedInn.length !== 12) {
        return false;
    }
    return /^\d+$/.test(cleanedInn);
}

export function calculateSNILSCheckSum(numbers) {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(numbers[i]) * (9 - i);
    }
    let checkSum = sum % 101;
    return checkSum === 100 ? 0 : checkSum;
}

export function validateGUID(guid){
    if (!guid) return false;
    const cleanedGuid = guid.replace(/\D/g, '');
    if (cleanedGuid.length !== 16){
        return false
    }
    return /^\d+$/.test(cleanedGuid);
}

export function validateForm(inputs) {
    const { templateType, dooName, dooInn, rowsCount, requestStatus, requestType } = inputs;

    if (templateType === 'statements') {
        if (!dooName) {
            alert('Пожалуйста, введите краткое наименование ДОО');
            return false;
        }

        if (!dooInn) {
            alert('Пожалуйста, введите ИНН ДОО');
            return false;
        }

        if (!validateINN(dooInn)) {
            alert('Пожалуйста, введите корректный ИНН (10 или 12 цифр)');
            return false;
        }

        if (isNaN(rowsCount) || rowsCount < 1) {
            alert('Пожалуйста, введите корректное число строк (больше 0)');
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
    }

    return {
        dooName: '',
        dooInn: '',
        rowsCount: 0,
        templateType,
        requestStatus: 1,
        requestType: 1
    };
}