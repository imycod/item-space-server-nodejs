const XLSX = require("xlsx");

// 读取Excel文件
const workbook = XLSX.readFile(__dirname + '/PermissionList.xlsx');

// 获取第一个sheet的名称
const sheetName = workbook.SheetNames[0];

// 获取第一个sheet的数据
const worksheet = workbook.Sheets[sheetName];

// 将Excel数据转换成JSON格式
const data = XLSX.utils.sheet_to_json(worksheet);

// 打印解析后的数据 //
// console.log(data);

let category, subcategory = '';

function processData(data) {
    // 后期处理
    return data.map(row => {
        if (row.Category) {
            category = row.Category;
        } else {
            row.Category = category;
        }
        if (row.Subcategory) {
            subcategory = row.Subcategory;
        } else {
            row.Subcategory = subcategory
        }
        return row
    })
}

const newData = processData(data)

const lowerCase = str => str.toLowerCase().replace(/\s/g, '_')
// 判断字符开头是不是字母
const isLetter = str => /\b[a-zA-Z]\w*\b/g.test(str)

const toLowerCase = str => isLetter(str) ? str.toLowerCase().replace(/\s/g, '_') : str

function injectData(data) {
    let applicationCode = lowerCase(data[0].Application)
    const gensqlData = data.filter(row => {
        return row.Comment === 'button'
    })
    console.log(gensqlData)
    for (let i = 0; i < gensqlData.length; i++) {
        const {Category, Subcategory, Elements, Control, Comment} = gensqlData[i]
        const category = lowerCase(Category.trim())
        const subcategory = lowerCase(Subcategory.trim())
        const elements = Elements && lowerCase(Elements?.trim())

        const pvalues = `'${applicationCode}::web::${category}::${subcategory}', 'WEB', '1', '', 'Other', '', null, '${applicationCode}'`
        const psql = `INSERT INTO idm_permission (name, category, isActive, description, groupName, locatedPage,
                                                         remoteId, applicationCode)
                             VALUES (${pvalues});`
        console.log(psql)
        if (Control) {
            const action = Control.split('/').map(ac => `${elements}_${lowerCase(ac)}`)
            action.forEach(ac => {
                const values = `'${applicationCode}::web::${category}::${subcategory}::${ac}', 'WEB', '1', '${Comment}', 'Other', '', null, '${applicationCode}'`

                const sql = `INSERT INTO idm_permission (name, category, isActive, description, groupName, locatedPage,
                                                         remoteId, applicationCode)
                             VALUES (${values});`
                console.log(sql)
            })
        }
    }
}


console.log(injectData(data));