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
      <Login v-if="state === StateType.LOGIN" @toggle-state="toggleState" />
      <Register v-else @toggle-state="toggleState" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import Register from "./register/index.vue";
import Login from "./login/index.vue";
import { useLogin } from "./index";
const {
  state,
  toggleState,
  StateType,
} = useLogin();
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.moon-suite-login {
  min-height: 100vh;
  background: linear-gradient(135deg, #0c1e44 0%, #1a3a7a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

/* 星空背景 */
.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(2px 2px at 20px 30px, #eee, transparent),
    radial-gradient(2px 2px at 40px 70px, #fff, transparent),
    radial-gradient(1px 1px at 90px 40px, #fff, transparent),
    radial-gradient(1px 1px at 130px 80px, #fff, transparent),
    radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: stars-move 100s linear infinite;
}

.stars-2 {
  background-image: radial-gradient(1px 1px at 10px 10px, #fff, transparent),
    radial-gradient(1px 1px at 50px 50px, #eee, transparent),
    radial-gradient(1px 1px at 100px 20px, #fff, transparent),
    radial-gradient(1px 1px at 150px 60px, #ddd, transparent);
  background-size: 300px 150px;
  animation-duration: 150s;
}

@keyframes stars-move {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100px);
  }
}

.login-container {
  display: flex;
  width: 900px;
  height: 550px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 左侧装饰区域 */
.decorative-side {
  flex: 1;
  background: linear-gradient(
    135deg,
    rgba(12, 30, 68, 0.9) 0%,
    rgba(26, 58, 122, 0.8) 100%
  );
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.moon {
  width: 120px;
  height: 120px;
  background: #f5f5f5;
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.8);
  position: relative;
  margin-bottom: 30px;
  animation: moon-float 8s ease-in-out infinite;
}

.moon::after {
  content: "";
  position: absolute;
  top: 20px;
  left: 30px;
  width: 30px;
  height: 30px;
  background: #e0e0e0;
  border-radius: 50%;
  box-shadow: 40px 10px 0 -5px #e0e0e0, 20px 40px 0 -10px #e0e0e0;
}

@keyframes moon-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 15s infinite linear;
}

.element-1 {
  width: 40px;
  height: 40px;
  top: 20%;
  left: 20%;
  animation-duration: 20s;
}

.element-2 {
  width: 25px;
  height: 25px;
  top: 60%;
  left: 15%;
  animation-duration: 15s;
  animation-delay: 2s;
}

.element-3 {
  width: 30px;
  height: 30px;
  top: 40%;
  right: 20%;
  animation-duration: 18s;
  animation-delay: 5s;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(10px, 15px) rotate(90deg);
  }
  50% {
    transform: translate(20px, 5px) rotate(180deg);
  }
  75% {
    transform: translate(10px, -10px) rotate(270deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

.brand-title {
  font-size: 36px;
  color: white;
  margin-bottom: 10px;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.brand-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
}

/* 右侧表单区域 */
.form-side {
  flex: 1;
  background: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
}
.social-btn.google:hover {
  background: #fce8e6;
  border-color: #db4437;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    height: auto;
    width: 100%;
  }

  .decorative-side {
    padding: 30px 20px;
    min-height: 200px;
  }

  .moon {
    width: 80px;
    height: 80px;
  }

  .brand-title {
    font-size: 28px;
  }

  .form-side {
    padding: 30px 20px;
  }
}
</style>
