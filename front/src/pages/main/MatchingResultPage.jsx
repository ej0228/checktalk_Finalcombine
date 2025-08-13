import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  BarChart3,
  Calendar,
  TrendingUp,
  RefreshCw,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

const MatchingResultPage = () => {
  const location = useLocation();
  const result = location.state;

  //원본대화내용을 저장해둠, 재분석의뢰시 원본대화는 남겨둘수있도록
  const recordId = result?.recordId;
  //결과 화면에 매칭율 뿌려주기 위해 변수 받기 matchingRate
  const matchingRate = result.result?.matchingRate || 0;

  if (!result) {
    return <p>분석 결과 없음</p>;
  }

  // 매칭률에 따른 결과 분석
  const getResultAnalysis = (rate) => {
    if (rate <= 50) {
      return {
        icon: <XCircle className="text-red-500" size={48} />,
        color: "red",
        title: "다시 생각해보세요",
        description:
          "입력하신 내용과 원본의 매칭률이 낮습니다. 원본 내용을 다시 한번 자세히 읽어보시고 핵심 내용을 파악해보세요.",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-700",
      };
    } else if (rate <= 80) {
      return {
        icon: <AlertTriangle className="text-yellow-500" size={48} />,
        color: "yellow",
        title: "상세 내용을 확인해보세요",
        description:
          "기본적인 내용은 이해하셨지만, 일부 중요한 세부사항이 누락되었을 수 있습니다. 놓친 부분이 있는지 다시 확인해보세요.",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-700",
      };
    } else {
      return {
        icon: <CheckCircle className="text-green-500" size={48} />,
        color: "green",
        title: "이해도가 대부분 일치합니다",
        description:
          "원본 내용을 매우 잘 이해하셨습니다. 주요 내용과 세부사항을 정확하게 파악하고 계십니다.",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-700",
      };
    }
  };

  const analysis = getResultAnalysis(matchingRate);

  // 매칭률에 따른 원형 진행바 색상
  const getCircleColor = (rate) => {
    if (rate <= 50) return "text-red-500";
    if (rate <= 80) return "text-yellow-500";
    return "text-green-500";
  };

  const navigate = useNavigate();

  const handleRetryAnalysis = async () => {
    if (!recordId) {
      alert("recordId가 존재하지 않습니다.");
      return;
    }

    console.log("다시 분석하기");

    try {
      console.log("[MatchingResultPage] recordId = " + recordId);
      //await axios.post(`${API}/analysis/${recordId}/reset-understanding`);
      await axios.put(
        `${API}/analysis/${recordId}/reset-understanding`,
        {},
        { withCredentials: true }
      );

      const response = await axios.get(`${API}/analysis/${recordId}`, {
        withCredentials: true,
      });
      //const response = await axios.get(`${API}/analysis/${recordId}`);
      const result = response.data;

      console.log("분석 결과:", result);
      console.log("🔍 전체 응답 구조:", JSON.stringify(result, null, 2));
      // 수정: result.result 가 아닌 result에서 직접 추출
      // 원본 대화 내용과 유저 입력 가져오기 (중요!)
      const originalText = result?.originalText;
      const userText = result?.userText;

      // const originalText = data?.originalText;
      // const userText = data?.userText;

      console.log("넘길 originalText:", originalText);
      console.log("넘길 userText:", userText);

      navigate("/func", {
        state: {
          recordId: result.recordId,
          originalText,
          userText,
        },
      });
    } catch (error) {
      console.error("결과 조회 실패:", error);
    }
  };

  const handleViewAISummary = () => {
    // AI 요약본 확인하기 버튼 클릭 시 실행될 함수
    console.log("AI 요약본 확인");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* 헤더 */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <BarChart3 className="text-blue-600" size={40} />
            결과창
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600 text-lg">
            <Calendar size={20} />
            <span>
              {result.createdAt
                ? new Date(result.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })
                : ""}
            </span>
          </div>
        </div>

        {/* 메인 결과 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              입력하신 내용
            </h2>
            <p className="text-lg text-gray-700 bg-gray-50 rounded-xl p-4 border">
              "{result.subject || "주제 없음"}"
            </p>
          </div>

          {/* 매칭률 표시 영역 */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-48 h-48 mb-6">
              {/* 원형 진행바 배경 */}
              <svg
                className="w-48 h-48 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className={getCircleColor(matchingRate)}
                  strokeDasharray={`${2.51 * matchingRate} 251.2`}
                  style={{
                    transition: "stroke-dasharray 1s ease-in-out",
                  }}
                />
              </svg>
              {/* 중앙 텍스트 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">
                  {matchingRate}%
                </span>
                <span className="text-gray-600 text-sm mt-1">매칭률</span>
              </div>
            </div>

            <p className="text-xl text-gray-800 font-medium text-center">
              원본과의 매칭률은{" "}
              <span className={`font-bold ${getCircleColor(matchingRate)}`}>
                {matchingRate}%
              </span>
              입니다.
            </p>
          </div>
        </div>

        {/* 상세 분석 결과 */}
        <div
          className={`${analysis.bgColor} ${analysis.borderColor} border-2 rounded-2xl p-8 mb-8`}
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">{analysis.icon}</div>
            <h3 className={`text-2xl font-bold ${analysis.textColor} mb-4`}>
              {analysis.title}
            </h3>
            <p
              className={`text-lg ${analysis.textColor} leading-relaxed max-w-2xl`}
            >
              {analysis.description}
            </p>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetryAnalysis}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium 
                     transition-all duration-300 flex items-center justify-center gap-3 shadow-sm text-lg"
          >
            <RefreshCw size={20} />
            다시 확인해보기
          </button>

          <button
            onClick={handleViewAISummary}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium 
                     transition-all duration-300 flex items-center justify-center gap-3 shadow-sm text-lg"
          >
            <FileText size={20} />
            AI 요약본_개발중
          </button>
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>결과는 자동으로 저장되며, 언제든지 다시 확인하실 수 있습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default MatchingResultPage;
