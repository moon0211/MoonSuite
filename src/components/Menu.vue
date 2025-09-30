<template>
  <t-menu
    mode="vertical"
    v-model:expanded="expanded"
    :value="currentMenu"
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
import { ref, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
const route = useRoute();

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
const currentMenu = ref(null);
const router = useRouter();
// watchEffect(() => {
//   if (route.path && props.menuData && props.menuData.length > 0) {
//     currentMenu.value = route.path;
//     expanded.value = findRootAndChildValue(route.path, props.menuData);
//     console.log("expandwatchEffected.value : ", expanded.value);
//   }
// });

const jump = (node) => {
  console.log("jump: ", node);
  currentMenu.value = node.value;
  expanded.value = findRootAndChildValue(node.value, props.menuData);
  console.log(" expandjumped.value: ", expanded.value);
  router.push(node.value);
};

/**
 * 递归查找子菜单对应的根菜单value
 * @param {string} childValue 子菜单的value
 * @param {Array} menuList 菜单列表
 * @returns {Array|null} 根菜单value和子菜单value的数组，未找到则返回null
 */
const findRootAndChildValue = (childValue, menuList, pathList = []) => {
  console.log("menuList: ", menuList?.length);
  // 遍历菜单列表
  for (const menu of menuList) {
    // 如果是子菜单容器且有子项
    if (menu.type === "submenu" && Array.isArray(menu.children)) {
      // 检查当前层级的子项中是否有匹配的value
      const isChildInThisLevel = menu.children.some(
        (item) => item.value === childValue
      );
      let pathList1 = [...pathList, menu.value];

      // 如果在当前层级找到匹配的子项，返回当前菜单value和子项value
      if (isChildInThisLevel) {
        return [...pathList1, childValue];
      }
      // 否则递归查找下一级菜单
      const result = findRootAndChildValue(
        childValue,
        menu.children,
        pathList1
      );
      if (result) {
        return result;
      }
    }
  }

  // 未找到匹配的子菜单,那就是根级的菜单
  return [childValue];
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