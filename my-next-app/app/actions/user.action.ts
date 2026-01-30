"use server";

import { API_BASE_URL } from "../utils/api";

export const getUsersAction = async () => {
  // 유저 리스트를 api요청
  // 인수로 페이지 넣어야 함 원래
  const request = await fetch(`${API_BASE_URL}/api/users`); // 서버 사이드 때 참조 (클라이언트 사이드 때 참조할 필요 없음)
  const response = await request.json();
  const users = response.users;
  console.log(users);
  return users;
};
