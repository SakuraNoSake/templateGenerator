export function validateINN(inn) {
    if (!inn) return false;

    if (inn.length !== 10 && inn.length !== 12) {
        return false;
    }
    return /^\d+$/.test(inn);
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

    if (guid.length !== 16){
        return false
    }
    return /^\d+$/.test(guid);
}

export function isRequired(value) {
    return value && value.trim() !== '';
}






