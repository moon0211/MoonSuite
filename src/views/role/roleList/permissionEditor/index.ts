import { computed } from "vue";
import { assignRolePermissions } from "@/api/role";
import { ref } from "vue";
import {
  TreeInstanceFunctions,
  TreeProps,
  ButtonProps,
} from "tdesign-vue-next";

export const usePermissionEditor = () => {
  const dialogVisible = ref(false);
  const form = ref(null);
  const permisstionEditorTitle = ref("角色权限");

  const handleClose = () => {
    dialogVisible.value = false;
  };
  const saveForm = () => {
    console.log(" checkedData.value: ", checkedData.value);
    let params = {
      id: id.value,
      permissions: checkedData.value,
      updateBy: "test",
    };
    assignRolePermissions(params).then((res) => {
      console.log("res: ", res);
    });
  };
  const id = ref(null);
  const showDialog = (row) => {
    console.log("row: ", row);
    id.value = row.id;
    dialogVisible.value = true;
  };

  const tree = ref<TreeInstanceFunctions>();
  const allChecked = ref([]);

  const checkedData = ref({});
  const onChange: TreeProps["onChange"] = (checked, context) => {
    const { node } = context;
    const { parentId, encode } = node.data;

    if (parentId) {
      if (!checkedData.value[parentId]) {
        checkedData.value[parentId] = [];
      }
      const targetArr = checkedData.value[parentId];
      const index = targetArr.indexOf(encode);
      if (index > -1) {
        targetArr.splice(index, 1);
      } else {
        targetArr.push(encode);
      }
    } else {
      if (!checkedData.value[encode]) {
        checkedData.value[encode] = [];
      }
      const targetArr = checkedData.value[encode];
      const children = node.data.children;

      if (Array.isArray(children) && children.length > 0) {
        const childEncodes = children.map((child) => child.encode);
        for (let i = targetArr.length - 1; i >= 0; i--) {
          if (childEncodes.includes(targetArr[i])) {
            targetArr.splice(i, 1);
          }
        }
        if (targetArr.length === 0) {
          targetArr.push(...childEncodes);
        }
      }
    }
  };

  return {
    dialogVisible,
    form,
    permisstionEditorTitle,
    handleClose,
    saveForm,
    showDialog,
    tree,
    allChecked,
    checkedData,
    onChange,
  };
};
