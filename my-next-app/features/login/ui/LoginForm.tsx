"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/Button/PrimaryButton";
import { TextInput } from "@/components/Input/TextInput";
import { isValidId, isValidPassword } from "@/app/utils/validators";
import { loginAction } from "@/app/actions/login.action";

export default function LoginForm() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidId(id))
      return alert("아이디는 영문+숫자 조합 2~8자여야 합니다.");
    if (!isValidPassword(password))
      return alert("비밀번호는 영문+숫자 포함 8~16자여야 합니다.");

    setLoading(true);
    try {
      const result = await loginAction(id, password);

      if (result?.isError) {
        alert(result?.message ?? "로그인 실패");
        return;
      }

      // 성공 처리(예: 토큰이 바디로 오면 저장 / 쿠키면 그냥 라우팅)
      // localStorage.setItem("accessToken", result.accessToken);

      alert("로그인 성공!");
      // router.push("/")
    } catch (err) {
      alert("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <TextInput
          id="id"
          label="아이디"
          placeholder="아이디."
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <TextInput
          id="password"
          label="비밀번호"
          placeholder="비밀번호."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PrimaryButton ignoreSize className="h-10 rounded-lg" type="submit">
          {loading ? "로그인 중..." : "로그인하기"}
        </PrimaryButton>
      </div>
    </form>
  );
}
