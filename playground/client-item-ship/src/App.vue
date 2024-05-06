<script setup lang="ts">
import {getProtection, getToken, refreshToken} from '@/api/token/index.ts'
</script>

<template>
  <button @click="getToken">get token</button>
  <button @click="getProtection">get data</button>
  <button @click="refreshToken">refresh-token</button>
<!--  <router-view></router-view>-->
</template>

<style scoped>

</style>
