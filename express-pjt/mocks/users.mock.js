const { createUser } = require("./helpers/mock.helpers");

const USERS = [
  createUser({
    id: "user_1",
    nickname: "yunji",
    name: "김어진",
    bio: "클라우드와 로봇에 관심이 많습니다.",
    profileImageNo: 1,
  }),
  createUser({
    id: "user_2",
    nickname: "minsu",
    name: "김민수",
    bio: "커피와 작업을 좋아합니다.",
    profileImageNo: 2,
  }),
  createUser({
    id: "user_3",
    nickname: "jihyun",
    name: "박지현",
    bio: "사진과 디자인을 좋아합니다.",
    profileImageNo: 3,
  }),
  createUser({
    id: "user_4",
    nickname: "hyunwoo",
    name: "정현우",
    bio: "산책과 러닝을 즐깁니다.",
    profileImageNo: null,
  }),
  createUser({
    id: "user_5",
    nickname: "yuri",
    name: "최유리",
    bio: "책과 기록을 좋아해요.",
    profileImageNo: 5,
  }),
  createUser({
    id: "user_6",
    nickname: "soobin",
    name: "이수빈",
    bio: "키보드와 데스크셋업에 진심입니다.",
    profileImageNo: 6,
  }),
  createUser({
    id: "user_7",
    nickname: "seongho",
    name: "박성호",
    bio: "운동 루틴 공유하는 걸 좋아합니다.",
    profileImageNo: 7,
  }),
  createUser({
    id: "user_8",
    nickname: "hooni",
    name: "이훈",
    bio: "주말마다 사진 정리합니다.",
    profileImageNo: 8,
  }),
  createUser({
    id: "user_9",
    nickname: "sora",
    name: "김소라",
    bio: "하늘 사진 찍는 걸 좋아합니다.",
    profileImageNo: null,
  }),
  createUser({
    id: "user_10",
    nickname: "dongha",
    name: "최동하",
    bio: "작은 UI 개선에 뿌듯함을 느껴요.",
    profileImageNo: 10,
  }),
  createUser({
    id: "user_11",
    nickname: "nahee",
    name: "오나희",
    bio: "브랜딩과 컬러 조합에 관심이 많아요.",
    profileImageNo: 11,
  }),
  createUser({
    id: "user_12",
    nickname: "taeho",
    name: "강태호",
    bio: "개발하면서 생산성 도구도 같이 파봅니다.",
    profileImageNo: 12,
  }),
  createUser({
    id: "user_13",
    nickname: "jiwoo",
    name: "한지우",
    bio: "오늘의 기분을 사진으로 남깁니다.",
    profileImageNo: 9,
  }),
  createUser({
    id: "user_14",
    nickname: "hayeon",
    name: "서하연",
    bio: "조용한 카페를 찾는 게 취미예요.",
    profileImageNo: null,
  }),
  createUser({
    id: "user_15",
    nickname: "junseo",
    name: "윤준서",
    bio: "저녁 메뉴 고민이 하루의 큰 고민입니다.",
    profileImageNo: null,
  }),
  createUser({
    id: "user_16",
    nickname: "areum",
    name: "김아름",
    bio: "감성 사진과 무드 기록을 좋아합니다.",
    profileImageNo: 6,
  }),
  createUser({
    id: "user_17",
    nickname: "seungmin",
    name: "박승민",
    bio: "버그 하나 잡는 순간이 제일 짜릿해요.",
    profileImageNo: 7,
  }),
  createUser({
    id: "user_18",
    nickname: "yerin",
    name: "이예린",
    bio: "퇴근 후 가볍게 걷는 걸 좋아합니다.",
    profileImageNo: 8,
  }),
  createUser({
    id: "user_19",
    nickname: "woojin",
    name: "최우진",
    bio: "주말엔 카메라 들고 돌아다닙니다.",
    profileImageNo: 9,
  }),
  createUser({
    id: "user_20",
    nickname: "haru",
    name: "한하루",
    bio: "매일 조금씩 정리하고 기록합니다.",
    profileImageNo: null,
  }),
];

const USER_MAP = USERS.reduce((acc, user) => {
  acc[user.id] = user;
  return acc;
}, {});

module.exports = {
  USERS,
  USER_MAP,
};
