export const DOU_CONFIG = {
    productName: 'ДОУ',
    fileNamePrefix: 'import-dou',

    templates: [
        { id: 'statements', name: 'Заявления' },
        { id: 'personal_files', name: 'Личные дела' },
        { id: 'groups', name: 'Группы' },
    ],

    buttonTexts: {
        statements: 'Заявления',
        personal_files: 'Личные дела',
        groups: 'Группы',
    },

    templateConfig: {
        statements: ['status', 'type', 'dooName', 'dooInn', 'rowsCount'],
        groups: ['dooName', 'dooInn', 'rowsCount'],
        personal_files: ['dooName', 'dooInn', 'rowsCount', 'groupName']
    }
};