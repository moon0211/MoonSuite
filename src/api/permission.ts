import request from "@/request/http";

export function getPermissionsData() {
  return request({
    url: "/getPermissionsData",
    method: "post",
  });
}
