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
  <div class="layout">
    <t-layout>
      <Header />
      <t-layout>
        <t-aside>
          <Menu :menuData="menuStore.menuList" />
        </t-aside>
        <t-layout>
          <LayoutContent>
            <router-view></router-view>
          </LayoutContent>
          <t-footer
            >Copyright @ 2019-{{ new Date().getFullYear() }} Tencent. All Rights
            Reserved</t-footer
          >
        </t-layout>
      </t-layout>
    </t-layout>
  </div>
</template>

<style scoped>
.layout {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 100vh;
  color: #000;
}
</style>
