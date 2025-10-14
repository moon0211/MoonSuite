import { ref } from "vue";
export function useMenu() {

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
                { label: "菜单容器", value: 'submenu' },
                { label: "菜单项", value: 'menuItem' },
            ],
            defaultValue: "",
        },
        {
            label: "根菜单",
            field: "parentId",
            type: "select",
            options: [
                { label: "全部", value: "" },
            ],
        },
        {
            label: "路由路径",
            field: "value",
            type: "input",
            placeholder: "请输入路由路径",
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
                { label: "启用", value: '1' },
                { label: "禁用", value: '0' },
            ],
            defaultValue: "",
        },
    ];

    // 初始查询数据
    const initialQueryData = {
        status: "",
    };

    const isloading = ref(false);

    const search = (data) => {
        console.log("我是父组件", data);
    };
    return {
        queryFields,
        initialQueryData,
        isloading,
        search
    };
}