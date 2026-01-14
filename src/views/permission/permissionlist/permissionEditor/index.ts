import { ref, watch, nextTick } from "vue";

import {
  addPermission,
  updatePermission,
  getPermissionsData,
} from "@/api/permission";
export const usepermissionEditor = (formRef, emit) => {
  const permisstionEditorTitle = ref("新建权限");
  const defaultFormData = {
    name: "",
    encode: "",
    interfaceUrl: "",
    parentId: null,
  };
  const id = ref<string | null>(null);
  const FORM_RULES = {
    name: [
      {
        required: true,
        message: "请输入权限名称",
        trigger: ["change", "blur"],
      },
    ],
    encode: [
      {
        required: true,
        message: "请输入权限编码",
        trigger: ["change", "blur"],
      },
    ],
    interfaceUrl: [
      {
        required: true,
        message: "请输入关联接口",
        trigger: ["change", "blur"],
      },
    ],
  };

  const formData = ref({ ...defaultFormData });
  const resetForm = () => {
    formData.value = { ...defaultFormData };
    nextTick(() => {
      formRef.value?.clearValidate();
    });
  };
  const saveForm = async () => {
    if (formRef.value) {
      await formRef.value.validate();
    }
  };

  const showDialog = (row) => {
    console.log("row: ", row);
    if (row) {
      permisstionEditorTitle.value = "编辑权限";
      formData.value = { ...row };
      id.value = row.id;
    } else {
      permisstionEditorTitle.value = "新建权限";
      resetForm();
    }
    nextTick(() => {
      formRef.value?.clearValidate();
    });
    dialogVisible.value = true;
  };
  const dialogVisible = ref(false);

  const handleClose = () => {
    //  editorWay.value = 1;
    // resetForm();

    dialogVisible.value = false;
    emit("update:visible", false);
    // 延迟300ms重置表单+清除校验 ↓↓↓
    setTimeout(() => {
      resetForm();
      id.value = null;
    }, 300);
  };
  const parentData = ref([]);
  const parentIdKeys = {
    label: "name",
    value: "id",
  };
  const fetchPermissionsData = async () => {
    try {
      getPermissionsData({}).then((res) => {
        if (res.code == 200) {
          let list = [];
          res.data.forEach((item) => {
            list.push(
              Object.assign({
                label: item[parentIdKeys.label],
                value: item[parentIdKeys.value],
              })
            );
          });
          parentData.value = list;
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  };
  watch(
    () => dialogVisible.value,
    (newVal) => {
      if (newVal) {
        fetchPermissionsData();
      }
      emit("update:visible", newVal);
    }
  );
  const onValidate = ({ validateResult, firstError }) => {
    if (validateResult === true) {
      console.log("Validate Success!");
      const isAdd = permisstionEditorTitle.value === "新建权限";
      const res = isAdd
        ? addPermission({ ...formData.value })
        : updatePermission({ formData: formData.value });

      res.then((res) => {
        if (res.success) {
          handleClose();
          emit("submit");
        }
      });
    } else {
      console.log("Validate Errors: ", firstError, validateResult);
    }
  };
  return {
    handleClose,
    permisstionEditorTitle,
    saveForm,
    dialogVisible,
    showDialog,
    formData,
    resetForm,
    FORM_RULES,
    onValidate,
    id,
    parentData,
  };
};
