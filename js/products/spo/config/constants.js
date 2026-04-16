export const SPO_CONFIG = {
    productName: 'Запись в СПО',
    fileNamePrefix: 'import-spo',

    templates: [
        { id: 'spoPersonTemplate', name: 'Личные дела' },
        { id: 'spoGroupTemplate', name: 'Группы' },
        { id: 'spoEducProgramTemplate', name: 'Образовательная программа' },
    ],

    buttonTexts: {
        spoPersonTemplate: 'ЛД',
        spoGroupTemplate: 'Группы',
        spoEducProgramTemplate: 'ОП'
    },

    templateConfig: {
        spoPersonTemplate: ['orgName', 'orgUid', 'groupName', 'educProgram', 'rowsCount'],
        spoGroupTemplate: ['orgName', 'orgUid', 'rowsCount'],
        spoEducProgramTemplate: ['orgName', 'orgUid', 'rowsCount']
    }
}