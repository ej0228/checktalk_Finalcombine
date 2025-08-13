import { useEffect, useMemo, useRef, useState } from "react";

export default function SupportPostContent({ post, isEditing, onEdit }) {
  const [previewUrls, setPreviewUrls] = useState([]);
  const blobUrlsRef = useRef([]);

  const files = Array.isArray(post?.files) ? post.files : [];

  // files의 "안정 키" (렌더 때 불필요한 재생성 방지)
  const filesKey = useMemo(
    () => files.map(f => f?.id ?? f?.filePath ?? f?.path ?? f?.url ?? f?.name ?? "").join("|"),
    [files]
  );

  useEffect(() => {
    // 이전 blob URL 정리
    blobUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
    blobUrlsRef.current = [];

    const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, ""); // 끝 슬래시 제거
    const urls = files
      .filter(Boolean)
      .map(file => {
        // 1) 새로 첨부한 파일(Blob/File)
        if (file instanceof File || file instanceof Blob) {
          const u = URL.createObjectURL(file);
          blobUrlsRef.current.push(u);
          return u;
        }

        // 2) 서버 저장 파일(문자 경로)
        const raw = file.url || file.filePath || file.path || ""; // 키 이름 다양화
        if (!raw) return null;

        // 2-1) 이미 절대 URL이면 그대로 사용 (http/https)
        if (/^https?:\/\//i.test(raw)) return raw;

        // 2-2) 상대 경로면 base와 합치기
        const path = String(raw).replace(/^\/+/, ""); // 앞 슬래시 제거
        if (!base) return `/${path}`;                 // base가 비어있으면 상대경로라도 반환
        return `${base}/${path}`;
      })
      .filter(Boolean);

    setPreviewUrls(urls);

    // 언마운트/변경 시 blob 정리
    return () => {
      blobUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
      blobUrlsRef.current = [];
    };
  }, [filesKey]);

  return (
    <div className="p-6 space-y-4">
      {isEditing ? (
        <textarea
          value={post?.content || ""}
          onChange={(e) => onEdit("content", e.target.value)}
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="내용을 입력하세요..."
        />
      ) : (
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {post?.content?.trim() || (
            <span className="text-gray-400 italic">작성된 내용이 없습니다.</span>
          )}
        </div>
      )}

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {previewUrls.map((src) => (
            <img
              key={src}
              src={src}
              alt="첨부 이미지"
              loading="lazy"
              decoding="async"
              className="w-24 h-24 object-contain rounded border border-gray-300 shadow-sm"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ))}
        </div>
      )}

      {/* 임시 디버그 */}
      {/* <pre className="text-xs text-gray-500 mt-2">
        {previewUrls.length ? previewUrls.join("\n") : "미리보기 URL이 0개입니다."}
      </pre> */}
    </div>
  );
}
