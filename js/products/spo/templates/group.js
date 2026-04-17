import {generateOrganizationData} from "../../../utils/generators.js";
import {buildXlsxFile} from "../../../utils/xlsxBuilder.js";

const HEADERS = [
    'Название(код) группы',
    'Дата открытия группы',
    'Год освоения ОП',
    'Число мест',
    'Краткое название ОО',
    'Идентификатор ОО в ИС',
    'Идентификатор образовательной программы в ИС',
    'Образовательная программа'
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
]

function generateRowGroupSpo (orgName, orgUid, educProgramId,educProgram) {
    const groupName = generateOrganizationData()

    return HEADERS.map(header => {
        const rowObj = {
            'Название(код) группы': groupName.groupName,
            'Дата открытия группы': '01.09.2024',
            'Год освоения ОП': '5',
            'Число мест': '40',
            'Краткое название ОО': orgName,
            'Идентификатор ОО в ИС': orgUid,
            'Идентификатор образовательной программы в ИС': educProgramId,
            'Образовательная программа': educProgram
        }
        return rowObj[header] ?? '';
    })
}

export function generateGroupSpoFile (rowsCount, orgName, orgUid, educProgramId,educProgram ) {
    const data = [];

    for (let i = 0; i < rowsCount; i++) {
        data.push(generateRowGroupSpo(orgName, orgUid, educProgramId,educProgram))
    }

    return buildXlsxFile({
        headers: HEADERS,
        data,
        columnWidths: COLUMN_WIDTHS,
        sheetName: 'Группы',
        fileName: 'import-group-spo'
    });
}