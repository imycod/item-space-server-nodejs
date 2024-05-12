const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// 从 XLSX 文件中读取数据并转换为 JSON 格式
async function tableToJSON(filename) {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(path.resolve(__dirname, filename));
        const worksheet = workbook.worksheets[0]; // 假设数据在第一个工作表中
        const jsonResult = { en: {}, es: {}, zh: {} };

        // 遍历每一行数据，将每行的标题作为键，对应的翻译作为值
        worksheet.eachRow(function(row, rowNumber) {
            if (rowNumber > 1) { // 从第二行开始读取，因为第一行是标题
                const title = row.getCell(1).text; // 第一列是标题
                jsonResult.en[title] = row.getCell(2).text || ''; // 第二列是英语
                jsonResult.es[title] = row.getCell(3).text || ''; // 第三列是西班牙语
                jsonResult.zh[title] = row.getCell(4).text || ''; // 第四列是中文
            }
        });

        return jsonResult;
    } catch (err) {
        console.error(`Error reading XLSX file ${filename}:`, err);
        return null;
    }
}

// 写入 JSON 数据到文件
function writeJSONToFile(data, language, outputDir) {
    const outputFilename = path.join(outputDir, `${language}.json`);
    try {
        fs.writeFileSync(outputFilename, JSON.stringify(data, null, 4), 'utf8');
        console.log(`JSON data for ${language} written to ${outputFilename}`);
    } catch (err) {
        console.error(`Error writing JSON data for ${language} to file ${outputFilename}:`, err);
    }
}

// 主函数
async function main() {
    const xlsxFile = 'Glossary.xlsx'; // 替换成你的表格文件路径
    const outputDir = path.join(__dirname, 'output'); // 输出文件夹路径

    // 创建输出文件夹
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const jsonData = await tableToJSON(xlsxFile);
    if (jsonData) {
        // 将数据写入各个语言的 JSON 文件
        writeJSONToFile(jsonData.en, 'en', outputDir);
        writeJSONToFile(jsonData.es, 'es', outputDir);
        writeJSONToFile(jsonData.zh, 'zh', outputDir);
    } else {
        console.error('Error converting XLSX file to JSON.');
    }
}

main();
