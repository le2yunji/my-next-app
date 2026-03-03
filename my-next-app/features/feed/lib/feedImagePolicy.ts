export function shouldPriorityPostImage(postIndex: number) {
  // 상단 2개 포스트 정도만 우선 로딩
  return postIndex < 2;
}

export function shouldPriorityMedia(priorityPost: boolean, mediaIndex: number) {
  // 우선 로딩 포스트라도 첫 이미지만 priority
  return priorityPost && mediaIndex === 0;
}
