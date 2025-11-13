<template>
  <div class="query-area">
    <div class="query-fields">
      <template v-for="(item, index) in fields" :key="index">
        <div
          class="query-item"
          :style="item.labelWidth ? `width:${item.labelWidth}px` : ''"
        >
          <span class="label">{{ item.label }}：</span>
          <component
            :is="getComponent(item.type)"
            v-model="formData[item.field]"
            v-bind="getComponentProps(item)"
            :placeholder="
              item.placeholder || item.type == 'input'
                ? `请输入${item.label}`
                : `请选择${item.label}`
            "
          ></component>
        </div>
      </template>
    </div>

    <!-- 操作按钮 -->
    <div class="query-actions">
      <Button theme="primary" @click="handleQuery" :loading="isloading">
        <template #icon>
          <Icon name="search" />
        </template>
        查询
      </Button>
      <Button theme="default" @click="handleReset">
        <template #icon>
          <Icon name="refresh" />
        </template>
        重置
      </Button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch, onUnmounted, onMounted, nextTick } from "vue";
import {
  Icon,
  Input,
  Select,
  DatePicker,
  TimePicker,
  CheckboxGroup,
  RadioGroup,
  Button,
  TreeSelect,
} from "tdesign-vue-next";

const props = defineProps({
  fields: {
    type: Array,
    default: () => [],
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
  isloading: {
    type: Boolean,
    default: false,
  },
  enableEnterSearch: {
    type: Boolean,
    default: true,
  },
  searchAfterReset: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["search", "reset"]);

const componentMap = {
  input: Input,
  select: Select,
  date: DatePicker,
  time: TimePicker,
  checkboxGroup: CheckboxGroup,
  radioGroup: RadioGroup,
  treeSelect: TreeSelect,
};

// 根据字段类型获取对应的组件
const getComponent = (type) => {
  return componentMap[type] || Input;
};
const formData = ref({ ...props.initialData });

const initFormData = () => {
  const initial = { ...props.initialData };
  // 为未在initialData中定义的字段设置默认值
  props.fields.forEach((field) => {
    //之前操作过的query可能会留下数据，所以只操作没有值的字段
    if (formData.value[field.field] === undefined) {
      if (field.type === "checkboxGroup") {
        initial[field.field] = field.defaultValue ?? [];
      } else {
        initial[field.field] = field.defaultValue ?? "";
      }
    }
  });
  formData.value = initial;
};

// 初始化时设置表单数据(设置默认值)
initFormData();

watch(
  () => props.initialData,
  () => {
    initFormData();
  },
  { deep: true, immediate: true }
);

const getComponentProps = (field) => {
  const props = { ...field.props, clearable: field.clearable ?? true };
  switch (field.type) {
    case "select":
    case "radioGroup":
    case "checkboxGroup":
      props.options = field.options || [];
      break;
    case "treeSelect":
      props.data = field.options || [];
      break;
    case "date":
      props.format = field.format || "YYYY-MM-DD";
      break;
    case "time":
      props.format = field.format || "HH:mm:ss";
      break;
  }
  return props;
};

//防抖搜索
let sreachTimer = null;
const handleQuery = () => {
  if (sreachTimer) clearTimeout(sreachTimer);
  sreachTimer = setTimeout(() => {
    emit("search", formData.value);
  }, 150);
};
const handleReset = () => {
  initFormData();
  emit("reset");
  if (props.searchAfterReset) {
    nextTick(() => {
      handleQuery();
    });
  }
};
const handleKeydown = (e) => {
  if (e.keyCode === 13 && e.key === "Enter" && props.enableEnterSearch) {
    handleQuery();
  }
};

onMounted(() => {
  if (props.enableEnterSearch) {
    window.addEventListener("keydown", handleKeydown);
  }
});

onUnmounted(() => {
  if (props.enableEnterSearch) {
    window.removeEventListener("keydown", handleKeydown);
  }
});
</script>
<style scoped lang="scss">
.query-area {
  margin: 10px 10px 0;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.query-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.query-item {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  .label {
    padding-left: 20px;
    padding-right: 10px;
    flex-shrink: 0;
    color: #666;
    font-size: 14px;
  }
}

.query-actions {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
</style>
