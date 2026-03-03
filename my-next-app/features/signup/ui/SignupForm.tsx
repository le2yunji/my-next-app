"use client";

import { useState } from "react";

import { isValidId, isValidPassword } from "@/app/utils/validators";
import { signupAction } from "@/app/actions/signup.action";
import { useRouter } from "next/navigation";
import { TextInput } from "@/components/Input/TextInput";
import { PrimaryButton } from "@/components/Button/PrimaryButton";

const SignupForm = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 유효성 검사
    if (!isValidId(id)) {
      alert("아이디는 영문+숫자 조합 2~8자여야 합니다.");
      return;
    }

    if (!isValidPassword(password)) {
      alert("비밀번호는 영문+숫자 포함 8~16자여야 합니다.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      const result = await signupAction(id, password);

      if (result?.isError) {
        alert(result.message ?? "회원가입 실패");
        return;
      }

      alert("회원가입 성공!");
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("회원가입 중 오류가 발생했습니다.");
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
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <TextInput
          id="password"
          label="비밀번호"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextInput
          id="passwordConfirm"
          label="비밀번호 확인"
          placeholder="비밀번호 확인"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <PrimaryButton ignoreSize className="h-10 rounded-lg" type="submit">
          회원가입 하기
        </PrimaryButton>
      </div>
    </form>
  );
};

export default SignupForm;
