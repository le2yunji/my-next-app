// 서버 액션이 아닌 클라이언트 fetch — 호출해도 Next.js RSC 재렌더링이 트리거되지 않음
export async function togglePostLike(
  postId: string,
): Promise<
  { liked: boolean; likeCount: number } | { isError: true; message: string }
> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/post/${postId}/like`,
      {
        method: "POST",
        credentials: "include", // 브라우저가 accessToken 쿠키를 자동으로 포함
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        isError: true,
        message: data?.message ?? "좋아요 처리 중 오류가 발생했습니다.",
      };
    }

    return data as { liked: boolean; likeCount: number };
  } catch (e) {
    return {
      isError: true,
      message: (e as Error).message ?? "좋아요 처리 중 오류가 발생했습니다.",
    };
  }
}
