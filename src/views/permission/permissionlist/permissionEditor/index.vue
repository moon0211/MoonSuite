<template>
  <t-dialog
    v-model:visible="dialogVisible"
    @close="handleModalClose"
    :header="permisstionEditorTitle"
    @confirm="saveForm"
  >
    <t-form
      ref="formRef"
      :rules="FORM_RULES"
      :data="formData"
      :colon="true"
      @validate="onValidate"
    >
      <t-form-item label="添加方式" name="editorWay">
        <t-radio-group
          v-model="editorWay"
          :options="editorWayOptions"
          clearable
        ></t-radio-group>
      </t-form-item>
      <t-form-item label="权限名称" name="name" v-if="editorWay == 1">
        <t-select
          :options="nameOptions"
          v-model="formData.name"
          placeholder="请输入权限名称"
          clearable
        ></t-select>
      </t-form-item>
      <t-form-item label="权限名称" name="name" v-else>
        <t-input
          v-model="formData.name"
          placeholder="请输入权限名称"
          clearable
        ></t-input>
      </t-form-item>

      <t-form-item label="权限编码" name="encode">
        <t-input
          :disabled="editorWay == 1"
          v-model="formData.encode"
          placeholder="请输入权限编码"
          clearable
        ></t-input>
      </t-form-item>
      <t-form-item label="关联接口" name="interfaceUrl">
        <t-input
          v-model="formData.interfaceUrl"
          placeholder="请输入关联接口"
          clearable
        ></t-input>
      </t-form-item>
      <!--parentdata如果不去掉children，-select会自动处理成渲染optionsGroup(树菜单)-->
      <t-form-item label="关联菜单" name="parentId">
        <t-select
          v-model="formData.parentId"
          placeholder="请选择关联菜单"
          clearable
          :options="parentData"
        >
        </t-select>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script lang="ts" setup>
import { ref, watch, nextTick } from "vue";
import { usepermissionEditor } from "./index";
const formRef = ref(null);

const editorWayOptions = [
  { label: "快速添加", value: 1 },
  { label: "自定义", value: 2 },
];
const editorWay = ref(1);
const nameOptions = [
  { label: "查询", value: "查询", encode: "search" },
  { label: "增加", value: "增加", encode: "add" },
  { label: "修改", value: "修改", encode: "edit" },
  { label: "删除", value: "删除", encode: "delete" },
];

const emit = defineEmits(["update:visible", "submit"]);

const {
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
} = usepermissionEditor(formRef, emit);
defineExpose({
  showDialog,
});

const handleModalClose = () => {
  handleClose();
};
watch(editorWay, () => {
  nextTick(() => {
    formData.value.encode = "";
    formData.value.name = "";
    formRef.value?.clearValidate(["name", "encode"]);
  });
});
watch(
  () => formData.value.name,
  (newVal, oldVal) => {
    console.log("name 变化了：", newVal, oldVal);
    nameOptions.forEach((item) => {
      if (item.value == newVal) {
        formData.value.encode = item.encode;
      }
    });
  },

  {
    deep: false,
  }
);
</script>
<style scoped>
::v-deep .t-input__extra,
::v-deep .t-input__help {
  text-align: left;
}
</style>
