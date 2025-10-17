<template>
  <QueryArea
    :fields="queryFields"
    :initial-data="initialQueryData"
    :isloading="isloading"
    @search="search"
    :searchAfterReset="true"
  ></QueryArea>
  <layout-content>
    <div>
      <div class="table-op">
        <t-button @click="openDialog()">添加菜单</t-button>

        <t-button
          theme="default"
          style="margin-left: 16px"
          @click="onExpandAllToggle"
          >{{ expandAll ? "收起全部" : "展开全部" }}</t-button
        >
      </div>
      <br />
      <t-enhanced-table
        ref="tableRef"
        v-model:expandedTreeNodes="expandedTreeNodes"
        row-key="id"
        drag-sort="row-handler"
        :data="data"
        :columns="columns"
        :tree="treeConfig"
        :tree-expand-and-fold-icon="treeExpandIcon"
        :pagination="pagination"
        :before-drag-sort="beforeDragSort"
        lazy-load
        @page-change="onPageChange"
        @expanded-tree-nodes-change="onExpandedTreeNodesChange"
      ></t-enhanced-table>
    </div>
    <menuEditor
      @submit="refreshMenu"
      ref="menuEditorRef"
    />
  </layout-content>
</template>
<script setup lang="jsx">
import QueryArea from "@/components/QueryArea.vue";
import menuEditor from "./menuEditor/index.vue"
import { useMenu } from "./index.js";
const { queryFields, initialQueryData, isloading, search } = useMenu();
import {deleteMenu} from "@/api/menu";
import { ref, reactive, computed , onMounted } from "vue";
import {
  EnhancedTable as TEnhancedTable,
  MessagePlugin,
  Loading,
} from "tdesign-vue-next";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  MoveIcon,
} from "tdesign-icons-vue-next";

import { useMenuStore } from '@/store/menu'
const data = ref([]);
const expandAll = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});
const  getData=async(currentPage = 1)=> {
pagination.current = currentPage;
    const menuStore = useMenuStore();

 await menuStore.fetchMenuTable('menu',currentPage,pagination.pageSize);

 if(menuStore.menuTable.data?.length > 0){
  data.value= menuStore.menuTable.data
  pagination.total= menuStore.menuTable.totalPages*menuStore.menuTable.totalItems
  return menuStore.menuTable.data;

 }


}
const refreshMenu= async()=>{
    const menuStore = useMenuStore();
 await getData()
 await menuStore.fetchMenuList();
 await menuStore.fetchRouterList();

}
const tableRef = ref(null);
const lazyLoadingData = ref(null);


// 非必须，如果不传，表格有内置树形节点展开逻辑
const expandedTreeNodes = ref([]);

const treeConfig = reactive({
  childrenKey: "children",
  treeNodeColumnIndex: 2,
  indent: 25,
  expandTreeNodeOnClick: true,
});


const onDeleteConfirm = (row) => {
  
  deleteMenu(row.id).then((res)=>{
    if(res.success===200){
      MessagePlugin.success("删除成功");
      refreshMenu()
    }
  })
  MessagePlugin.success("删除成功");
};


function appendMultipleDataTo(row) {
  const randomKey1 = Math.round(Math.random() * Math.random() * 1000) + 10000;
  const randomKey2 = Math.round(Math.random() * Math.random() * 1000) + 10000;
  const randomKey3 = Math.round(Math.random() * Math.random() * 1000) + 10000;
  const appendList = [
    {
      id: randomKey1,
      key: `申请人 ${randomKey1} 号`,
      platform: "电子签署",
      type: "Number",
    },
    {
      id: randomKey2,
      key: `申请人 ${randomKey2} 号`,
      platform: "纸质签署",
      type: "Number",
    },
    {
      id: randomKey3,
      key: `申请人 ${randomKey3} 号`,
      platform: "纸质签署",
      type: "Number",
      list: true,
    },
  ];
  tableRef.value.appendTo(row?.key, appendList);
  MessagePlugin.success(
    `已插入子节点申请人 ${randomKey1} 和 ${randomKey2} 号，请展开查看`
  );
}

// 当前节点之前，新增兄弟节前
const insertBefore = (row) => {
  const randomKey = Math.round(Math.random() * Math.random() * 1000) + 10000;
  tableRef.value.insertBefore(row.key, {
    id: randomKey,
    key: `申请人 ${randomKey} 号`,
    platform: "纸质签署",
    type: "Number",
  });
  MessagePlugin.success(`已插入子节点申请人 ${randomKey} 号，请展开查看`);
};

// 当前节点之后，新增兄弟节前
const insertAfter = (row) => {
  const randomKey = Math.round(Math.random() * Math.random() * 1000) + 10000;
  tableRef.value.insertAfter(row.key, {
    id: randomKey,
    key: `申请人 ${randomKey} 号`,
    platform: "纸质签署",
    type: "Number",
  });
  MessagePlugin.success(`已插入子节点申请人 ${randomKey} 号，请展开查看`);
};

const columns = [
   {
    colKey: "id",
    title: "编号",
    ellipsis: true,

  },
   {
    colKey: "sort",
    title: "排序",
    ellipsis: true,
  },
 
  {
    colKey: "title",
    title: "菜单名称",
    ellipsis: true,
  },
  {
    colKey: "type",
    title: "菜单类型",
    ellipsis: true,
       cell: (h, { row }) => {
        if (row.type==="menuItem") {
          return (
            <t-tag  theme="success" variant="light">
              菜单项
            </t-tag>
          );
        }else{
          return (
            <t-tag   theme="primary" variant="light">
              根菜单
            </t-tag>
          );
        }
    },
  },

  {
    colKey: "operate",
    title: "操作",
    // 增、删、改、查 等操作
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cell: (h, { row }) => (
      <div class="tdesign-table-demo__table-operations">
              <t-link variant="text" hover="color" theme="primary" onClick={() => openDialog(row)}
              >
            编辑
          </t-link>
        <t-popconfirm
          content="确认删除吗"
          onConfirm={() => onDeleteConfirm(row)}
        >
        
          <t-link variant="text" hover="color" theme="danger">
            删除
          </t-link>
      
        </t-popconfirm>

        
      </div>
    ),
  },
];




const onPageChange = async(pageInfo) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  data.value =await getData(pageInfo.current);
};



const treeExpandAndFoldIconRender = (h, { type, row }) => {
  if (lazyLoadingData.value && lazyLoadingData.value.key === row?.key) {
    return <Loading size="14px" />;
  }
  return type === "expand" ? <ChevronRightIcon /> : <ChevronDownIcon />;
};



// 默认展开全部。示例代码有效，勿删
onMounted(() => {
  tableRef.value.expandAll();
  getData();
});



const onExpandAllToggle = () => {
  expandAll.value = !expandAll.value;
  expandAll.value ? tableRef.value.expandAll() : tableRef.value.foldAll();
};
const menuEditorRef=ref(null)
const openDialog = (row) => {
console.log('row: ', row);
menuEditorRef.value.showDialog(row)
  // data.value.push(newData);
  // tableRef.value.appendTo("", newData);

  // 同时添加多个元素，示例代码有效勿删
  // appendMultipleDataTo();
};



const onExpandedTreeNodesChange = (expandedTreeNodes, context) => {
  console.log(expandedTreeNodes, context);
  // 全选不需要处理；仅处理懒加载
  if (!context.rowState) return;
  onTreeExpandChange(context);
};

const onTreeExpandChange = (context) => {
  console.log(context.rowState.expanded ? "展开" : "收起", context);
  /**
   * 如果是懒加载，请确认自己完成了以下几个步骤
   * 1. 提前设置 children 值为 true；
   * 2. 在 onTreeExpandChange 事件中处理异步数据；
   * 3. 自定义展开图标渲染 lazyLoadingTreeIconRender
   */
  if (context.row.list === true) {
    lazyLoadingData.value = context.row;
    const timer = setTimeout(() => {
      appendMultipleDataTo(context.row);
      lazyLoadingData.value = null;
      clearTimeout(timer);
    }, 200);
  }
};



// 应用于需要阻止拖拽排序的场景。如：当子节点存在时，则不允许调整顺序。
// 返回值为 true，允许拖拽排序；返回值 为 false，则阻止拖拽排序
const beforeDragSort = (params) => {
  console.log("beforeDragSort:", params);
  return true;
};

const treeExpandIcon = computed(() => {
  return treeExpandAndFoldIconRender;
});

</script>


<style>
.tdesign-table-demo__table-operations .t-link {
  padding: 0 8px;
}
.table-op {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>