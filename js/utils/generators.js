// utils/generators.js
import {
    maleFirstNames, femaleFirstNames, maleLastNames, femaleLastNames,
    malePatronymics, femalePatronymics, romanNumerals, cyrillicLetters
} from '../config/constants.js';
import { calculateSNILSCheckSum } from './validators.js';

export function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
}

export function generateGroupName() {
    const cleanUuid = generateUUID().replace(/-/g, '');
    const shortUid = cleanUuid.substring(0, 5);
    return `imp_group_${shortUid}`;
}

export function getCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    return {
        fullDate: `${day}.${month}.${year}`,
        day: day,
        month: month,
        year: year,
        shortYear: year.toString().slice(-2)
    };
}

export function getCurrentTimestamp() {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
    return `${dateStr}_${timeStr}`;
}

export function generateSNILS() {
    let numbers = '';
    for (let i = 0; i < 9; i++) {
        numbers += Math.floor(Math.random() * 10);
    }
    let checkSum = calculateSNILSCheckSum(numbers);
    let formattedCheckSum = checkSum.toString().padStart(2, '0');
    return `${numbers.substring(0, 3)}-${numbers.substring(3, 6)}-${numbers.substring(6, 9)} ${formattedCheckSum}`;
}

export function generateSorSeries() {
    const randomRoman = romanNumerals[Math.floor(Math.random() * romanNumerals.length)];
    const randomLetter1 = cyrillicLetters.charAt(Math.floor(Math.random() * cyrillicLetters.length));
    const randomLetter2 = cyrillicLetters.charAt(Math.floor(Math.random() * cyrillicLetters.length));
    return `${randomRoman}-${randomLetter1}${randomLetter2}`;
}

export function generateRandomDigits(length) {
    let number = '';
    const digits = '0123456789';
    for (let i = 0; i < length; i++) {
        number += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return number;
}

export function generateBirthDate(options) {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - options.minAge);
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - options.maxAge);
    const randomTimestamp = minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
    const randomDate = new Date(randomTimestamp);
    const day = String(randomDate.getDate()).padStart(2, '0');
    const month = String(randomDate.getMonth() + 1).padStart(2, '0');
    const year = randomDate.getFullYear();
    return `${day}.${month}.${year}`;
}

export function generatePersonData(sex) {
    return {
        firstName: getRandomElement(sex === 1 ? maleFirstNames : femaleFirstNames),
        lastName: getRandomElement(sex === 1 ? maleLastNames : femaleLastNames),
        patronumic: getRandomElement(sex === 1 ? malePatronymics : femalePatronymics)
    };
}
