import apiClient from "../utils/api-client";

const _sleep = async (time: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(() => resolve(), time));

export const getUserProfile = async (params: { userId: string }) => {
  const url = `/api/users/${params.userId}/profile`;
  const res = await apiClient.get(url, { next: { revalidate: 300 } });
  console.log(res);
  let data;

  try {
    await _sleep(2000);
    data = (await res.json()).user;
    console.log(data);
  } catch {
    data = { isError: true, message: "서버 응답 형식이 올바르지 않습니다." };
  }
  if (!res.ok) {
    return {
      isError: true,
      message:
        data?.message ??
        `유저 피드를 불러오는데 실패했습니다. (HTTP ${res.status})`,
      ...data,
    };
  }

  return data;
};
