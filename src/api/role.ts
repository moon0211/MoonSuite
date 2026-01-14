import request from "@/request/http";
export enum RoleStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
export interface RoleFormParams {
  encode: string;
  name: string;
  description: string;
  permissions: number[];
  status: RoleStatus;
  users?: number[];
}

export type AddRoleParams = RoleFormParams;

export interface UpdateRoleParams extends RoleFormParams {
  id: string;
}

export interface RoleItem extends RoleFormParams {
  id: string;
  builtIn: boolean;
  correlation: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface assignPermissionsParams {
  id: string;
  permissions: string[];
  updateBy: string;
}

export function getRolesData(params) {
  return request({
    url: "/roles",
    method: "get",
    params,
  });
}

export function addRole(params: RoleFormParams) {
  return request({
    url: "/role",
    method: "post",
    data: params,
  });
}

export function updateRole(params: UpdateRoleParams) {
  return request({
    url: `/role/${params.id}`,
    method: "put",
    data: params,
  });
}

export function delRole(id: string) {
  return request({
    url: `/role/${id}`,
    method: "delete",
  });
}

export function updateRoleStatus(params: { id: string; status: RoleStatus }) {
  return request({
    url: `/role/${params.id}/status`,
    method: "patch",
    data: { status: params.status },
  });
}
export function assignRolePermissions(params: assignPermissionsParams) {
  return request({
    url: `/role/${params.id}/permissions`,
    method: "patch",
    data: { permissions: params.permissions, updateBy: params.updateBy },
  });
}
