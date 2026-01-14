<template>
  <t-dialog
    @close="handleModalClose"
    :visible="dialogVisible"
    @confirm="saveForm"
    :header="permisstionEditorTitle"
  >
    <t-tree
      style="margin-top: 14px"
      ref="tree"
      v-model="allChecked"
      :data="formattedData"
      :checkable="true"
      :value-mode="'all'"
      hover
      :keys="keys"
      expand-all
      @change="onChange"
    />
  </t-dialog>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { usePermissionEditor } from "./index.ts";

const props = defineProps<{
  data: Array<{
    parentId: string;
    encode: string;
    [key: string]: any;
  }>;
  keys?: Object | null;
}>();

const formattedData = computed(() => {
  const sourceData = props.data || [];
  return sourceData.map((item) => {
    const parentId = item.parentId ?? "";
    const encode = item.encode ?? "";
    return {
      value: `${parentId}_${encode}`,
      ...item,
    };
  });
});

const {
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
} = usePermissionEditor();

const handleModalClose = () => {
  handleClose();
};

defineExpose({
  showDialog,
});
</script>
