<template>
  <t-dialog
    v-model:visible="localVisible"
    @close="handleModalClose"
    :header="menuEditorTitle"
    @Confirm="saveForm"
  >
    <t-form ref="form" :rules="FORM_RULES" :data="formData" :colon="true">
      <t-form-item label="菜单名称" name="title">
        <t-input
          v-model="formData.title"
          placeholder="请输入菜单名称"
          clearable
        ></t-input>
      </t-form-item>

      <t-form-item label="菜单类型" name="type">
        <t-radio-group v-model="formData.type" :options="menuTypeOptions">
        </t-radio-group>
      </t-form-item>
      <t-form-item label="根菜单" name="parentId" v-show="parentIdIsShow">
        <t-select
          v-model="formData.parentId"
          placeholder="请选择根菜单"
          :options="parentIdOptions"
          clearable
          :keys="parentIdKeys"
        >
        </t-select>
      </t-form-item>
      <t-form-item label="path" name="value" help="示例：/menu">
        <t-input
          v-model="formData.value"
          clearable
          placeholder="请输入path"
        ></t-input>
      </t-form-item>
      <t-form-item
        label="component"
        name="component"
        help="示例：views/menu/index.vue"
      >
        <t-input
          v-model="formData.component"
          clearable
          placeholder="请输入component"
        ></t-input>
      </t-form-item>

      <t-form-item label="排序" name="sort">
        <t-input
          type="number"
          min="0"
          v-model="formData.sort"
          clearable
          placeholder="请输入排序"
        ></t-input>
      </t-form-item>

      <t-form-item label="状态" name="isShow">
        <t-radio-group v-model="formData.isShow">
          <t-radio :value="true">启用</t-radio>
          <t-radio :value="false">禁用</t-radio>
        </t-radio-group>
      </t-form-item>

      <t-form-item label="icon" name="icon">
        <t-input
          v-model="formData.icon"
          placeholder="请输入icon名称"
          clearable
        ></t-input>

        <t-link
          theme="primary"
          href="https://tdesign.tencent.com/icons"
          target="_blank"
          class="example"
        >
          <template #prefix-icon>
            <link-icon />
          </template>
          icon资源
        </t-link>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script setup>
import { ref, watch } from "vue";
import { useMenuEditor } from "./index.js";
import { LinkIcon, JumpIcon } from "tdesign-icons-vue-next";
const form = ref(null);

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:visible","submit"]);

const {
  menuEditorTitle,
  formData,
  FORM_RULES,
  menuTypeOptions,
  parentIdOptions,
  resetForm,
  saveForm,
  parentIdIsShow,
  localVisible,
  handleClose,
  parentIdKeys
} = useMenuEditor(form, props, emit);
const handleModalClose = () => {
  handleClose(resetForm);
};
</script> 
<style scoped>
.example {
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  flex-shrink: 0;
  margin-left: 10px;
}
::v-deep .t-input__extra,
::v-deep .t-input__help {
  text-align: left;
}
</style>
