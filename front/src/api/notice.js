import API from "@/api/axios";

// 핀 공지만 가져오기(백엔드가 지원하면 쿼리, 아니면 클라에서 필터)
export const getPinnedNotices = async () => {
  // 1) 서버가 /support/notices?pinned=true 지원
  const res = await API.get("/support/notices", {
    params: { pinned: true, size: 3 },
  });
  return res.data;
};
