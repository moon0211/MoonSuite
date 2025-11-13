import { ref, reactive, onMounted } from "vue";
import { MessagePlugin, Loading } from "tdesign-vue-next";
import { ChevronRightIcon, ChevronDownIcon } from "tdesign-icons-vue-next";
import { deleteMenu } from "@/api/menu";

export function useMenu(useMenuStore) {
  const queryFields = [
    {
      label: "菜单名称",
      field: "title",
      type: "input",
      placeholder: "请输入菜单名称",
      defaultValue: "",
      props: {
        clearable: true,
      },
    },
    {
      label: "菜单类型",
      field: "type",
      type: "select",
      options: [
        { label: "全部", value: "" },
        { label: "菜单容器", value: "submenu" },
        { label: "菜单项", value: "menuItem" },
      ],
      defaultValue: "",
    },
    {
      label: "根菜单",
      field: "parentId",
      type: "select",
      options: [{ label: "全部", value: "" }],
    },
    {
      label: "path",
      field: "value",
      type: "input",
      placeholder: "请输入path",
      defaultValue: "",
      props: {
        clearable: true,
      },
    },
    {
      label: "状态",
      field: "isShow",
      type: "select",
      options: [
        { label: "全部", value: "" },
        { label: "启用", value: true },
        { label: "禁用", value: false },
      ],
      defaultValue: "",
    },
  ];

  // 初始查询数据
  const initialQueryData = {
    isShow: "",
  };
  const queryData = ref({});
  const isloading = ref(false);

  const search = (data) => {
    queryData.value = data;
    getData(1);
    console.log("我是父组件", data);
  };

  const data = ref([]);
  const expandAll = ref(false);

  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const getData = async (currentPage = 1) => {
    pagination.current = currentPage;
    const menuStore = useMenuStore();

    await menuStore.fetchMenuTable(
      "menu",
      currentPage,
      pagination.pageSize,
      queryData.value
    );

    data.value = menuStore.menuTable.data;
    pagination.total =
      menuStore.menuTable.totalPages * menuStore.menuTable.totalItems;
    return menuStore.menuTable.data;
  };
  const refreshMenu = async () => {
    const menuStore = useMenuStore();
    await getData();
    await menuStore.fetchMenuList();
    await menuStore.fetchRouterList();
  };
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
    deleteMenu(row.id).then((res) => {
      if (res.success === 200) {
        MessagePlugin.success("删除成功");
        refreshMenu();
      }
    });
    MessagePlugin.success("删除成功");
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
        if (row.type === "menuItem") {
          return (
            <t-tag theme="success" variant="light">
              菜单项
            </t-tag>
          );
        } else {
          return (
            <t-tag theme="primary" variant="light">
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
          <t-link
            variant="text"
            hover="color"
            theme="primary"
            onClick={() => openDialog(row)}
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

  const onPageChange = async (pageInfo) => {
    pagination.current = pageInfo.current;
    pagination.pageSize = pageInfo.pageSize;
    data.value = await getData(pageInfo.current);
  };

  const treeExpandAndFoldIconRender = (h, { type, row }) => {
    if (lazyLoadingData.value && lazyLoadingData.value.key === row?.key) {
      return <Loading size="14px" />;
    }
    return type === "expand" ? <ChevronRightIcon /> : <ChevronDownIcon />;
  };

  const onExpandAllToggle = () => {
    expandAll.value = !expandAll.value;
    expandAll.value ? tableRef.value.expandAll() : tableRef.value.foldAll();
  };

  const menuEditorRef = ref(null);
  const openDialog = (row) => {
    menuEditorRef.value.showDialog(row);
  };

  return {
    queryFields,
    initialQueryData,
    isloading,
    search,
    data,
    expandAll,
    pagination,
    getData,
    refreshMenu,
    tableRef,
    lazyLoadingData,
    expandedTreeNodes,
    treeConfig,
    columns,
    onPageChange,
    treeExpandAndFoldIconRender,
    onExpandAllToggle,
    menuEditorRef,
    openDialog,
  };
}
