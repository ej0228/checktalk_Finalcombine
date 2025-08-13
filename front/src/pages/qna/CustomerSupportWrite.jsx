import { useNavigate } from "react-router-dom";
import SupportPostForm from "@/components/qna/SupportPostForm";
import API from "@/api/axios";

export default function CustomerSupportWrite() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleSubmit = async (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("type", data.type);
    formData.append("name", data.name || user?.name || "");
    formData.append("email", data.email || user?.email || "");
    formData.append("phone", data.phone || user?.phone || "");

    if (data.files) {
           const arr = Array.isArray(data.files) ? data.files : Array.from(data.files);
           arr.forEach((file, i) => {
             // 파일명이 없거나 'blob'이면 확장자를 타입에서 추출해 붙임
            let filename = (file.name && file.name !== "blob") ? file.name : null;
              if (!filename) {
                const ext = (file.type && file.type.split("/")[1]) || "png"; // image/png -> png
                filename = `upload_${Date.now()}_${i}.${ext}`;
              }
              formData.append("files", file, filename); // ✅ FormData 3번째 인자: 서버로 전달될 파일명
            });
          }

    try {
      await API.post(
        `${import.meta.env.VITE_API_BASE_URL}/support/posts`,
        formData,
        {
          withCredentials: true,
        }
      );
      alert("문의가 등록되었습니다.");
      navigate("/qna");
    } catch (error) {
      alert("등록 실패");
      console.error("등록 에러:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 shadow-md rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">문의 등록</h1>
        <SupportPostForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
