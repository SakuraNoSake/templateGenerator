export const SCHOOL_CONFIG = {
    productName: 'Запись в школу',
    fileNamePrefix: 'import-school',

    templates: [
        { id: 'groupSchool', name: 'Классы' },
        { id: 'statementSchool', name: 'Заявления' },
    ],

    buttonTexts: {
        groupSchool: 'Класс',
        statementSchool: 'Заявления'
    },

    templateConfig: {
        groupSchool: ['orgGuid', 'shortSchoolName', 'rowsCount'],
        statementSchool: ['shortSchoolName', 'schoolInn', 'rowsCount'],
    }
}