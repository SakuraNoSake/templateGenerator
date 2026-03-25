export const DOU_CONSTANTS = {
    productName: 'ДОУ',
    fileNamePrefix: 'import-request-dou',

    templates: [
        { id: 'statements', name: 'Заявления' },
        { id: 'personal_files', name: 'Личные дела' },
        { id: 'groups', name: 'Группы' },
        { id: 'staff', name: 'Кадры' }
    ],

    buttonTexts: {
        statements: 'Заявления',
        personal_files: 'Личные дела',
        groups: 'Группы',
        staff: 'Кадры'
    },

    templateConfig: {
        statements: ['status', 'type', 'dooName', 'dooInn', 'rowsCount'],
        staff: ['guidDoo', 'rowsCount'],
        groups: ['dooName', 'dooInn', 'rowsCount'],
        personal_files: ['dooName', 'dooInn', 'rowsCount', 'groupName']
    }
};