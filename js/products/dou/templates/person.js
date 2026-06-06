// templates/personal-files.js
import { createEmptyWorkbook, createResult } from '../../../utils/formatters.js';

export function generatePersonalFilesFile() {
    const wb = createEmptyWorkbook('Шаблон для личных дел находится в разработке', 'Личные дела');
    return createResult(wb, 'import-person-in-doo', 0);
}