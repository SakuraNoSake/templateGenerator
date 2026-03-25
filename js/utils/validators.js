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

export function isRequired(value) {
    return value && value.trim() !== '';
}

export function isValidINN(inn) {
    const clean = inn.replace(/\D/g, '');
    return clean.length === 10 || clean.length === 12;
}

export function isValidGUID(guid) {
    const clean = guid.replace(/\D/g, '');
    return clean.length === 16;
}

export function isValidRowsCount(value) {
    const num = parseInt(value);
    return !isNaN(num) && num > 0;
}

export function normalizeNumber(value) {
    return value.replace(/\D/g, '');
}






