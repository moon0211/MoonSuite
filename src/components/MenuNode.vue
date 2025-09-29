<template>
  <t-submenu v-if="node.type === 'submenu'" :value="node.value">
    <template #icon>
      <t-icon v-if="node.icon" :name="node.icon" />
    </template>
    <template #title>
      <span>{{ node.title }}</span>
    </template>
    <!-- 父组件接收到子组件的node数据，直接向外抛出，不修改原始数据，只做透传 -->
    <menu-node
      v-for="child in node.children"
      :key="child.value"
      :node="child"
      @router-change="$emit('router-change', $event)"
    />
  </t-submenu>

  <t-menu-item
    v-else-if="node.type === 'menuItem'"
    :value="node.value"
    @click="handleClick(node)"
  >
    <template #icon>
      <t-icon v-if="node.icon" :name="node.icon" />
    </template>
    {{ node.title }}
  </t-menu-item>
</template>

<script setup>
const props = defineProps({
  node: {
    type: Object,
    required: true,
    validator: (val) =>
      ["submenu", "menuItem"].includes(val.type) && val.value && val.title,
  },
});
console.log("props: ", props);
const emit = defineEmits(["router-change"]);

const handleClick = (node) => {
  if (node.type === "menuItem" && node) {
    emit("router-change", node);
  }
};
</script>