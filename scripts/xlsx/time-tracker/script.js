import axios from "axios";
import dayjs from "dayjs";

const baseUrl = "https://timetracker.logisticsteam.com";

const token = "";
const userId = ''; // userId
const startDay = "2024-05-21T09:00:00";
const endDay = "2024-05-22T09:00:00";

axios.defaults.headers["authorization"] = `${token}`;
axios.defaults.headers["priority"] = `u=1, i`;
axios.defaults.headers["referer"] = `https://timetracker.logisticsteam.com/`;
axios.defaults.headers['accept-language'] = 'zh-CN,zh;q=0.9,en;q=0.8';
axios.defaults.headers['sec-ch-ua'] = `"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"`;
axios.defaults.headers['sec-ch-ua-mobile'] = '?0';
axios.defaults.headers['sec-ch-ua-platform'] = 'Windows';
axios.defaults.headers['sec-fetch-dest'] = 'empty';
axios.defaults.headers['sec-fetch-mode'] = 'cors';
axios.defaults.headers['sec-fetch-site'] = 'same-origin';
axios.defaults.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

// 提交日报
function submit(data) {
  const api = `/timetracker/time-record`;
  return axios.post(baseUrl + api, data);
}

async function submitData(startTime, endTime) {
  // 基本递归条件，结束递归
  if (startTime.isBefore(endTime, "day") || startTime.isSame(endTime, "day")) {
    // 请求体
    const projectNames = ["Ship", "Pass", "Central"];
    const amDurationTime = 3; //上午工作时间
    const pmDurationTime = 5; //下午工作时间
    const restTime = 1; //午休时间
    const durationTime = amDurationTime + pmDurationTime;
    // 上午
    const am = {
      userId,
      type: "ManualEntry",
      moduleName: "Item.com",
      projectName: projectNames[getRandomInt(0, 2)],
      taskName: "Coding",
      startTime: startTime.format("YYYY-MM-DDTHH:mm:ss"),
      endTime: startTime
        .add(amDurationTime, "hour")
        .format("YYYY-MM-DDTHH:mm:ss"),
      duration: `${amDurationTime}:00:00`,
      description: "",
    };
    console.log("am", am);

    // 下午
    const pm = {
      userId,
      type: "ManualEntry",
      moduleName: "Item.com",
      projectName: projectNames[getRandomInt(0, 2)],
      taskName: "Coding",
      startTime: startTime
        .add(amDurationTime + restTime, "hour")
        .format("YYYY-MM-DDTHH:mm:ss"),
      endTime: startTime
        .add(restTime + durationTime, "hour")
        .format("YYYY-MM-DDTHH:mm:ss"),
      duration: `${pmDurationTime}:00:00`,
      description: "",
    };
    console.log("pm", pm);

    await submit(am);
    await submit(pm);

    // 递归调用，增加1天
    const nextDate = startTime.add(1, "day");
    submitData(nextDate, endTime);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const start = dayjs(startDay);
  const end = dayjs(endDay);
  submitData(start, end);
}

main();
