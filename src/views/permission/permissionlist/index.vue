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
      <t-button @click="openDialog()">添加权限</t-button>
    </div>
    <br />
    <t-enhanced-table
      :data="data"
      :columns="columns"
      :loading="isloading"
      row-key="id"
      :tree="treeConfig"
      cell-empty-content="-"
      :tree-expand-and-fold-icon="treeExpandAndFoldIconRender"
    />
    <permissionEditor ref="permissionEditorRef" @submit="search" />
  </layout-content>
</template>
<script setup lang="jsx">
import QueryArea from "@/components/QueryArea.vue";
import { usePermission } from "./index.tsx";
import { ref, reactive, onMounted } from "vue";
import permissionEditor from "./permissionEditor/index.vue";
const {
  queryFields,
  isloading,
  search,
  getData,
  columns,
  data,
  openDialog,
  permissionEditorRef,
  treeConfig,
  treeExpandAndFoldIconRender,
} = usePermission();

onMounted(() => {
  getData();
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
.tdesign-table-demo__table-operations .t-link:nth-child(2) {
  padding-left: 16px;
}
</style>
