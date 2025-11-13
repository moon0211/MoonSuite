<script setup>
import Header from "./components/Header.vue";
import Menu from "./components/Menu.vue";
import { onMounted } from "vue";
import { useMenuStore } from "./store/menu";
const menuStore = useMenuStore();
const fetchMenu = async () => {
  await menuStore.fetchMenuList();
};
onMounted(fetchMenu);
</script>

<template>
  <template v-if="$route.meta.fullScreen">
    <router-view></router-view>
  </template>
  <template v-else>
    <div class="layout">
      <t-layout>
        <Header />
        <t-layout>
          <t-aside>
            <Menu :menuData="menuStore.menuList" />
          </t-aside>
          <t-layout>
            <router-view></router-view>
            <p class="footer">
              Copyright @ 2025-{{ new Date().getFullYear() }} MoonSuite. All
              Rights Reserved
            </p>
          </t-layout>
        </t-layout>
      </t-layout>
    </div>
  </template>
</template>

<style scoped>
.layout {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 100vh;
  color: #000;
}
.footer {
  width: 100%;
  text-align: center;
  color: #909090;
  padding: 4px 0 12px 0;
  margin: 0;
}
:deep(.t-layout__sider) {
  max-width: 232px;
  width: auto;
}
</style>
