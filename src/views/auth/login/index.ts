import { ref, watch, defineEmits } from "vue";
import { apiLogin } from "@/api/login";
import { MessagePlugin } from "tdesign-vue-next";
import { useUserStore } from "@/store/user";
import { useRouter, useRoute } from "vue-router";
// useLogin.ts
export enum StateType { // 导出枚举（值）
  LOGIN = "login",
  REGISTER = "register",
}
export function useLogin(onStateChange?: (state: StateType) => void) {
  const state = ref<StateType>(StateType.LOGIN);

  const toggleState = () => {
    state.value =
      state.value === StateType.LOGIN ? StateType.REGISTER : StateType.LOGIN;
    if (onStateChange) {
      onStateChange(state.value);
    }
  };
  const username = ref(null);
  const password = ref(null);
  const remember = ref(null);
  const showPassword = ref(false);
  const isLoading = ref(false);

  const resetFields = () => {
    username.value = null;
    password.value = null;
  };
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();

  const handleLogin = () => {
    if (!username.value || !password.value)
      return MessagePlugin.warning("用户名或密码不能为空");
    let params = {
      username: username.value,
      password: password.value,
    };
    isLoading.value = true;
    apiLogin(params)
      .then((res) => {
        if (res.code == 200) {
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          userStore.setUserInfo(res.data.user);
          const redirectPath = Array.isArray(route.query.redirect)
            ? route.query.redirect[0]
            : route.query.redirect;
          router.push(redirectPath || "/");
        }
      })
      .catch((err) => {
        console.log("err: ", err);
        if (err.code == 409) {
          MessagePlugin.warning("用户名已存在");
        }
      })
      .finally(() => {
        resetFields();
        isLoading.value = false;
      });
  };

  return {
    state,
    toggleState,
    handleLogin,
    username,
    password,
    remember,
    showPassword,
    isLoading,
  };
}
