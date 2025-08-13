// 날짜+시간을 "YYYY-MM-DD HH:mm:ss" 형태로 반환
//이 함수는 AdminAnalysis.jsx, AdminMatchingTrendRow.jsx 등에서 공통 사용 가능
export function formatDateTime(isoString) {
  const date = new Date(isoString);
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}
