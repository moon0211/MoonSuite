import { ref, reactive, onMounted } from "vue";
import { MessagePlugin, Loading } from "tdesign-vue-next";
import { ChevronRightIcon, ChevronDownIcon } from "tdesign-icons-vue-next";
import {
  getPermissionsData,
  addPermission,
  updatePermission,
  delPermission,
} from "@/api/permission";

export function usePermission() {
  //权限管理，包含，权限编码：user:query,权限id,绑定的接口，权限名称，是否启用
  const queryFields = ref([
    {
      label: "权限名称",
      field: "name",
      type: "input",
      placeholder: "请输入权限名称",
    },
    {
      label: "权限编码",
      field: "encode",
      type: "input",
      placeholder: "请输入权限编码",
    },
    {
      label: "关联接口",
      field: "interfaceUrl",
      type: "input",
      placeholder: "请输入权限名称",
    },
  ]);
  const treeConfig = reactive({
    childrenKey: "children",
    treeNodeColumnIndex: 1,
    indent: 25,
    expandTreeNodeOnClick: true,
  });
  const lazyLoadingData = ref(null);

  const treeExpandAndFoldIconRender = (h, { type, row }) => {
    if (lazyLoadingData.value && lazyLoadingData.value.key === row?.key) {
      return <Loading size="14px" />;
    }
    return type === "expand" ? <ChevronRightIcon /> : <ChevronDownIcon />;
  };

  const queryData = ref({});
  const isloading = ref(false);
  const search = (data) => {
    queryData.value = data;
    getData();
    console.log("我是父组件", data);
  };

  const data = ref([]);
  const columns = [
    {
      colKey: "encode",
      title: "权限编码",
    },
    {
      colKey: "name",
      title: "权限名称",
    },
    {
      colKey: "type",
      title: "信息类型",
      ellipsis: true,
      cell: (h, { row }) => {
        if (row.parentId) {
          return (
            <t-tag theme="success" variant="light">
              权限项
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
      colKey: "interfaceUrl",
      title: "关联接口",
    },
    {
      colKey: "operate",
      title: "操作",
      // 保留 h 函数但正确关联组件，或直接使用 JSX（需确保已注册 TDesign 组件）
      cell: (h, { row }) => {
        if (!row.parentId) {
          return <>-</>;
        }
        return (
          <div className="tdesign-table-demo__table-operations">
            <t-link
              variant="text"
              hover="color"
              disabled={!!row.builtIn || !row.parentId}
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
        );
      },
    },
  ];
  const getData = async () => {
    try {
      isloading.value = true;
      getPermissionsData({ ...queryData.value }).then((res) => {
        if (res.code == 200) {
          data.value = res.data;
        }
      });
    } catch (error) {
      throw new Error(error);
    } finally {
      isloading.value = false;
    }
  };
  const permissionEditorRef = ref(null);
  const openDialog = (row) => {
    console.log("permissionEditorRef: ", permissionEditorRef);
    permissionEditorRef.value.showDialog(row);
  };
  const onDeleteConfirm = (row) => {
    console.log("row: ", row);
    delPermission(row.parentId, row.id).then(async (res) => {
      if (res.code === 200) {
        MessagePlugin.success(res.message || "删除成功");
        await getData();
      } else {
        MessagePlugin.error(res.message || "删除失败");
      }
    });
  };

  return {
    queryFields,
    isloading,
    search,
    getData,
    columns,
    data,
    openDialog,
    permissionEditorRef,
    treeConfig,
    treeExpandAndFoldIconRender,
  };
}
