<template>
  <QueryArea
    :fields="queryFields"
    :initial-data="initialQueryData"
    :isloading="isloading"
    @search="search"
    :searchAfterReset="true"
  ></QueryArea>
  <layout-content>hihi</layout-content>
</template>
<script setup>
import QueryArea from "../../components/QueryArea.vue";
import { useMenu } from "./index.js";
const { queryFields, initialQueryData, isloading,search } = useMenu();


</script>