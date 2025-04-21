const PdfPrinter = require('pdfmake');
import * as fs from 'fs';
import * as path from 'path';

const fonts = {
    Roboto: {
        normal: path.resolve(__dirname, '../../assets/fonts/Roboto-Regular.ttf'),
        bold: path.resolve(__dirname, '../../assets/fonts/Roboto-Bold.ttf'),
    },
};

const printer = new PdfPrinter(fonts);

export const generatePDF = async (data: any[], title: string): Promise<Buffer> => {
    if (!data || data.length === 0) {
        throw new Error('No data available to generate PDF');
    }

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
        defaultStyle: {
            font: 'Roboto',
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

