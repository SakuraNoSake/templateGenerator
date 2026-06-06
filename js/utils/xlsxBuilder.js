import {createResult} from "./formatters.js";

export function buildXlsxFile({ headers, data, columnWidths, sheetName, fileName}) {
    const wb = XLSX.utils.book_new();

    const wsData = [headers, ...data];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    if (columnWidths) {
        ws['!cols'] = columnWidths;
    }

    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    return createResult(wb, fileName, data.length);
}