import { ref, reactive, onMounted } from "vue";
import { MessagePlugin, Loading } from "tdesign-vue-next";
import { getPermissionsData } from "@/api/permission";
import {
  getRolesData,
  addRole,
  updateRole,
  delRole,
  updateRoleStatus,
  RoleStatus,
} from "@/api/role";

export function useRole() {
  const PermissionsOptions = ref([]);
  const permissionsKeys = {
    label: "desc",
    value: "id",
  };
  const fetchPermissionsOptions = async () => {
    try {
      getPermissionsData().then((res) => {
        if (res.code == 200) {
          PermissionsOptions.value = res.data;
          queryFields.value[0].options = res.data;
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  };
  const queryFields = ref([
    {
      label: "权限名称",
      field: "title",
      type: "select",
      placeholder: "请输入权限名称",
      defaultValue: "",
      options: [],
      keys: permissionsKeys,
      props: {
        clearable: true,
      },
    },
  ]);

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
      colKey: "name",
      title: "角色名称",
    },
    {
      colKey: "encode",
      title: "角色编码",
    },
    {
      colKey: "description",
      title: "描述",
    },
    {
      colKey: "createdAt",
      title: "创建时间",
    },
    {
      colKey: "status",
      title: "状态",
      cell: (h, { row }) => {
        const isLoading = row.statusLoading || false;
        return (
          <t-switch
            customValues={["active", "inactive"]}
            keys={row.id}
            value={row.status == "active"}
            disabled={row.builtIn || isLoading}
            onChange={(checked) => handleStatusChange(row.id, checked, row)}
            loading={isLoading}
          />
        );
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
  const getData = async () => {
    try {
      isloading.value = true;
      getRolesData().then((res) => {
        if (res.code == 200) {
          data.value = res.data;
          console.log("data.value : ", data.value);
        }
      });
    } catch (error) {
      throw new Error(error);
    } finally {
      isloading.value = false;
    }
  };
  const menuEditorRef = ref(null);
  const openDialog = (row) => {
    menuEditorRef.value.showDialog(row);
  };

  const onDeleteConfirm = (row) => {
    // deleteMenu(row.id).then(async (res) => {
    //   if (res.code === 200) {
    //     MessagePlugin.success("删除成功");
    //     await refreshMenu();
    //   }
    // });
  };

  const handleStatusChange = (id, checked, row) => {
    const status =
      checked == RoleStatus.ACTIVE ? RoleStatus.INACTIVE : RoleStatus.ACTIVE;
    updateRoleStatus({ id, status }).then(async (res) => {
      if (res.code === 200) {
        MessagePlugin.success(res.message || "修改成功");
        await getData();
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
    fetchPermissionsOptions,
  };
}
