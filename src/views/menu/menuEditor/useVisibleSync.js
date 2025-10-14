import { ref, watch } from "vue";

export function useVisibleSync(props, emit) {
    const localVisible = ref(props.visible);

    watch(() => props.visible, (newVal) => {
        localVisible.value = newVal;
    });

    watch(() => localVisible.value, (newVal) => {
        emit("update:visible", newVal);
    });

    const handleClose = () => {
        localVisible.value = false;
    };
    return {
        localVisible,
        handleClose
    };
}