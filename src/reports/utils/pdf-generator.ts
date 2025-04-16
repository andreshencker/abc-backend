const PdfPrinter = require('pdfmake');
import * as fs from 'fs';

const fonts = {
    Roboto: {
        normal: 'node_modules/pdfmake/build/vfs_fonts.js',
        bold: 'node_modules/pdfmake/build/vfs_fonts.js',
    },
};

const printer = new PdfPrinter(fonts);

export const generatePDF = async (data: any[], title: string): Promise<Buffer> => {
    const body = [
        Object.keys(data[0]).map((key) => ({ text: key, bold: true })),
        ...data.map((row) => Object.values(row).map((val) => String(val))),
    ];

    const docDefinition = {
        content: [
            { text: title, style: 'header' },
            {
                table: {
                    headerRows: 1,
                    body,
                },
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                marginBottom: 10,
            },
        },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
        pdfDoc.on('data', (chunk) => chunks.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.end();
    });
};