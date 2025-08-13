export default function Pagination({ page, totalPages, onChange, color = "purple" }) {
    const isBlue = color === "blue";
  
    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          className={`px-3 py-1 rounded ${isBlue ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}
          disabled={page === 0}
          onClick={() => onChange(page - 1)}
        >
          이전
        </button>
  
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`px-3 py-1 rounded border ${page === idx
                ? isBlue
                  ? "bg-blue-500 text-white"
                  : "bg-purple-500 text-white"
                : "bg-white text-gray-700 border-gray-300"
              }`}
            onClick={() => onChange(idx)}
          >
            {idx + 1}
          </button>
        ))}
  
        <button
          className={`px-3 py-1 rounded ${isBlue ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}
          disabled={page + 1 === totalPages}
          onClick={() => onChange(page + 1)}
        >
          다음
        </button>
      </div>
    );
  }