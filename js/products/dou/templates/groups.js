// templates/groups.js
import { createEmptyWorkbook, createResult } from '../../../utils/formatters.js';

export function generateGroupsFile() {
    const wb = createEmptyWorkbook('Шаблон для групп находится в разработке', 'Группы');
    return createResult(wb, 'import-eo-group-for-doo', 0);
}