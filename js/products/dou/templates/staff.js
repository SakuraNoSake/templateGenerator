// templates/staff.js
import { createEmptyWorkbook, createResult } from '../../../utils/formatters.js';

export function generateStaffFile() {
    const wb = createEmptyWorkbook('Шаблон для кадров находится в разработке', 'Кадры');
    return createResult(wb, 'import-staff-in-doo', 0);
}