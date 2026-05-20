"use client";

import { TextInput } from "@/shared/ui/input/TextInput";

export function ProfileLinkField() {
  return (
    <section>
      <label
        htmlFor="profile-link"
        className="mb-2 block text-sm font-semibold text-near-black"
      >
        링크
      </label>

      <TextInput
        id="profile-link"
        name="link"
        placeholder="웹사이트 또는 SNS 링크를 입력하세요"
      />

      <p className="mt-2 text-xs text-cool-gray">
        프로필에 표시할 외부 링크를 입력할 수 있습니다.
      </p>
    </section>
  );
}
