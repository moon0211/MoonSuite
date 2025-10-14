import { ref } from "vue";
export function useMenuEditor() {
    const menuEditorTitle = ref("新建菜单");
    const formData = ref({
        name: "",
        tel: "",
        status: false,
    });

    const FORM_RULES = { name: [{ required: true, message: "姓名必填" }] };



    return {
        menuEditorTitle,
        formData,
        FORM_RULES,
    };
}