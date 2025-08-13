// src/pages/introduce.jsx

import React, { useEffect, useRef } from "react";
import mark from "@/assets/mark.png"; // 경로에 맞춰 수정



const IntroducePage = () => {
  const observerRef = useRef();

  useEffect(() => {
    // 부드러운 스크롤 효과
    const handleSmoothScroll = (e) => {
      e.preventDefault();
      const targetId = e.target.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    // 스크롤 시 네비게이션 배경 변화
    const handleScroll = () => {
      const nav = document.querySelector("nav");
      if (nav) {
        if (window.scrollY > 50) {
          nav.classList.add("shadow-lg", "backdrop-blur-lg");
        } else {
          nav.classList.remove("shadow-lg", "backdrop-blur-lg");
        }
      }
    };

    // Intersection Observer for scroll animations
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up");
          entry.target.classList.remove("opacity-0", "translate-y-8");
        }
      });
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    });

    // 애니메이션 대상 요소들 관찰
    const animateElements = document.querySelectorAll(".animate-on-scroll");
    animateElements.forEach((el) => {
      el.classList.add(
        "opacity-0",
        "translate-y-8",
        "transition-all",
        "duration-700"
      );
      observerRef.current.observe(el);
    });

    // 이벤트 리스너 등록
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", handleSmoothScroll);
    });

    window.addEventListener("scroll", handleScroll);

    // 클린업 함수
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener("click", handleSmoothScroll);
      });
      window.removeEventListener("scroll", handleScroll);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="bg-white overflow-x-hidden">
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 min-h-[60vh] flex items-center overflow-hidden">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="text-white">
            {/* 로고 애니메이션 */}
            <div className="mb-8 animate-on-scroll">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl border-1 border-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-2xl">
    <img 
      src={mark} 
      alt="쳌톡 마크" 
      className="w-16 h-16 object-contain" 
    />
  </div>
</div>


{/* <div className="mb-8 animate-on-scroll">
  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-2xl">
    <img 
      src={mark} 
      alt="쳌톡 마크" 
      className="w-full h-full object-contain" 
    />
  </div>
</div> */}



            <h1 className="text-6xl lg:text-7xl font-bold mb-6 animate-on-scroll">
              쳌톡{" "}
              <span className="block text-4xl lg:text-5xl font-light mt-4 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                CheckTalk
              </span>
            </h1>

            <p className="text-2xl lg:text-3xl mb-8 text-indigo-100 animate-on-scroll">
              나의 이해, 얼마나 일치할까?
            </p>

            <p className="text-lg mb-12 text-indigo-200 leading-relaxed max-w-2xl mx-auto animate-on-scroll">
              쳌톡은 사용자의 해석과 실제 대화 내용을 비교해 일치도를 분석해주는
              <br className="hidden sm:block" />
              차세대 AI 분석 도구입니다.
            </p>
          </div>
        </div>
      </section>

        {/* 주요 기능 섹션 */}
        <section
        id="features"
        className="py-24 bg-gradient-to-b from-slate-50 to-white relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-on-scroll">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border-1 border-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-2xl">
              <img
                src={mark}
                alt="쳌톡 마크"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h2 className="text-5xl font-bold text-gray-900  mt-6 mb-6">
              쳌톡만의 차별화
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              혁신적인 AI 기술로 구현한 개인 맞춤형 텍스트 분석의 새로운
              패러다임
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: mark,
                title: "개인 맞춤형 분석",
                description:
                  "기존 요약형 AI가 아닌, 사용자 본인의 해석을 기준으로 분석하여 개인화된 피드백을 제공합니다.",
              },
              {
                icon: mark,
                title: "AI 텍스트 분석",
                description:
                  "최첨단 AI가 사용자 입력 텍스트를 정밀하게 분석하여 핵심 내용과 숨겨진 의미를 파악합니다.",
              },
              {
                icon: mark,
                title: "시각화 대시보드",
                description:
                  "원문과 이해 내용을 비교하여 분석 결과를 직관적이고 아름다운 차트로 시각화합니다.",
              },
              {
                icon: mark,
                title: "실생활 적용",
                description:
                  "회의록, 통화, 채팅 등 실제 대화에 바로 적용 가능한 실용적인 분석 결과를 제공합니다.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group animate-on-scroll bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 hover:border-indigo-200"
              >
                <div className="w-16 h-16 bg-white border-1 border-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

           {/* 프로젝트 목표 섹션 */}
           <section className="py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-indigo-100 to-transparent rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-100 to-transparent rounded-full filter blur-3xl opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-on-scroll">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-1 border-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6">
              <img src={mark} alt="쳌톡 마크" className="w-12 h-12 object-contain" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              프로젝트 목표
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              더 나은 소통과 이해를 위한 쳌톡의 비전과 핵심 가치
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              {[
                {
                  number: "01",
                  title: "문해력 향상 도구 개발",
                  description:
                    "개인 맞춤형 텍스트 분석 도구를 통해 사용자의 문해력을 체계적이고 효과적으로 향상시킵니다.",
                },
                {
                  number: "02",
                  title: "의미 차이 파악 및 시각화",
                  description:
                    "고도화된 AI를 활용해 원문과 이해 내용 간의 미묘한 의미 차이까지 정확히 파악하고 시각화합니다.",
                },
                {
                  number: "03",
                  title: "소통 문제 예방",
                  description:
                    "정확한 소통을 돕고 의사소통 기반의 오해와 갈등을 사전에 예방하는 데 기여합니다.",
                },
                {
                  number: "04",
                  title: "접근성 높은 서비스",
                  description:
                    "학습자, 교육자, 일반 사용자 모두가 쉽고 편리하게 접근 가능한 직관적인 서비스를 제공합니다.",
                },
              ].map((goal, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-6 animate-on-scroll group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-sm">
                      {goal.number}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                      {goal.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {goal.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center animate-on-scroll">
              <div className="relative">
                {/* 배경 원형 */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full filter blur-2xl opacity-20 animate-pulse"></div>

                <div className="relative bg-gradient-to-br from-white to-indigo-50 rounded-3xl p-12 shadow-2xl border border-indigo-100">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <img
                src={mark}
                alt="쳌톡 마크"
                className="w-20 h-20 object-contain"
              />
                      <i className="fas fa-bullseye text-white text-4xl"></i>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">
                      궁극적 목표
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed max-w-sm">
                      모든 사람이 정확하게 이해하고
                      <br />
                      <span className="text-indigo-600 font-semibold">
                        {" "}
                        효과적으로 소통
                      </span>
                      할 수 있는 <br />더 나은 세상을 만드는 것
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 추가 CSS 스타일 */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default IntroducePage;
