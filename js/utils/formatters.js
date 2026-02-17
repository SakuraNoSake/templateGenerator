// utils/formatters.js
import { getCurrentTimestamp } from './generators.js';

export function createEmptyWorkbook(message, sheetName) {
    const wb = XLSX.utils.book_new();
    const wsData = [[message]];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [{wch: 45}];
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    return wb;
}

export function createResult(wb, filename, count = 0) {
    return {
        wb,
        filename: `${filename}_${getCurrentTimestamp()}.xlsx`,
        count
    };
}