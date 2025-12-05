<template>
  <QueryArea
    :fields="queryFields"
    :isloading="isloading"
    @search="search"
    :searchAfterReset="true"
  >
  </QueryArea>
  <layout-content>
    <div class="table-op">
      <t-button @click="openDialog()">添加角色</t-button>
    </div>
    <br />
    <t-table
      :data="data"
      :columns="columns"
      :loading="isloading"
      row-key="id"
    />
    <roleEditor ref="roleEditorRef" @submit="search" />
  </layout-content>
</template>
<script setup lang="jsx">
import QueryArea from "@/components/QueryArea.vue";
import { useRole } from "./index.tsx";
import { ref, reactive, onMounted } from "vue";
import roleEditor from "./roleEditor/index.vue";
const {
  queryFields,
  isloading,
  search,
  getData,
  fetchPermissionsOptions,
  columns,
  data,
  openDialog,
  roleEditorRef,
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
  padding: 6px 6px 0 6px;
}
</style>
<style>
.tdesign-table-demo__table-operations .t-link {
  padding: 0 8px;
}
</style>
