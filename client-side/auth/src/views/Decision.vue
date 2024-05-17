<script setup lang="ts">
import {reactive} from "vue"
import {decision} from "@/api/index";

const transactionObj = JSON.parse(sessionStorage.getItem('transaction_oauth2') || '{}')

const state = reactive({
  user:transactionObj.user,
  client: transactionObj.client,
  transactionID: transactionObj.transactionID
})

async function authorize(val: string) {
  const result = await decision({
    transaction_id: state.transactionID,
    decision: val
  })
  console.log(result)
}
</script>

<template>
  <p>{{ state.user.username }}</p>
  <p><b>{{ state.client.name }}</b> is requesting <b>full access</b> to your account.</p>
  <p>Do you approve?</p>

  <el-button @click="authorize('Allow')">allow</el-button>
  <el-button @click="authorize('Deny')">cancel</el-button>
</template>

<style scoped>

</style>