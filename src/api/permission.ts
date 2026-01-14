import request from "@/request/http";
export interface PermissionFormParams {
  encode: string;
  name: string;
  interface: string;
}
export interface UpdatePermissionParams extends PermissionFormParams {
  id: string;
  parentId: string;
}

export function getPermissionsData() {
  return request({
    url: "/getPermissionsData",
    method: "post",
  });
}
export function addPermission(params: PermissionFormParams) {
  return request({
    url: "/addPermission",
    method: "post",
    params,
  });
}

export function updatePermission(params: UpdatePermissionParams) {
  return request({
    url: `/updatePermission/${params.parentId}/${params.id}`,
    method: "put",
    params,
  });
}
export function delPermission(parentId: string | null, id: string) {
  return request({
    url: `/delPermission/${parentId}/${id}`,
    method: "delete",
  });
}
