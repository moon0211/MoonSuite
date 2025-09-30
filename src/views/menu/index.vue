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
import { defineComponent, ref, computed, watch, onUnmounted } from "vue";
const queryFields = [
  {
    label: "用户名",
    field: "username",
    type: "input",
    placeholder: "请输入用户名",
    defaultValue: "",
    props: {
      clearable: true,
    },
  },
  {
    label: "状态",
    field: "status",
    type: "select",
    options: [
      { label: "全部", value: "" },
      { label: "启用", value: 1 },
      { label: "禁用", value: 0 },
    ],
    defaultValue: "",
  },
  {
    label: "创建时间",
    field: "createTime",
    type: "date",
    range: true,
    format: "YYYY-MM-DD",
    advanced: true, // 作为高级查询条件
  },
  {
    label: "树",
    field: "tree",
    type: "treeSelect",
    options: [
      {
        label: "广东省",
        value: "guangdong",
        children: [
          {
            label: "广州市",
            value: "guangzhou",
          },
          {
            label: "深圳市",
            value: "shenzhen",
          },
        ],
      },
      {
        label: "江苏省",
        value: "jiangsu",
        children: [
          {
            label: "南京市",
            value: "nanjing",
          },
          {
            label: "苏州市",
            value: "suzhou",
          },
        ],
      },
    ],
  },
  {
    label: "角色",
    field: "role",
    type: "radioGroup",
    options: [
      { label: "全部", value: "" },
      { label: "管理员", value: "admin" },
      { label: "普通用户", value: "user" },
    ],
    advanced: true, // 作为高级查询条件
  },
  {
    label: "爱好",
    field: "hobby",
    type: "checkboxGroup",
    options: [
      { label: "草莓", value: "1" },
      { label: "苹果", value: "2" },
      { label: "西瓜", value: "3" },
    ],
    advanced: true, // 作为高级查询条件
  },
];

const isloading = ref(false);

// 初始查询数据
const initialQueryData = {
  status: "",
};
const search=(data)=>{
  console.log('我是父组件',data);
}
</script>