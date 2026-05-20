"use client";

const GENDER_OPTIONS = [
  {
    label: "밝히고 싶지 않음",
    value: "none",
  },
  {
    label: "여성",
    value: "female",
  },
  {
    label: "남성",
    value: "male",
  },
];

export function ProfileGenderField() {
  return (
    <section>
      <label
        htmlFor="profile-gender"
        className="mb-2 block text-sm font-semibold text-near-black"
      >
        성별
      </label>

      <select
        id="profile-gender"
        name="gender"
        defaultValue="none"
        className="w-full rounded-lg border border-linen bg-white px-3 py-2 text-sm text-near-black outline-none transition-colors focus:border-near-black"
      >
        {GENDER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <p className="mt-2 text-xs text-cool-gray">
        이 정보는 공개 프로필에 표시되지 않습니다.
      </p>
    </section>
  );
}
