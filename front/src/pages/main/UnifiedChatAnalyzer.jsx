import React, { useState, useRef } from "react";

//원본대화 불러오기 위해 필요
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import {
  Upload,
  FileText,
  MessageSquare,
  TrendingUp,
  Users,
  Clock,
  Send,
  X,
  BarChart3,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

const UnifiedChatAnalyzer = () => {
  const [inputText, setInputText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [userUnderstanding, setUserUnderstanding] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  //원본대화입력
  const location = useLocation();

  useEffect(() => {
    if (location.state?.originalText) {
      setInputText(location.state.originalText); // 대화 원문 채움
    }
    if (location.state?.userText) {
      setUserUnderstanding(location.state.userText); // 사용자 입력 채움
    }
  }, [location.state]);

  // 드래그 앤 드롭 핸들러
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = async (files) => {
    const newFiles = [];
    for (let file of files) {
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const content = await file.text();
        newFiles.push({
          name: file.name,
          content: content,
          size: file.size,
        });
      }
    }
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalysis = async () => {
    let originalText = inputText;

    if (uploadedFiles.length > 0) {
      const fileContents = uploadedFiles
        .map((file) => file.content)
        .join("\n\n");
      originalText = originalText
        ? `${originalText}\n\n${fileContents}`
        : fileContents;
    }
    const userText = userUnderstanding;

    const formData = new FormData();
    formData.append("originalText", originalText);
    formData.append("userText", userText);

    console.log("originalText:", originalText);
    console.log("userText:", userText);
    for (let [key, value] of formData.entries()) {
      console.log("formData entry:", key, value);
    }
    //formData.append("originalFile", file); //추가 ?
    // 필요하다면 파일 첨부 예시 (주석 해제 시)
    // if (uploadedFiles.length > 0) {
    //   const file = uploadedFiles[0];
    //   formData.append("originalFile", new Blob([file.content], { type: "text/plain" }), file.name);
    // }

    try {
      const response = await axios.post(
        `${API}/analysis/start`, // 실제 요청 URL
        formData, // 보낼 데이터 (FormData 형태)
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, //ID보내는 값
        }
      );

      // ✅ 응답 받은 후에 로그인 여부 확인
      if (!response.data.recordId) {
        alert("로그인하지 않은 상태입니다. 분석 결과는 저장되지 않습니다.");
      }
      // 분석 결과 데이터를 다음 페이지로 넘기며 이동

      console.log("보낼 originalText:", originalText);
      console.log("보낼 userText:", userText);
      navigate("/funcR", { state: response.data });
    } catch (error) {
      console.error("분석 요청 실패:", error);
    }
  };



  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* 헤더 */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <BarChart3 className="text-blue-600" size={40} />
            대화분석기
          </h1>
          <p className="text-gray-600 text-lg">
            대화 내용을 업로드하고 이해도를 분석해보세요
          </p>
        </div>
        {/* 대화 내용 분석 부분 좌,우 정렬을 위해 grid 로 묶기 _ 시작 div */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 대화 내용 입력 영역 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 relative">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare className="text-gray-600" size={20} />
              대화 내용 입력
            </h2>
            {/* 파일 업로드 버튼 */}
            <div className="absolute top-6 right-8">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
              >
                <Upload size={16} />
                파일 선택
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
            </div>
            {/* 드래그 앤 드롭 + 텍스트 입력 영역 */}
            <div
              className={`border-2 border-dashed rounded-xl transition-all duration-300 ${dragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="여기에 대화 내용을 입력하거나 텍스트 파일을 드래그하세요..."
                className="w-full h-64 p-6 bg-transparent text-gray-900 placeholder-gray-400 resize-none focus:outline-none text-sm leading-relaxed"
                style={{ minHeight: "200px" }}
              />
            </div>

            {/* 업로드된 파일 표시 */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600 mb-2">업로드된 파일:</p>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="text-gray-500" size={16} />
                      <span className="text-gray-900 text-sm font-medium">
                        {file.name}
                      </span>
                      <span className="text-gray-500 text-xs">
                        ({formatBytes(file.size)})
                      </span>
                    </div>
                    {/* 업로드 된 파일 삭제 버튼 */}
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* 사용자 이해 내용 입력 영역 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="text-gray-600" size={20} />
              내가 이해한 내용
            </h2>

            <div className="border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl transition-all duration-300">
              <textarea
                value={userUnderstanding}
                onChange={(e) => setUserUnderstanding(e.target.value)}
                placeholder="대화 내용을 읽고 이해한 내용을 여기에 작성해주세요..."
                className="w-full h-64 p-6 bg-transparent text-gray-900 placeholder-gray-400 resize-none focus:outline-none text-sm leading-relaxed"
                style={{ minHeight: "200px" }}
              />
            </div>
          </div>
        </div>
        {/* 대화 내용 분석 부분 좌,우 정렬을 위해 grid 로 묶기 _ 끝 div */}
        {/* 내용 매칭 분석 버튼 */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleAnalysis}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            서버에 분석 요청
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnifiedChatAnalyzer;
