import request from "@/request/http";
interface RegisterParams {
  username: string;
  password: string;
}
interface RefreshTokenParams {
  refreshToken: string;
}
export function apiRegister(params: RegisterParams) {
  return request({
    url: "/register",
    method: "post",
    data: params,
  });
}

export function apiLogin(params: RegisterParams) {
  return request({
    url: "/login",
    method: "post",
    data: params,
  });
}
export function apiRefreshToken(params: RefreshTokenParams) {
  return request({
    url: "/refreshToken",
    method: "post",
    data: params,
  });
}
