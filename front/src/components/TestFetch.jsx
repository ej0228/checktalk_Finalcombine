// src/components/TestFetch.jsx
import { useEffect, useState } from "react";

function TestFetch() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8090/api/hello")
      .then((res) => res.text())
      .then((text) => setMessage(text))
      .catch((err) => setMessage("API 호출 실패: " + err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-blue-600">Spring Boot 응답:</h1>
      <p className="mt-2">{message}</p>
    </div>
  );
}

export default TestFetch;
