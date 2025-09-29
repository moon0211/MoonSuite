<template>
  <t-menu
    mode="vertical"
    v-model:expanded="expanded"
    theme="light"
    default-value="main-dashboard"
    :collapsed="collapsed"
    expand-mutex
  >
    <menu-node
      v-for="item in menuData"
      :key="item.value"
      :node="item"
      @router-change="jump"
    />
    <template #operations>
      <t-button variant="text" shape="square" @click="changeCollapsed">
        <template #icon><t-icon name="view-list" /></template>
      </t-button>
    </template>
  </t-menu>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  menuData: {
    type: Array,
    default: () => [],
  },
});

const collapsed = ref(false);
const changeCollapsed = () => {
  console.log("changeCollapsed: ", changeCollapsed);
  collapsed.value = !collapsed.value;
};

const expanded = ref([]);
const router = useRouter();
const jump = (node) => {
  expanded.value = formatToExpandedArray(node.value);
  router.push(node.path);
};
const formatToExpandedArray = (value) => {
  // 解析出所有父级value（只保留到二级菜单）
  const valueParts = value.split("-");
  // 只取前两级父菜单的value（"3" 和 "3-5"）
  const parentValues = [];
  if (valueParts.length >= 2) {
    parentValues.push(valueParts[0]); // 一级菜单value："3"
    parentValues.push(valueParts.slice(0, 2).join("-")); // 二级菜单value："3-5"
  }
  return parentValues;
};
</script>
<style lang="scss" scoped>
.t-demo-collapse-btn {
  color: #fff;
  &:hover {
    background-color: #4b4b4b;
    border-color: transparent;
    --ripple-color: #383838;
  }
}
</style>