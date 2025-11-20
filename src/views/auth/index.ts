import { ref } from "vue";
export function useLogin() {
  enum StateType {
    LOGIN = "login",
    REGISTER = "register",
  }
  const state = ref<StateType>(StateType.LOGIN);
  const toggleState = () => {
    console.log("触发");
    state.value =
      state.value === StateType.LOGIN ? StateType.REGISTER : StateType.LOGIN;
  };

  return {
    state,
    toggleState,
    StateType,
  };
}
