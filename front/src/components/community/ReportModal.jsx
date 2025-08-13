import { useState } from "react";

export default function ReportModal({ onSubmit, onClose }) {
    const [reason, setReason] = useState("");

    const handleSubmit = () => {
        if (!reason) return alert("사유를 선택해주세요.");
        onSubmit(reason);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-sm mx-auto rounded-xl shadow-lg p-6 space-y-4">
                <h2 className="text-lg font-bold text-gray-800">신고 사유를 선택해주세요</h2>

                <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                    <option value="">-- 사유 선택 --</option>
                    <option value="욕설">욕설</option>
                    <option value="광고">광고</option>
                    <option value="혐오 발언">혐오 발언</option>
                    <option value="기타">기타</option>
                </select>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 text-sm text-gray-600 border rounded-md hover:bg-gray-100"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        신고
                    </button>
                </div>
            </div>
        </div>
    );
}
