import {generateOrganizationData} from "../../../utils/generators.js";
import {buildXlsxFile} from "../../../utils/xlsxBuilder.js";

const HEADERS = [
    'Краткое наименование ОО из ИС',
    'GUID колледжа из ИС',
    'Дата начала действия',
    'Дата окончания действия',
    'бессрочная',
    'Наименование ОП',
    'Уровень образования',
    'Тип образовательной программы',
    'Адаптированность',
    'Количество мест',
    'Базовый уровень образования',
    'Форма получения образования',
    'Форма обучения',
    'Тип финансирования',
    'Специальность или профессия',
    'Продолжительность обучения, мес',
    'Часы освоения',
    'Наличие вступительных испытаний',
    'Расширенная мед.справка'
]

const COLUMN_WIDTHS = [
    {wch: 36},
    {wch: 36},
    {wch: 36},
    {wch: 36},
    {wch: 36},
    {wch: 36},
    {wch: 36},
    {wch: 36},
    {wch: 36},
    {wch: 36},
    {wch: 36},
    {wch: 36},
    {wch: 36},
    {wch: 36},
    {wch: 36},
    {wch: 36},
    {wch: 36},
    {wch: 36},
    {wch: 36},
]

function generateEducProgramRow(orgName, orgUid) {
    const educProgramName = generateOrganizationData()
    return HEADERS.map(header => {
        const rowObj = {
            'Краткое наименование ОО из ИС': orgName,
            'GUID колледжа из ИС': orgUid,
            'Дата начала действия': '01.09.2024',
            'Дата окончания действия': '',
            'бессрочная': 'да',
            'Наименование ОП': educProgramName.educProgramName,
            'Уровень образования': 'Среднее профессиональное образование',
            'Тип образовательной программы': 'Образовательная программа среднего общего образования',
            'Адаптированность': 'Адаптирована',
            'Количество мест': '25',
            'Базовый уровень образования': 'Основное общее образование',
            'Форма получения образования': 'В образовательной организации',
            'Форма обучения': 'Очно',
            'Тип финансирования': 'Платное',
            'Специальность или профессия': 'Авиационные приборы и комплексы',
            'Продолжительность обучения, мес': '36',
            'Часы освоения': '900',
            'Наличие вступительных испытаний': 'да',
            'Расширенная мед.справка': 'да'
        };
        return rowObj[header] ?? '';
    });
}

export function generateEducProgramFile(rowsCount, orgName, orgUid) {
    const data = [];

    for (let i = 0; i < rowsCount; i++) {
        data.push(generateEducProgramRow(orgName, orgUid))
    }

    return buildXlsxFile({
        headers: HEADERS,
        data,
        columnWidths: COLUMN_WIDTHS,
        sheetName: 'Образовательные программы',
        fileName: 'import-educ-program-spo'
    });
}