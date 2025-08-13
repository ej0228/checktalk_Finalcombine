// 이메일 마스킹
export const maskEmail = (email) => {
  const [username, domain] = email.split('@');
  if (username.length <= 3) return email;
  const visibleStart = username.slice(0, 2);
  const visibleEnd = username.slice(-1);
  const masked = '*'.repeat(Math.min(username.length - 3, 4));
  return `${visibleStart}${masked}${visibleEnd}@${domain}`;
};

// 이름+이메일 형식 마스킹
export const maskAuthorInfo = (name, email) => {
  const maskedEmail = maskEmail(email);
  return `${name} (${maskedEmail})`;
};