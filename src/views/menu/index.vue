<template>
  <QueryArea
    :fields="queryFields"
    :initial-data="initialQueryData"
    :isloading="isloading"
    @search="search"
    :searchAfterReset="true"
  ></QueryArea>
  <layout-content>
    <div>
      <div class="table-op">
        <t-button @click="openDialog()">添加菜单</t-button>

        <t-button
          theme="default"
          style="margin-left: 16px"
          @click="onExpandAllToggle"
          >{{ expandAll ? "收起全部" : "展开全部" }}</t-button
        >
      </div>
      <br />
      <t-enhanced-table
        ref="tableRef"
        v-model:expandedTreeNodes="expandedTreeNodes"
        row-key="id"
        drag-sort="row-handler"
        :data="data"
        :columns="columns"
        :tree="treeConfig"
        :tree-expand-and-fold-icon="treeExpandAndFoldIconRender"
        :pagination="pagination"
        lazy-load
        @page-change="onPageChange"
      ></t-enhanced-table>
    </div>
    <menuEditor @submit="refreshMenu" ref="menuEditorRef" />
  </layout-content>
</template>

<script setup lang="jsx">
import QueryArea from "@/components/QueryArea.vue";
import menuEditor from "./menuEditor/index.vue"
import { useMenu } from "./index.jsx";
import { ref, reactive,  onMounted } from "vue";
import {
  EnhancedTable as TEnhancedTable,
} from "tdesign-vue-next";

import { useMenuStore } from '@/store/menu'


const {
        queryFields,
        initialQueryData,
        isloading,
        search,
        data,
        expandAll,
        pagination,
        getData,
        refreshMenu,
        tableRef,
        lazyLoadingData,
        expandedTreeNodes,
        treeConfig,
        columns,
        onPageChange,
        treeExpandAndFoldIconRender,
        onExpandAllToggle,
        menuEditorRef,
        openDialog } 
        = useMenu(useMenuStore);

onMounted(() => {
  getData();
});




</script>


<style>
.tdesign-table-demo__table-operations .t-link {
  padding: 0 8px;
}
.table-op {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>