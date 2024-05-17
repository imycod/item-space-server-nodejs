/*
 * @Author: wuxs 317009160@qq.com
 * @Date: 2024-05-16 20:51:33
 * @LastEditors: wuxs 317009160@qq.com
 * @LastEditTime: 2024-05-16 21:32:14
 * @FilePath: \primevue-tailwind-elementd:\code\workcode\item-space-server-nodejs\server-side\demo\models\authorizationCode.model.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const moogoose = require('mongoose');

const Schema = moogoose.Schema

const authorizationCodeSchema = new Schema({
    code: {type: String, required: true},
    redirectUrl: {type: String, required: true},
    clientId: {type: String, required: true},
    userId: {type: String, required: true},
})

const AuthorizationCode = moogoose.model('authorization_code', authorizationCodeSchema);

module.exports = AuthorizationCode;