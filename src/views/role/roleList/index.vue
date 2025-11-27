<template>
  <QueryArea
    :fields="queryFields"
    :isloading="isloading"
    @search="search"
    :searchAfterReset="true"
  >
  </QueryArea>
  <layout-content>
    <t-table
      :data="data"
      :columns="columns"
      :loading="isloading"
      row-key="id"
    />
  </layout-content>
</template>
<script setup lang="jsx">
import QueryArea from "@/components/QueryArea.vue";
import { useRole } from "./index.tsx";
import { ref, reactive, onMounted } from "vue";

const {
  queryFields,
  isloading,
  search,
  getData,
  fetchPermissionsOptions,
  columns,
  data,
} = useRole();

onMounted(() => {
  getData();
  fetchPermissionsOptions();
});
</script>
<style scoped>
.table-op {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
<style>
.tdesign-table-demo__table-operations .t-link {
  padding: 0 8px;
}
</style>
