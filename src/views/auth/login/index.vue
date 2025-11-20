<template>
  <div class="login-card">
    <!-- 卡片头部 -->
    <div class="card-header">
      <h2 class="card-title">欢迎回来</h2>
      <p class="card-subtitle">请登录您的MoonSuite账户</p>
    </div>

    <!-- 表单部分 -->
    <form class="login-form" @submit.prevent="handleLogin">
      <!-- 用户名输入 -->
      <div class="form-group">
        <div class="input-container">
          <svg class="input-icon" viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="currentColor"
              d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
            />
          </svg>
          <input
            type="text"
            v-model="username"
            placeholder="用户名或邮箱"
            class="form-input"
            required
          />
        </div>
      </div>

      <!-- 密码输入 -->
      <div class="form-group">
        <div class="input-container">
          <svg class="input-icon" viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="currentColor"
              d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"
            />
          </svg>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="密码"
            class="form-input"
            required
          />
          <button
            type="button"
            class="password-toggle"
            @click="showPassword = !showPassword"
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                v-if="showPassword"
                fill="currentColor"
                d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"
              />
              <path
                v-else
                fill="currentColor"
                d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 选项区域 -->
      <div class="form-options">
        <label class="checkbox-label">
          <input type="checkbox" v-model="remember" class="checkbox" />
          <span class="checkmark"></span>
          记住我
        </label>
        <!-- <a href="#" class="forgot-link">忘记密码?</a> -->
      </div>

      <!-- 登录按钮 -->
      <button
        type="submit"
        class="login-btn"
        :class="{ loading: isLoading }"
        :disabled="isLoading"
      >
        <span v-if="!isLoading">登录</span>
        <div v-else class="btn-loading">
          <div class="spinner"></div>
          登录中...
        </div>
      </button>

      <!-- 注册链接 -->
      <div class="register-link">
        还没有账户?
        <a href="#" class="link" @click="toggleState">立即注册</a>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, defineEmits } from "vue";
import { useLogin, StateType } from "./index";
// 组件内正常使用 defineEmits 定义事件
const emit = defineEmits<{
  (e: "toggleState", value: StateType): void;
}>();
const {
  state,
  toggleState,
  handleLogin,
  username,
  password,
  remember,
  showPassword,
  isLoading,
} = useLogin((newState) => {
  emit("toggleState", newState);
});
</script>

<style scoped>
@import url("./index.scss");
</style>
