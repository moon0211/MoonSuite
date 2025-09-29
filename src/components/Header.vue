<template>
  <t-header>
    <t-head-menu value="item1" height="120px">
      <template #logo>
        <p class="logo">MoonSuite</p>
        
        <!-- <img
          width="136"
          class="logo"
          src="../assets/logo.png"
          alt="logo"
        /> -->
      </template>
      <template #operations>
        <div class="user">
          <t-avatar size="medium" class="avatar"> M </t-avatar>
          moon
        </div>
      </template>
    </t-head-menu>
  </t-header>
</template>
<style scoped>
.user > .avatar {
  margin-right: 10px;
}
.logo{
  font-size: 26px;
  color: #0c1e44;
  font-weight: 600;
  
}
</style>