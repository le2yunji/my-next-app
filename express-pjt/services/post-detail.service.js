const mongoose = require("mongoose");
const User = require("../models/user.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const { toUserProfileSummaryResponse } = require("../mappers/user.mapper");

// PostLike 모델이 있으면 주석 해제
// const PostLike = require("../models/post-like.model");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const sortByOrderAsc = (items = []) => {
  return [...items].sort((a, b) => a.order - b.order);
};

const getUserPostDetailPageData = async ({
  userId,
  postId,
  viewerId = null,
}) => {
  if (!isValidObjectId(postId)) {
    return {
      success: false,
      error: {
        code: "INVALID_POST_ID",
        message: "유효하지 않은 게시물 id입니다.",
      },
    };
  }

  const user = await User.findOne({
    userId,
    isDeleted: false,
  }).lean();

  if (!user) {
    return {
      success: false,
      error: {
        code: "USER_NOT_FOUND",
        message: "존재하지 않는 사용자입니다.",
      },
    };
  }

  const post = await Post.findOne({
    _id: postId,
    authorId: user._id,
    isDeleted: false,
  }).lean();

  if (!post) {
    return {
      success: false,
      error: {
        code: "POST_NOT_FOUND",
        message: "해당 사용자의 게시물을 찾을 수 없습니다.",
      },
    };
  }

  const [userPosts, previewComment] = await Promise.all([
    Post.find({
      authorId: user._id,
      isDeleted: false,
    })
      .sort({ createdAt: -1, _id: -1 })
      .select("_id")
      .lean(),

    Comment.findOne({
      postId: post._id,
      isDeleted: false,
    })
      .sort({ createdAt: 1, _id: 1 })
      .lean(),
  ]);

  const postIndex = userPosts.findIndex(
    (item) => String(item._id) === String(post._id)
  );

  const prevPost = postIndex > 0 ? userPosts[postIndex - 1] : null;
  const nextPost =
    postIndex >= 0 && postIndex < userPosts.length - 1
      ? userPosts[postIndex + 1]
      : null;

  const previewCommentAuthor = previewComment
    ? await User.findOne({
        _id: previewComment.authorId,
        isDeleted: false,
      })
        .select("_id userId name profileImage")
        .lean()
    : null;

  let likedByMe = false;

  // PostLike 모델이 있을 때만 사용
  // if (viewerId && isValidObjectId(viewerId)) {
  //   likedByMe = !!(await PostLike.exists({
  //     postId: post._id,
  //     userId: viewerId,
  //   }));
  // }

  return {
    success: true,
    data: {
      profile: toUserProfileSummaryResponse({ user }),
      post,
      author: user,
      mediaList: sortByOrderAsc(post.media ?? []),
      likedByMe,
      previewComment: previewComment
        ? {
            ...previewComment,
            content: previewComment.isDeleted
              ? "삭제된 댓글입니다."
              : previewComment.content,
          }
        : null,
      previewCommentAuthor: previewCommentAuthor ?? null,
      navigation: {
        prevPostId: prevPost ? String(prevPost._id) : null,
        nextPostId: nextPost ? String(nextPost._id) : null,
      },
    },
  };
};

module.exports = {
  getUserPostDetailPageData,
};
