import { ref, watch } from "vue";
import { RoleStatus, addRole, updateRole } from "@/api/role.js";
import { getPermissionsData } from "@/api/permission";

export const useRoleEditor = (form, emit) => {
  const roleEditorTitle = ref("新建角色");
  const defaultFormData = {
    name: "采购员",
    encode: "PURCHASER",
    description: "采购模块，库存更新模块",
    createAt: "2021-01-01 00:00:00",
    status: RoleStatus.INACTIVE,
    permissionIds: [1, 2, 3],
  };
  const id = ref<string | null>(null);
  const FORM_RULES = ref({
    name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
    encode: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
    description: [
      { required: true, message: "请输入角色描述", trigger: "blur" },
    ],
    status: [
      { required: true, message: "请选择角色启用状态", trigger: "blur" },
    ],
  });

  const formData = ref({ ...defaultFormData });
  const resetForm = () => {
    formData.value = { ...defaultFormData };
  };
  const saveForm = () => {
    form.value.validate();
  };

  const showDialog = (row) => {
    console.log("row: ", row);
    if (row) {
      roleEditorTitle.value = "编辑角色";
      formData.value = { ...row };
      id.value = row.id;
    } else {
      roleEditorTitle.value = "新建角色";
      resetForm();
    }
    dialogVisible.value = true;
  };
  const dialogVisible = ref(false);

  const permissionsOptions = ref([]);
  const statusOptions = ref([
    {
      label: "启用",
      value: RoleStatus.ACTIVE,
    },
    {
      label: "禁用",
      value: RoleStatus.INACTIVE,
    },
  ]);
  const permissionsKeys = {
    label: "desc",
    value: "id",
  };
  const fetchPermissionsOptions = async () => {
    try {
      getPermissionsData().then((res) => {
        if (res.code == 200) {
          permissionsOptions.value = res.data;
          console.log("permissionsOptions.value: ", permissionsOptions.value);
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
        fetchPermissionsOptions();
      }
      emit("update:visible", newVal);
    }
  );

  const handleClose = () => {
    dialogVisible.value = false;
    resetForm();
  };
  const onValidate = ({ validateResult, firstError }) => {
    if (validateResult === true) {
      console.log("Validate Success!");

      const isAdd = roleEditorTitle.value === "新建角色";
      const res = isAdd
        ? addRole(formData.value)
        : updateRole({ ...formData.value, id: id.value });
      res.then((res) => {
        if (res.code == 200) {
          id.value = null;
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
    roleEditorTitle,
    saveForm,
    dialogVisible,
    showDialog,
    formData,
    fetchPermissionsOptions,
    resetForm,
    FORM_RULES,
    onValidate,
    statusOptions,
    id,
  };
};
