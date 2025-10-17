import { ref, watch } from "vue";
import { addMenu, getParentMenuList, updateMenu } from "@/api/menu";
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
    const FORM_RULES = ref({
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        value: [{ required: true, message: "请输入path", trigger: "blur" },
        {
            pattern: /^\/[a-zA-Z]*$/,
            message: "路径格式不正确，应以/开头且后续为英文字符，例如/menu或/",
            trigger: "blur"
        }],
        component: [{ required: true, message: "请输入component", trigger: "blur" }],
        isShow: [{ required: true, message: "请选择是否显示", trigger: "change" }],
        icon: [{ required: true, message: "请输入图标", trigger: "blur" }],
    })
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
        form.value.validate();
    };

    const onValidate = ({ validateResult, firstError }) => {
        if (validateResult === true) {
            let parentId = formData.value.parentId ?? null
            formData.value.parentId = parentId
            console.log('formData.value: ', formData.value);

            const isAdd = menuEditorTitle.value === '新建菜单'
            const res = isAdd ? addMenu({ formData: formData.value }) : updateMenu({ formData: formData.value })
            res.then((res) => {
                if (res.code == 200) {
                    handleClose()
                    emit("submit")
                }
            })
        } else {
            console.log('Validate Errors: ', firstError, validateResult);
        }
    };


    const isSubmenu = ref(false)

    watch(() => formData.value.type, (newVal) => {
        if (newVal === 'submenu') {
            isSubmenu.value = true;
            // formData.value.parentId = null
            formData.value.path = null
            formData.value.component = null
            FORM_RULES.value.component = [];
            FORM_RULES.value.value = [];
        } else {
            FORM_RULES.value.component = [{ required: true, message: "请输入component", trigger: "blur" }];
            FORM_RULES.value.value = [{ required: true, message: "请输入path", trigger: "blur" }];
            isSubmenu.value = false;
        }
    })
    const showDialog = (row) => {
        console.log('row: ', row);
        if (row) {
            menuEditorTitle.value = '编辑菜单';
            formData.value = { ...row };
        } else {
            menuEditorTitle.value = '新建菜单';
            resetForm();
        }
        dialogVisible.value = true;
    }
    const dialogVisible = ref(false);

    // watch(() => props.visible, (newVal) => {
    //     dialogVisible.value = newVal;
    //     if (newVal) {
    //         fetchParentIdOptions();
    //     }
    // });

    watch(() => dialogVisible.value, (newVal) => {
        if (newVal) {
            fetchParentIdOptions();
        }
        emit("update:visible", newVal);
    });

    const handleClose = () => {
        dialogVisible.value = false;
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
        dialogVisible,
        handleClose,
        parentIdKeys,
        showDialog,
        onValidate,
        isSubmenu
    };
}