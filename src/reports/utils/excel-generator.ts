import * as ExcelJS from 'exceljs';

export const generateExcel = async (data: any[], sheetName: string): Promise<Buffer> => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(sheetName);

    if (data.length > 0) {
        const columns = Object.keys(data[0]).map((key) => ({
            header: key,
            key,
            width: 20,
        }));
        sheet.columns = columns;
        sheet.addRows(data);
    }

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer); // ✅ compatible con NestJS + Express
};