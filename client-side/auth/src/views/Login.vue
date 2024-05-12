<script setup lang="ts">
import {reactive} from "vue"
import {login} from "@/api/index";

const form = reactive({
  username: '',
  password: ''
})

function submit() {
  login(form)
      .then(data => {
        console.log(data);
        // 如果登录成功，服务器将返回一个授权码
        // 使用这个授权码和重定向URL来构造授权页面的URL
        // const url = `/decision?code=${data.code}&redirect_uri=${encodeURIComponent(data.redirect_uri)}`;
        //
        // // 将用户重定向到授权页面
        // window.location.href = url;
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

<style lang="less" scoped>

</style>