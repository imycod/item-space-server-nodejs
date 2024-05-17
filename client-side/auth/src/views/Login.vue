<!--
 * @Author: wuxs 317009160@qq.com
 * @Date: 2024-05-16 20:51:33
 * @LastEditors: wuxs 317009160@qq.com
 * @LastEditTime: 2024-05-17 06:49:01
 * @FilePath: \primevue-tailwind-elementd:\code\workcode\item-space-server-nodejs\client-side\auth\src\views\Login.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { reactive } from "vue"
import { login, authorize } from "@/api/index";
import { useRoute, useRouter } from "vue-router"

const form = reactive({
  username: '',
  password: ''
})

const route = useRoute()
const router = useRouter()

function submit() {
  login(form)
    .then(data => {
      console.log(route.query);
      authorize(route.query).then(data => {
        sessionStorage.setItem('transaction_oauth2', JSON.stringify(data));
        // 跳转到授权页面
        // window.location.href = data.url;
        const queryString = new URLSearchParams(route.query).toString();
        router.push(`/decision?${queryString}`)
      })
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
</script>

<template>
  <!--  email & password-->
  <h1>login page</h1>
  <el-input v-model="form.username"></el-input>
  <el-input v-model="form.password" type="password"></el-input>
  <el-button type="primary" @click="submit">login</el-button>
</template>

<style lang="less" scoped></style>