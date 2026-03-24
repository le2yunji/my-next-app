// mocks/posts.mock.js
const {
  createBasePost,
  createPost,
  createPostMedia,
  createPostLike,
  createComment,
} = require("./helpers/mock.helpers");

const POST_CONTENTS = [
  "오늘 점심 너무 맛있었다.",
  "오랜만에 카페 가서 작업했는데 집중이 잘 됐다.",
  "퇴근 전에 할 일 다 끝내서 기분 좋다.",
  "날씨가 좋아서 산책하면서 사진도 몇 장 찍었다.",
  "이번 주 일정 정리 완료. 이제 하나씩 실행만 하면 된다.",
  "새로 산 키보드 타건감이 생각보다 괜찮다.",
  "오늘은 일찍 일어나서 운동까지 했다. 뿌듯.",
  "요즘 읽는 책이 재밌어서 자기 전에 조금씩 보고 있다.",
  "회의 끝나고 정리해보니 생각보다 할 게 많네.",
  "주말에 찍어둔 사진 이제야 정리했다.",
  "디자인 시안 첫 번째 버전 완료.",
  "작은 기능 하나 고쳤는데 화면이 훨씬 깔끔해졌다.",
  "오늘 커피 두 잔 마셨더니 정신이 번쩍 든다.",
  "사진 정리하다가 작년 여행 사진까지 다시 보게 됐다.",
  "저녁 메뉴 고민하다가 결국 제일 무난한 걸로 결정.",
  "오후에 잠깐 쉬면서 본 하늘이 예뻤다.",
  "개발하다가 작은 버그 하나 잡았는데 너무 시원하다.",
  "오늘 마무리는 가볍게 산책으로.",
  "오랜만에 플레이리스트 정리했더니 기분 전환된다.",
  "집중 안 될 때 책상 정리하면 조금 나아지는 편.",
  "아침 공기가 좋아서 평소보다 빨리 나왔다.",
  "사진 한 장 고르는데 생각보다 시간이 오래 걸렸다.",
  "노트 정리하다가 아이디어가 더 많이 나왔다.",
  "작은 리팩토링이었는데 만족도가 꽤 높다.",
  "오늘은 무리하지 않고 천천히 가기로 했다.",
  "주말 계획 세우는 시간도 은근 재밌다.",
  "카페 음악이 좋아서 예상보다 오래 머물렀다.",
  "하루 끝에 체크리스트 비우는 맛이 있다.",
  "예전 사진 보다가 다시 가고 싶은 곳이 생겼다.",
  "집중 잘되는 자리 찾으니 일 속도가 달라졌다.",
  "오늘은 하늘 색이 유난히 선명했다.",
  "최근에 저장한 이미지들만 봐도 취향이 보인다.",
  "가볍게 시작한 작업이 생각보다 길어졌다.",
  "작은 성취 하나가 하루 기분을 꽤 바꾼다.",
  "운동하고 나니까 머리가 훨씬 맑아진 느낌.",
  "오늘은 기록할 만한 순간이 꽤 많았다.",
];

const COMMENT_CONTENTS = [
  "사진 분위기 좋다.",
  "이거 어디야?",
  "색감 너무 예쁘다.",
  "나도 가보고 싶다.",
  "정리 진짜 잘했네.",
  "오늘도 열일했네.",
  "분위기 완전 좋다.",
  "기록해두길 잘했다.",
  "이 장면 너무 좋다.",
  "나중에 더 보여줘.",
];

const ASPECT_PRESETS = [
  { width: 1080, height: 1080 },
  { width: 1080, height: 1350 },
  { width: 1080, height: 1440 },
  { width: 1200, height: 1200 },
];

const baseTime = Date.UTC(2026, 2, 10, 9, 0, 0);

const BASE_POSTS = POST_CONTENTS.map((content, index) => {
  return createBasePost({
    id: `post_${index + 1}`,
    authorId: `user_${(index % 20) + 1}`,
    content,
    createdAt: new Date(baseTime - index * 30 * 60 * 1000).toISOString(),
  });
});

const POST_MEDIA = BASE_POSTS.flatMap((post, postIndex) => {
  const mediaCount = (postIndex % 4) + 1;

  return Array.from({ length: mediaCount }, (_, mediaIndex) => {
    const imageNo = (((postIndex + 1) * 11 + mediaIndex) % 30) + 1;
    const aspect =
      ASPECT_PRESETS[(postIndex + mediaIndex) % ASPECT_PRESETS.length];

    return createPostMedia({
      postId: post.id,
      imageNo,
      order: mediaIndex + 1,
      width: aspect.width,
      height: aspect.height,
    });
  });
});

const POST_LIKES = BASE_POSTS.flatMap((post, postIndex) => {
  const likeUserCount = (postIndex % 6) + 2;
  const likes = [];
  let cursor = 1;

  while (likes.length < likeUserCount) {
    const userNo = ((postIndex + cursor) % 20) + 1;
    const userId = `user_${userNo}`;

    if (userId !== post.authorId) {
      likes.push(
        createPostLike({
          postId: post.id,
          userId,
          createdAt: new Date(
            baseTime - (postIndex * 30 + cursor) * 60 * 1000
          ).toISOString(),
        })
      );
    }

    cursor += 1;
  }

  return likes;
});

const COMMENTS = BASE_POSTS.flatMap((post, postIndex) => {
  const pattern = [2, 1, 0, 3];
  const commentCount = pattern[postIndex % pattern.length];

  return Array.from({ length: commentCount }, (_, commentIndex) => {
    let userNo = ((postIndex + commentIndex + 2) % 20) + 1;
    let authorId = `user_${userNo}`;

    if (authorId === post.authorId) {
      userNo = (userNo % 20) + 1;
      authorId = `user_${userNo}`;
    }

    return createComment({
      id: `comment_${postIndex + 1}_${commentIndex + 1}`,
      postId: post.id,
      authorId,
      content:
        COMMENT_CONTENTS[(postIndex + commentIndex) % COMMENT_CONTENTS.length],
      createdAt: new Date(
        baseTime - (postIndex * 30 - (commentIndex + 1) * 3) * 60 * 1000
      ).toISOString(),
    });
  });
});

const POSTS = BASE_POSTS.map((basePost) => {
  const likeCount = POST_LIKES.filter(
    (like) => like.postId === basePost.id
  ).length;

  const commentCount = COMMENTS.filter(
    (comment) => comment.postId === basePost.id
  ).length;

  return createPost({
    ...basePost,
    likeCount,
    commentCount,
  });
});

const POST_MEDIA_MAP = POST_MEDIA.reduce((acc, media) => {
  if (!acc[media.postId]) acc[media.postId] = [];
  acc[media.postId].push(media);
  return acc;
}, {});

const POST_LIKE_MAP = POST_LIKES.reduce((acc, like) => {
  if (!acc[like.postId]) acc[like.postId] = [];
  acc[like.postId].push(like);
  return acc;
}, {});

const COMMENT_MAP = COMMENTS.reduce((acc, comment) => {
  if (!acc[comment.postId]) acc[comment.postId] = [];
  acc[comment.postId].push(comment);
  return acc;
}, {});

module.exports = {
  POSTS,
  POST_MEDIA,
  POST_LIKES,
  COMMENTS,
  POST_MEDIA_MAP,
  POST_LIKE_MAP,
  COMMENT_MAP,
};
