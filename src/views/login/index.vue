<template>
  <div class="moon-suite-login">
    <!-- 星空背景 -->
    <div class="stars"></div>
    <div class="stars stars-2"></div>

    <!-- 主容器 -->
    <div class="login-container">
      <!-- 左侧装饰 -->
      <div class="decorative-side">
        <div class="moon"></div>
        <div class="floating-element element-1"></div>
        <div class="floating-element element-2"></div>
        <div class="floating-element element-3"></div>
        <h1 class="brand-title">MoonSuite</h1>
        <!-- <p class="brand-subtitle">by moon</p> -->
      </div>

      <!-- 右侧表单 -->
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
              <svg
                class="input-icon"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <path
                  fill="currentColor"
                  d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
                />
              </svg>
              <input
                type="text"
                v-model="form.username"
                placeholder="用户名或邮箱"
                class="form-input"
                required
              />
              <div class="input-underline"></div>
            </div>
          </div>

          <!-- 密码输入 -->
          <div class="form-group">
            <div class="input-container">
              <svg
                class="input-icon"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <path
                  fill="currentColor"
                  d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"
                />
              </svg>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
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
              <div class="input-underline"></div>
            </div>
          </div>

          <!-- 选项区域 -->
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.remember" class="checkbox" />
              <span class="checkmark"></span>
              记住我
            </label>
            <a href="#" class="forgot-link">忘记密码?</a>
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

          <!-- 分割线 -->
          <div class="divider">
            <span>或</span>
          </div>

          <!-- 社交登录 -->
          <!-- <div class="social-login">
            <button
              type="button"
              class="social-btn github"
              @click="socialLogin('github')"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                />
              </svg>
              GitHub
            </button>
            <button
              type="button"
              class="social-btn google"
              @click="socialLogin('google')"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="currentColor"
                  d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                />
              </svg>
              Google
            </button>
          </div> -->

          <!-- 注册链接 -->
          <div class="register-link">
            还没有账户?
            <a
              href="#"
              class="link"
              @click.prevent="$emit('switch-to-register')"
              >立即注册</a
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

// 定义事件
const emit = defineEmits(["switch-to-register", "login"]);

// 响应式数据
const form = reactive({
  username: "",
  password: "",
  remember: false,
});

const showPassword = ref(false);
const isLoading = ref(false);

// 方法
const handleLogin = async () => {
  if (!form.username || !form.password) {
    return;
  }

  isLoading.value = true;

  // 模拟登录API调用
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    emit("login", { ...form });
  } catch (error) {
    console.error("登录失败:", error);
  } finally {
    isLoading.value = false;
  }
};

const socialLogin = (provider) => {
  console.log(`使用 ${provider} 登录`);
  // 这里可以添加第三方登录逻辑
};
</script>

<style scoped>
@import url("./index.scss");
</style>
