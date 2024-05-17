/*
 * @Author: wuxs 317009160@qq.com
 * @Date: 2024-05-16 21:14:08
 * @LastEditors: wuxs 317009160@qq.com
 * @LastEditTime: 2024-05-16 21:39:14
 * @FilePath: \primevue-tailwind-elementd:\code\workcode\item-space-server-nodejs\server-side\demo\controllers\client.controller.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const Client = require("../models/client.model");
const { object, string, number, date } = require("yup");

exports.create = async (req, res) => {
  // Validate request
  let clientSchema = object({
    name: string().required(),
    id: string().required(),
    secret: string().required(),
    redirectUrl: string().required(),
  });

  try {
    await clientSchema.validate(req.body);
    // Save authorization code in the database
    Client.create(req.body)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the client.",
        });
      });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};
