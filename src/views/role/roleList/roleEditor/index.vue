<template>
  <t-dialog
    v-model:visible="dialogVisible"
    @close="handleModalClose"
    :header="roleEditorTitle"
    @Confirm="saveForm"
  >
    <t-form
      ref="form"
      :rules="FORM_RULES"
      :data="formData"
      :colon="true"
      @validate="onValidate"
    >
      <t-form-item label="角色名称" name="name">
        <t-input
          v-model="formData.name"
          placeholder="请输入角色名称"
          clearable
        ></t-input>
      </t-form-item>
      <t-form-item label="角色编码" name="encode">
        <t-input
          v-model="formData.encode"
          placeholder="请输入角色编码"
          clearable
        ></t-input>
      </t-form-item>
      <t-form-item label="角色描述" name="description">
        <t-textarea
          v-model="formData.description"
          placeholder="请输入角色描述"
          clearable
        ></t-textarea>
      </t-form-item>
      <t-form-item label="是否启用" name="status">
        <t-radio-group 
          v-model="formData.status"
          placeholder="请选择是否启用"
          :options="statusOptions"
          clearable
        ></t-radio-group>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRoleEditor } from "./index";
const form = ref(null);

const emit = defineEmits(["update:visible", "submit"]);

const {
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
} = useRoleEditor(form, emit);

defineExpose({
  showDialog,
});
const handleModalClose = () => {
  handleClose();
};
</script>
<style scoped>
::v-deep .t-input__extra,
::v-deep .t-input__help {
  text-align: left;
}
</style>
