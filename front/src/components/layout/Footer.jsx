import React from "react";

const Footer = () => {
  const badges = [
    "2025 대구남부여성새로일하기센터 직업교육훈련",
    "윤성DX디자인컴퓨터학원",
    "자바/파이썬기반 빅데이터융합 개발자 양성과정",
  ];

  return (
    <footer
      className="bg-gray-800 text-gray-300 pt-12 pb-8 border-t-4 border-blue-600"
      role="contentinfo"
      aria-label="사이트 푸터"
    >
      <div className="max-w-6xl mx-auto px-5">
        <div className="border-t border-gray-600 pt-5 text-center">
          <p className="text-gray-500 text-sm mb-2">
            Copyright © 2025 sotong All Rights Reserved.
          </p>
          <p className="text-gray-500 text-sm mb-2">
          니매미 내매미다 © ME.MI COMPANY
          </p>
          <p className="text-gray-500 text-sm mb-2">
            통하는 세상을 만들기 위한 첫걸음입니다. 소통의 다리가 될 수 있도록
            최선을 다하겠습니다.
          </p>

          <div className="flex justify-center items-center mt-4 flex-wrap gap-3">
            {badges.map((badge, index) => (
              <span
                key={index}
                className="bg-gray-600 px-4 py-2 rounded text-xs text-blue-400 border border-gray-500"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
