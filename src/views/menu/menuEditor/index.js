import { ref, watch } from "vue";
import { addMenu, getParentMenuList } from "@/api/menu";
export function useMenuEditor(form, props, emit) {
    const menuEditorTitle = ref("新建菜单");
    const defaultType = 'menuItem';
    const menuTypeOptions = ref([
        { label: '菜单项', value: 'menuItem' },
        { label: '菜单组', value: 'submenu' },
    ]);
    const defaultFormData = {
        title: "标签管理",
        type: defaultType,
        parentId: "menu_1002",
        value: "/tag",
        component: "views/tags/index.vue",
        isShow: true,
        icon: "tag",
        sort: null,
    };
    const formData = ref({ ...defaultFormData });
    const FORM_RULES = {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        value: [{ required: true, message: "请输入path", trigger: "blur" }],
        component: [{ required: true, message: "请输入component", trigger: "blur" }],
        isShow: [{ required: true, message: "请选择是否显示", trigger: "change" }],
        icon: [{ required: true, message: "请输入图标", trigger: "blur" }],
    };
    const parentIdOptions = ref([]);
    const parentIdKeys = {
        label: "title",
        value: "id",
    };
    const fetchParentIdOptions = async () => {
        try {
            getParentMenuList().then(res => {
                console.log('res: ', res);
                if (res.code == 200) {
                    parentIdOptions.value = res.data;
                }
            })
        } catch (error) {
            throw new Error(error);
        }
    }

    const resetForm = () => {
        formData.value = { ...defaultFormData };
    }
    const saveForm = () => {
        let vaild = form.value.validate();
        if (vaild) {
            let parentId=formData.value.parentId??"0"
            formData.value.parentId=parentId
            addMenu({ formData: formData.value }).then((res) => {
                if (res.success) {
                    handleClose()
                    emit("submit")
                }
            })
        }
    };

    const parentIdIsShow = ref(true)

    watch(() => formData.value.type, (newVal) => {
        if (newVal === 'submenu') {
            parentIdIsShow.value = false;
        } else {
            parentIdIsShow.value = true;
        }
    })

    const localVisible = ref(props.visible);

    watch(() => props.visible, (newVal) => {
        localVisible.value = newVal;
        if (newVal) {
            fetchParentIdOptions();
        }
    });

    watch(() => localVisible.value, (newVal) => {
        emit("update:visible", newVal);
    });

    const handleClose = () => {
        localVisible.value = false;
        resetForm();
    };


    return {
        menuEditorTitle,
        formData,
        FORM_RULES,
        parentIdOptions,
        menuTypeOptions,
        defaultType,
        resetForm,
        saveForm,
        parentIdIsShow,
        localVisible,
        handleClose,
        parentIdKeys
    };
}