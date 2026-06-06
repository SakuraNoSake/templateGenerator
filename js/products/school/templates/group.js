import {generateOrganizationData} from "../../../utils/generators.js";
import {buildXlsxFile} from "../../../utils/xlsxBuilder.js";

const HEADERS = [
    'Название(код) класса/группы',
    'Параллель класса',
    'Смена',
    'Литера',
    'Максимальная наполняемость',
    'Краткое название ОО',
    'Идентификатор ОО в ИС ЗШ',
    'Идентификатор ОО в старой системе'
]

const COLUMN_WIDTHS = [
    {wch: 36}, // Название(код) класса/группы
    {wch: 36}, // Параллель класса
    {wch: 36}, // Смена
    {wch: 36}, // Литера
    {wch: 36}, // Максимальная наполняемость
    {wch: 36}, // Краткое название ОО
    {wch: 36}, // Идентификатор ОО в ИС ЗШ
    {wch: 36}, // Идентификатор ОО в старой системе
]

function generateGroupSchoolRow (orgGuid, shortSchoolName) {
    const groupName = generateOrganizationData();

    return HEADERS.map(header => {
        const rowObj = {
            'Название(код) класса/группы': groupName.className,
            'Параллель класса': '5',
            'Смена': 'Первая смена',
            'Литера': 'Тест',
            'Максимальная наполняемость': '25',
            'Краткое название ОО': shortSchoolName ,
            'Идентификатор ОО в ИС ЗШ': orgGuid,
            'Идентификатор ОО в старой системе': ''
        }
        return rowObj[header] ?? '';
    })
}

export function generateGroupSchoolFile(rowsCount, orgGuid, shortSchoolName) {
    const data = [];

    for (let i = 0; i < rowsCount; i++) {
        data.push(generateGroupSchoolRow(orgGuid, shortSchoolName))
    }

    return buildXlsxFile({
        headers: HEADERS,
        data,
        columnWidths: COLUMN_WIDTHS,
        sheetName: 'Классы',
        fileName: 'import-group-school'
    });
}

