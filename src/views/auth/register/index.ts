import { ref, watch, defineEmits } from "vue";
import { apiRegister } from "@/api/login";
import { MessagePlugin } from "tdesign-vue-next";
import { useUserStore } from "@/store/user";
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
  const passwordAgain = ref(null);
  const showPassword = ref(false);
  const showPasswordAgain = ref(false);
  const isLoading = ref(false);

  const handleAuth = () => {
    // 获取输入值（去除首尾空格）
    const usernameVal = username.value;
    const passwordVal = password.value;
    const passwordAgainVal = passwordAgain.value;

    // 1. 验证用户名
    if (!usernameVal) {
      MessagePlugin.warning("用户名不能为空");
      return;
    } else if (!passwordVal) {
      MessagePlugin.warning("密码不能为空");
      return;
    } else if (!passwordAgainVal) {
      MessagePlugin.warning("再次输入密码不能为空");
      return;
    }
    // 验证特殊字符（允许字母、数字、下划线）
    const usernameReg = /^[a-zA-Z0-9_]+$/;
    if (!usernameReg.test(usernameVal)) {
      MessagePlugin.warning("用户名不能包含特殊字符，仅允许字母、数字和下划线");
      return;
    }

    // 2. 验证密码长度
    if (passwordVal?.length < 6) {
      MessagePlugin.warning("密码长度不能少于6个字符");
      return;
    }

    // 3. 验证两次密码一致性
    if (passwordVal !== passwordAgainVal) {
      MessagePlugin.warning("两次输入的密码不一致");
      return;
    }
    return true;
  };
  const resetFields = () => {
    username.value = null;
    password.value = null;
    passwordAgain.value = null;
  };
  const userStore = useUserStore();
  const handleRegister = () => {
    const flag = handleAuth();
    if (!flag) return;
    let params = {
      username: username.value,
      password: password.value,
    };
    isLoading.value = true;
    apiRegister(params)
      .then((res) => {
        if (res.code == 201) {
          MessagePlugin.success("注册成功,前往登录");
          toggleState();
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
    handleRegister,
    username,
    password,
    passwordAgain,
    showPassword,
    showPasswordAgain,
    isLoading,
  };
}
