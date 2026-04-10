import apiClient from "../utils/api-client";

// const _sleep = async (time: number): Promise<void> =>
//   await new Promise((resolve) => setTimeout(() => resolve(), time));

export async function getUserProfile({ userId }: { userId: string }) {
  const url = `/api/users/${userId}/profile`;
  let data;
  try {
    const res = await apiClient.get(url, { next: { revalidate: 300 } });
    data = await res.json();

    if (!res.ok) {
      return {
        isError: true,
        message:
          data?.message ??
          `유저 정보를 불러오는데 실패했습니다. (HTTP ${res.status})`,
        ...data,
      };
    }
  } catch {
    data = { isError: true, message: "서버 응답 형식이 올바르지 않습니다." };
  }

  return data.profile;
}
