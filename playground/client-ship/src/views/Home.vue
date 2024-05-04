<script setup lang="ts">
import {ref} from "vue"
import {generateApi, chatApi} from "@/api/ollama";

let index = 0;
let msg = ""; // 你的消息内容
let token = ref("")
const inputValue = ref('')
function displayMessage() {
  if (index < msg.length) {
    token.value += msg.charAt(index);
    index++;
  } else {
    clearInterval(intervalId);
  }
}
let intervalId = setInterval(displayMessage, 500);
async function sendMessage() {
  const message = {role: 'user', content: inputValue.value}
  const responseStream = await chatApi(message)
  for await (const response of responseStream) {
    if (response.message.role === 'assistant') {
      msg = response.message.content;
      index = 0;
      intervalId = setInterval(displayMessage, 500);
    }
    if (response.done) {
      clearInterval(intervalId);
    }
  }
  inputValue.value =''
}
function onEnterCall() {
  sendMessage()
  inputValue.value =''
}
</script>

<template>
  <!--  <div>-->
  <!--    <a href="https://vitejs.dev" target="_blank">-->
  <!--      <img src="/vite.svg" class="logo" alt="Vite logo" />-->
  <!--    </a>-->
  <!--    <a href="https://vuejs.org/" target="_blank">-->
  <!--      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />-->
  <!--    </a>-->
  <!--  </div>-->
  <span>{{token}}</span>
  <br>
  <input type="text" v-model="inputValue" @keyup.enter="onEnterCall">
  <button @click="sendMessage">sendMessage</button>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>