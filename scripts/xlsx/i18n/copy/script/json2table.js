const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

// 读取 JSON 文件并解析
function readJSONFile(filename) {
	try {
		const data = fs.readFileSync(path.resolve(__dirname, '..', filename), 'utf8');
		return JSON.parse(data);
	} catch (err) {
		console.error(`Error reading JSON file ${filename}:`, err);
		return null;
	}
}

// 读取现有的 XLSX 文件，如果文件不存在，则创建一个新的
async function getOrCreateWorkbook() {
	return new Promise(async (resolve, reject) => {
		const filePath = path.resolve(__dirname, 'Glossary.xlsx');
		const workbook = new ExcelJS.Workbook();

		if (fs.existsSync(filePath)) {
			// 如果文件存在，读取文件
			await workbook.xlsx.readFile(filePath);
			console.log('Workbook loaded');
		} else {
			// 如果文件不存在，创建新的工作簿和工作表
			const worksheet = workbook.addWorksheet('Sheet1');
			createWorkbookWithHeader(worksheet);
			console.log('Workbook created');
		}
		resolve(workbook);
	});
}

// 创建具有标题的工作表
function createWorkbookWithHeader(worksheet) {
	// 设置列宽
	worksheet.columns = [
		{ key: 'title', width: 80 },
		{ key: 'english', width: 80 },
		{ key: 'spanish', width: 80 },
		{ key: 'simplified-chinese', width: 80 },
		{ key: 'traditional-chinese', width: 80 },
	];

	// 设置表头样式
	const headerStyle = {
		font: { bold: true, color: { argb: 'FFFFFFFF' } },
		fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0000FF' } },
	};

	// 写入表头
	worksheet
		.addRow(['Title', 'English', 'Spanish', 'Simplified Chinese', 'Traditional Chinese'])
		.eachCell((cell) => {
			cell.style = headerStyle;
		});
}

// 更新 XLSX 文件，保持第一行的样式并从下一行开始插入数据
async function updateXLSX(workbook, data) {
	const worksheet = workbook.getWorksheet(1) || workbook.addWorksheet('Sheet1');
	const outputFilePath = path.resolve(__dirname, 'Glossary.xlsx');

	// 插入数据
	data.forEach((value, key) => {
		worksheet.addRow([key, value.en, value.es, value.zh, value.tw]);
	});

	await workbook.xlsx.writeFile(outputFilePath);
	console.log(`Updated XLSX file at: ${outputFilePath}`);
}

// 主函数
async function main() {
	let jsonResult = { en: {}, es: {}, zh: {}, tw: [] };

	let hasEmpty = false;
	Object.keys(jsonResult).forEach((key) => {
		jsonResult[key] = readJSONFile(`${key}.json`) || '';
		if (!jsonResult[key]) {
			hasEmpty = true;
		}
	});

	if (hasEmpty) {
		console.error('Error reading JSON files.');
		return;
	}

	const result = new Map();

	// 合并 JSON 文件中的数据
	Object.keys(jsonResult.en).forEach((key) => {
		let data = {};
		Object.keys(jsonResult).forEach((lang) => {
			data[lang] = jsonResult[lang][key] || '';
		});
		result.set(key, data);
	});

	const workbook = await getOrCreateWorkbook();
	await updateXLSX(workbook, result);
}

main();
