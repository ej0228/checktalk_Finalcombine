import React from "react";

/**
 * 사용자 정보 입력/수정 폼 컴포넌트
 *
 * @param form - 사용자 입력 상태 객체
 * @param onChange - input 값 변경 핸들러
 * @param onSubmit - form 제출 핸들러
 * @param loading - 버튼 로딩 상태
 * @param isEdit - 수정 모드 여부 (true: 마이페이지 수정, false: 회원가입)
 * @param onEmailCheck - 이메일 중복확인 버튼 클릭 핸들러
 * @param passwordError - 비밀번호 불일치 또는 형식 오류 메시지
 * @param passwordErrorColor - 비밀번호 오류 색상 ('green' or 'red')
 * @param onPasswordChangeClick - 비밀번호 수정 버튼 클릭 핸들러 (수정 모드용)
 * @param onSendVerificationCode - 이메일 인증코드 발송 핸들러
 * @param onVerifyCode - 인증코드 확인 버튼 클릭 핸들러
 * @param receiveEmailVerified - 이메일 인증 여부 상태
 * @param setReceiveEmailVerified - 이메일 인증 상태 변경 함수
 */
export default function UserForm({
  form,
  onChange,
  onSubmit,
  loading,
  isEdit = false,
  onEmailCheck,
  passwordError,
  passwordErrorColor,
  onPasswordChangeClick,
  onSendVerificationCode,
  onVerifyCode,
  verificationCode,
  onVerificationCodeChange,
  receiveEmailVerified,
  setReceiveEmailVerified,
  onDeleteAccountClick,
}) {
  return (
    <div className="max-w-md mx-auto">
      <form className="space-y-6" onSubmit={onSubmit}>
        {/* 이메일 섹션 */}
        <div className="space-y-3">
          <div className="relative">
            <input
              name="email"
              value={form.email}
              onChange={(e) => {
                onChange(e);
                setReceiveEmailVerified(false);
              }}
              placeholder="이메일 주소"
              required
              disabled={isEdit}
              className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                isEdit
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                  : "bg-white text-gray-900 border-gray-200 focus:border-blue-500 hover:border-gray-300"
              }`}
            />
          </div>

          {!isEdit && (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onEmailCheck}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 font-semibold border border-gray-200 transition-all duration-200 transform hover:scale-[0.98] active:scale-95"
              >
                중복확인
              </button>
              <button
                type="button"
                onClick={onSendVerificationCode}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 transform hover:scale-[0.98] active:scale-95"
              >
                인증코드 발송
              </button>
            </div>
          )}
        </div>

        {/* 인증코드 섹션 */}
        {!isEdit && (
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                name="verificationCode"
                placeholder="인증코드 입력"
                value={verificationCode}
                onChange={onVerificationCodeChange}
                className="flex-1 px-4 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 hover:border-gray-300"
              />
              <button
                type="button"
                onClick={onVerifyCode}
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200 transform hover:scale-[0.98] active:scale-95"
              >
                확인
              </button>
            </div>

            {receiveEmailVerified && (
              <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-medium text-green-700">
                  이메일 인증이 완료되었습니다
                </span>
              </div>
            )}
          </div>
        )}

        {/* 비밀번호 섹션 */}
        {!isEdit && (
          <div className="space-y-3">
            <input
              name="password"
              value={form.password}
              onChange={onChange}
              type="password"
              placeholder="비밀번호"
              required
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300"
            />
            <input
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={onChange}
              type="password"
              placeholder="비밀번호 확인"
              required
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300"
            />

            {passwordError && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  passwordErrorColor === "green"
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {passwordErrorColor === "green" ? (
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
                <span
                  className={`text-sm font-medium ${
                    passwordErrorColor === "green"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {passwordError}
                </span>
              </div>
            )}
          </div>
        )}

        {/* 개인정보 섹션 */}
        <div className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="이름"
            required
            disabled={isEdit}
            className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
              isEdit
                ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                : "bg-white text-gray-900 border-gray-200 focus:border-blue-500 hover:border-gray-300"
            }`}
          />

          {isEdit && (
            <button
              type="button"
              onClick={onPasswordChangeClick}
              className="w-full px-4 py-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 transform hover:scale-[0.98] active:scale-95"
            >
              비밀번호 수정
            </button>
          )}

          {/* 전화번호 입력 */}
          <div className="flex gap-3">
            <input
              type="text"
              maxLength="3"
              placeholder="010"
              value={form.phone?.split("-")[0] || ""}
              onChange={(e) => {
                const first = e.target.value;
                const [_, mid = "", last = ""] = form.phone?.split("-") || [];
                onChange({
                  target: {
                    name: "phone",
                    value: `${first}-${mid}-${last}`,
                  },
                });
              }}
              className="w-1/3 px-4 py-4 rounded-xl border-2 border-gray-200 bg-white text-center text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <input
              type="text"
              maxLength="4"
              placeholder="0000"
              value={form.phone?.split("-")[1] || ""}
              onChange={(e) => {
                const mid = e.target.value;
                const [first = "", _, last = ""] = form.phone?.split("-") || [];
                onChange({
                  target: {
                    name: "phone",
                    value: `${first}-${mid}-${last}`,
                  },
                });
              }}
              className="w-1/3 px-4 py-4 rounded-xl border-2 border-gray-200 bg-white text-center text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <input
              type="text"
              maxLength="4"
              placeholder="0000"
              value={form.phone?.split("-")[2] || ""}
              onChange={(e) => {
                const last = e.target.value;
                const [first = "", mid = ""] = form.phone?.split("-") || [];
                onChange({
                  target: {
                    name: "phone",
                    value: `${first}-${mid}-${last}`,
                  },
                });
              }}
              className="w-1/3 px-4 py-4 rounded-xl border-2 border-gray-200 bg-white text-center text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <select
              name="birthYear"
              value={form.birthDate ? form.birthDate.split("-")[0] : ""}
              onChange={(e) => {
                const year = e.target.value;
                const month = form.birthDate
                  ? form.birthDate.split("-")[1]
                  : "01";
                const day = form.birthDate
                  ? form.birthDate.split("-")[2]
                  : "01";
                onChange({
                  target: {
                    name: "birthDate",
                    value: year ? `${year}-${month}-${day}` : "",
                  },
                });
              }}
              className="w-full px-3 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 appearance-none cursor-pointer text-center"
            >
              <option value="">년도</option>
              {Array.from({ length: 100 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                );
              })}
            </select>

            <select
              name="birthMonth"
              value={form.birthDate ? form.birthDate.split("-")[1] : ""}
              onChange={(e) => {
                const month = e.target.value;
                const year = form.birthDate
                  ? form.birthDate.split("-")[0]
                  : new Date().getFullYear();
                const day = form.birthDate
                  ? form.birthDate.split("-")[2]
                  : "01";
                onChange({
                  target: {
                    name: "birthDate",
                    value: month
                      ? `${year}-${month.padStart(2, "0")}-${day}`
                      : "",
                  },
                });
              }}
              className="w-full px-3 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 appearance-none cursor-pointer text-center"
            >
              <option value="">월</option>
              {Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                return (
                  <option key={month} value={String(month).padStart(2, "0")}>
                    {month}월
                  </option>
                );
              })}
            </select>

            <select
              name="birthDay"
              value={
                form.birthDate
                  ? form.birthDate.split("-")[2].padStart(2, "0")
                  : ""
              }
              onChange={(e) => {
                const day = e.target.value;
                const year = form.birthDate
                  ? form.birthDate.split("-")[0]
                  : new Date().getFullYear();
                const month = form.birthDate
                  ? form.birthDate.split("-")[1]
                  : "01";
                onChange({
                  target: {
                    name: "birthDate",
                    value: day
                      ? `${year}-${month}-${day.padStart(2, "0")}`
                      : "",
                  },
                });
              }}
              className="w-full px-3 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 appearance-none cursor-pointer text-center"
            >
              <option value="">일</option>
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                return (
                  <option key={day} value={String(day).padStart(2, "0")}>
                    {day}일
                  </option>
                );
              })}
            </select>
          </div>

          <select
            name="gender"
            value={form.gender}
            onChange={onChange}
            className={`w-full px-4 py-4 rounded-xl border-2 text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:border-blue-500 hover:border-gray-300 appearance-none cursor-pointer
              ${
                form.gender === "MALE"
                  ? "bg-blue-100 border-blue-200 focus:ring-blue-300"
                  : form.gender === "FEMALE"
                  ? "bg-pink-100 border-pink-200 focus:ring-pink-300"
                  : "bg-white border-gray-200"
              }`}
          >
            <option value="">성별 선택</option>
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
          </select>

          <select
            name="job"
            value={form.job || ""}
            onChange={onChange}
            className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 appearance-none cursor-pointer"
          >
            <option value="">직업 선택</option>
            <option value="STUDENT">학생</option>
            <option value="OFFICE_WORKER">직장인</option>
            <option value="FREELANCER">프리랜서</option>
            <option value="ETC">기타</option>
          </select>

          <select
            name="interest"
            value={form.interest || ""}
            onChange={onChange}
            className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 appearance-none cursor-pointer"
          >
            <option value="">관심영역 선택</option>
            <option value="COUNSELING">상담</option>
            <option value="PRESENTATION">발표</option>
            <option value="RELATIONSHIP">관계</option>
            <option value="TEAMWORK">협업</option>
            <option value="ETC">기타</option>
          </select>

          <select
            name="usagePurpose"
            value={form.usagePurpose || ""}
            onChange={onChange}
            className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300 appearance-none cursor-pointer"
          >
            <option value="">사용용도 선택</option>
            <option value="SELF_ANALYSIS">자기분석</option>
            <option value="SCHOOL_PROJECT">학교과제</option>
            <option value="COUNSELING_TOOL">상담도구</option>
            <option value="OTHER">기타</option>
          </select>

          <input
            name="communicationGoal"
            value={form.communicationGoal || ""}
            onChange={onChange}
            placeholder="커뮤니케이션 목표 (예: 회의에서 말 잘하고 싶어요)"
            className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300"
          />
        </div>

        {/* 제출 버튼 */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200 transform ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 hover:scale-[0.98] active:scale-95"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-25"
                  ></circle>
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    className="opacity-75"
                  ></path>
                </svg>
                처리 중...
              </div>
            ) : (
              <>{isEdit ? "정보 수정하기" : "가입하기"}</>
            )}
          </button>
        </div>

        {/* 회원 탈퇴 */}
        {isEdit && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onDeleteAccountClick}
              className="text-sm text-gray-400 hover:text-red-500 underline underline-offset-2 transition-colors duration-200"
            >
              회원 탈퇴
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
