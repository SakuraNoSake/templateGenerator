import { getCurrentTimestamp } from './generators.js';

export function createResult(wb, filename, count = 0) {
    return {
        wb,
        filename: `${filename}_${getCurrentTimestamp()}.xlsx`,
        count
    };
}