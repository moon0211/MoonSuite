<template>
  <t-dialog
    v-model:visible="localVisible"
    @close="handleClose"
    :header="menuEditorTitle"
  >
    <t-form ref="form" :rules="FORM_RULES" :data="formData" :colon="true">
      <t-form-item label="菜单名称" name="name">
        <t-input v-model="formData.name" placeholder="请输入菜单名称"></t-input>
      </t-form-item>

      <t-form-item label="菜单类型" name="tel">
        <t-radio-group default-value="1" v-model="formData.tel">
          <t-radio value="1">根菜单</t-radio>
          <t-radio value="2">菜单项</t-radio>
        </t-radio-group>
      </t-form-item>

      <t-form-item
        label="路由路径"
        name="status"
        help="输入/menu相当于项目文件地址中的src\views\menu"
      >
        <t-input v-model="formData.name" placeholder="请输入路由路径"></t-input>
      </t-form-item>
      <t-form-item label="状态" name="tel">
        <t-radio-group default-value="1" v-model="formData.tel">
          <t-radio value="1">启用</t-radio>
          <t-radio value="2">禁用</t-radio>
        </t-radio-group>
      </t-form-item>

      <t-form-item label="icon" name="tel">
        <t-input v-model="formData.name" placeholder="请输入icon名称"></t-input>

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
        <!-- <p class="example">示例</p> -->
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script setup>
import { ref, watch } from "vue";
import { useMenuEditor } from "./index.js";
import { useVisibleSync } from "./useVisibleSync.js";
import { LinkIcon, JumpIcon } from 'tdesign-icons-vue-next';
const { menuEditorTitle, formData, FORM_RULES } = useMenuEditor();

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:visible"]);

const { localVisible, handleClose } = useVisibleSync(props, emit);
</script> 
<style scoped>
.example {
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  flex-shrink: 0;
  margin-left: 10px;
}
</style>
