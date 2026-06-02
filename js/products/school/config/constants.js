export const SCHOOL_CONFIG = {
    productName: 'Запись в школу',
    fileNamePrefix: 'import-school',

    templates: [
        { id: 'personSchool', name: 'Личные дела' },
        { id: 'groupSchool', name: 'Классы' },
        { id: 'statementSchool', name: 'Заявления' },
    ],

    buttonTexts: {
        personSchool: 'ЛД',
        groupSchool: 'Класс',
        statementSchool: 'Заявления'
    },

    templateConfig: {
        personSchool: ['orgGuid', 'groupName', 'rowsCount'],
        statementSchool: ['shortSchoolName', 'schoolInn', 'rowsCount'],
    }
}