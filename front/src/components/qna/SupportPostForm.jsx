import { useState, useEffect } from "react";
import { compressImages } from "@/utils/compressImage";

export default function SupportPostForm({ onSubmit }) {
    const user = JSON.parse(localStorage.getItem("user"));

    const [form, setForm] = useState({
        title: "",
        content: "",
        type: "", // 선택하게
        name: "",
        email: "",
        phone: "",
        files: [],
    });

    // 유저 정보 자동 채워주기
    useEffect(() => {
        if (user) {
            setForm((prev) => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        const compressed = await compressImages(files);
        setForm((prev) => ({ ...prev, files: compressed }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.title.trim() || !form.content.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
            alert("이름, 이메일, 전화번호는 필수입니다.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            alert("유효한 이메일 형식이 아닙니다.");
            return;
        }

        if (!form.type) {
            alert("문의 유형을 선택해주세요.");
            return;
        }

        onSubmit(form);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
            <h2 className="text-2xl font-bold text-gray-900">문의 작성하기</h2>

            {/* 문의 유형 */}
            <div>
                <label className="block mb-1 font-medium text-gray-700">문의 유형</label>
                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                >
                    <option value="">문의 유형을 선택하세요</option>
                    <option value="bug">버그 신고</option>
                    <option value="feature">기능 제안</option>
                    <option value="general">일반 문의</option>
                </select>
            </div>

            {/* 이름, 이메일 (읽기 전용) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                    name="name"
                    value={form.name}
                    readOnly
                    className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
                <input
                    name="email"
                    value={form.email}
                    readOnly
                    type="email"
                    className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
            </div>

            {/* 전화번호 (3칸 분리) */}
            <div>
                <label className="block mb-1 font-medium text-gray-700">전화번호</label>
                <div className="flex gap-3">
                    <input
                        type="text"
                        maxLength="3"
                        placeholder="010"
                        value={form.phone?.split('-')[0] || ''}
                        onChange={(e) => {
                            const first = e.target.value;
                            const [_, mid = '', last = ''] = form.phone?.split('-') || [];
                            handleChange({
                                target: {
                                    name: 'phone',
                                    value: `${first}-${mid}-${last}`,
                                },
                            });
                        }}
                        className="w-1/3 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-center text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <input
                        type="text"
                        maxLength="4"
                        placeholder="0000"
                        value={form.phone?.split('-')[1] || ''}
                        onChange={(e) => {
                            const mid = e.target.value;
                            const [first = '', _, last = ''] = form.phone?.split('-') || [];
                            handleChange({
                                target: {
                                    name: 'phone',
                                    value: `${first}-${mid}-${last}`,
                                },
                            });
                        }}
                        className="w-1/3 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-center text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <input
                        type="text"
                        maxLength="4"
                        placeholder="0000"
                        value={form.phone?.split('-')[2] || ''}
                        onChange={(e) => {
                            const last = e.target.value;
                            const [first = '', mid = ''] = form.phone?.split('-') || [];
                            handleChange({
                                target: {
                                    name: 'phone',
                                    value: `${first}-${mid}-${last}`,
                                },
                            });
                        }}
                        className="w-1/3 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-center text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* 제목 */}
            <div>
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="제목을 입력하세요"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                />
            </div>

            {/* 내용 */}
            <div>
                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="내용을 입력하세요"
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500"
                />
            </div>

            {/* 이미지 첨부 */}
            <div>
                <label className="block mb-1 font-medium text-gray-700">이미지 첨부</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>

            {/* 이미지 미리보기 */}
            {form.files.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {form.files.map((file, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <img
                                src={URL.createObjectURL(file)}
                                alt="미리보기"
                                className="w-24 h-24 object-cover rounded-xl border border-gray-200 shadow-sm"
                            />
                            <p className="text-xs mt-1 truncate">{file.name}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* 제출 버튼 */}
            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full py-4 rounded-xl font-bold text-lg tracking-wide bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:scale-[0.98] active:scale-95 transition-all duration-200"
                >
                    문의 등록
                </button>
                </div>
        </form>
    );
}
