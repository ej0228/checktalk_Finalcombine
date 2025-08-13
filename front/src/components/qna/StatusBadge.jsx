import {
    Clock,
    AlertCircle,
    CheckCircle,
    Pause,
    Settings,
} from "lucide-react";

const statusColors = {
    확인중: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
        icon: Clock,
    },
    처리중: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-200",
        icon: AlertCircle,
    },
    처리완료: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
        icon: CheckCircle,
    },
    보류: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
        icon: Pause,
    },
};

export default function StatusBadge({
    status,
    isAdmin = false,
    show,
    setShow,
    onChange,
}) {
    const current = statusColors[status] || statusColors["확인중"];
    const StatusIcon = current.icon;

    return (
        <div className="relative">
            {/* 뱃지 버튼 */}
            <button
                onClick={() => isAdmin && setShow(!show)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${current.bg} ${current.text} ${current.border} ${isAdmin ? "hover:opacity-80 cursor-pointer" : ""
                    }`}
            >
                <StatusIcon size={14} />
                {status}
                {isAdmin && <Settings size={12} />}
            </button>

            {/* 드롭다운 */}
            {show && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                    {Object.entries(statusColors).map(([label, config]) => (
                        <button
                            key={label}
                            onClick={() => {
                                onChange(label);
                                setShow(false);
                            }}
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${status === label ? "bg-blue-50" : ""
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                {<config.icon size={14} className={config.text} />}
                                <span className={`text-sm ${config.text}`}>{label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
