import API from "./axios";

// 댓글 조회 (기본 page = 0)
export const fetchComments = (page = 0) => API.get(`/community?page=${page}`);

// 댓글 작성
export const createComment = (data) => API.post("/community", data);

// 댓글 수정
export const updateComment = (data) => API.put("/community", data);

// 댓글 신고
export const reportComment = (commentId) =>
  API.post(`/community/${commentId}/report`);
