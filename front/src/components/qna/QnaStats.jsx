export default function QnaStats({ posts }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                        {posts.filter((p) => p.type === "notice").length}
                    </div>
                    <div className="text-sm text-gray-600">공지사항</div>
                </div>

                <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                        {posts.filter((p) => p.status === "처리중").length}
                    </div>
                    <div className="text-sm text-gray-600">처리중</div>
                </div>

                <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                        {posts.filter((p) => p.status === "확인중").length}
                    </div>
                    <div className="text-sm text-gray-600">확인중</div>
                </div>

                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {posts.filter((p) => p.status === "처리완료").length}
                    </div>
                    <div className="text-sm text-gray-600">처리완료</div>
                </div>

            </div>
        </div>
    );
}
