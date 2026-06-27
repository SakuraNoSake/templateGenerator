export const CONTINGENT_CONFIG = {
    productName: 'Contingent',
    fileNamePrefix: 'import-cont',

    templates: [
        { id: 'person', name: 'Контингент (ЛД)' },
        { id: 'staff', name: 'Кадры' }
    ],

    buttonTexts: {
        person: 'ЛД',
        staff: 'Кадры'
    },

    templateConfig: {
        person: ['orgGuid', 'groupName', 'rowsCount'],
        staff: ['orgGuid', 'rowsCount']
    }
}