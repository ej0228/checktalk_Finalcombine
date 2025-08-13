import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export default function DeleteAccountModal({ onClose }) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setPassword(e.target.value);
    };

    const handleDelete = async () => {
        if (!password.trim()) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        const confirm = window.confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
        if (!confirm) return;

        try {
            setLoading(true);
            await axios.delete(`${API}/users/delete`, {
                data: { password },
                withCredentials: true,
            });

            alert("탈퇴가 완료되었습니다.");
            localStorage.removeItem("user");
            window.location.href = "/";
        } catch (err) {
            const msg = err.response?.data || "탈퇴 요청 중 오류가 발생했습니다.";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">회원 탈퇴</h2>
                    <p className="text-gray-600">정말로 탈퇴하시겠습니까?</p>
                    <p className="text-sm text-red-500 mt-1">이 작업은 되돌릴 수 없습니다.</p>
                </div>

                {/* 경고 메시지 */}
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-800 mb-1">탈퇴 시 다음 정보가 삭제됩니다:</p>
                            <ul className="text-xs text-red-700 list-disc list-inside space-y-1">
                                <li>개인정보 및 계정 정보</li>
                                <li>작성한 모든 게시글 및 댓글</li>
                                <li>서비스 이용 기록</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 비밀번호 입력 */}
                <div className="space-y-3 mb-8">
                    <label className="block text-sm font-semibold text-gray-700">
                        본인 확인을 위해 비밀번호를 입력해주세요
                    </label>
                    <input
                        type="password"
                        placeholder="비밀번호 입력"
                        value={password}
                        onChange={handleChange}
                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 hover:border-gray-300"
                        autoFocus
                    />
                </div>

                {/* 버튼 */}
                <div className="space-y-3">
                    <button
                        onClick={handleDelete}
                        disabled={loading || !password.trim()}
                        className={`w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200 transform ${loading || !password.trim()
                                ? "bg-red-300 cursor-not-allowed text-white"
                                : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25 hover:scale-[0.98] active:scale-95"
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                탈퇴 처리 중...
                            </div>
                        ) : (
                            "탈퇴하기"
                        )}
                    </button>

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 transform ${loading
                                ? "bg-gray-200 cursor-not-allowed text-gray-400"
                                : "bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 border border-gray-200 hover:scale-[0.98] active:scale-95"
                            }`}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}