import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserForm from "@/components/auth/UserForm.jsx";
import PasswordChangeModal from "@/components/auth/MyPagePasswordChangeModal.jsx";
import DeleteAccountModal from "@/components/auth/DeleteAccountModal.jsx";

const API = import.meta.env.VITE_API_BASE_URL;

export default function Mypage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    job: "",
    interest: "",
    usagePurpose: "",
    communicationGoal: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 내 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`${API}/users/mypage`, {
          withCredentials: true,
        });
        setForm(res.data);
      } catch (err) {
        console.error("유저 정보 요청 실패", err);
        alert("회원정보를 불러오지 못했습니다.");
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await axios.put(`${API}/users/update`, form, {
        withCredentials: true,
      });

      alert("회원정보가 성공적으로 수정되었습니다!");

      const stored = localStorage.getItem("user");
      if (stored) {
        const user = JSON.parse(stored);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, name: form.name })
        );
      }

      navigate("/mypage");
    } catch (err) {
      console.error("회원정보 수정 실패", err);
      alert("회원정보 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm max-w-md w-full px-8 py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
          회원정보 수정
        </h2>
        <UserForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          isEdit={true}
          onPasswordChangeClick={() => setShowPasswordModal(true)}
          onDeleteAccountClick={() => setShowDeleteModal(true)} // ✅ 넘겨줌
        />

        {/* 회원 탈퇴 텍스트 링크 - 이건 UserForm에서 렌더링할 수도 있음 */}

        {/* 모달들 */}
        {showDeleteModal && (
          <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
        )}
        {showPasswordModal && (
          <PasswordChangeModal onClose={() => setShowPasswordModal(false)} />
        )}
      </div>
    </div>
  );
}
