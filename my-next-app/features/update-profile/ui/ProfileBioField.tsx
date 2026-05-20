"use client";

export function ProfileBioField() {
  return (
    <section>
      <label
        htmlFor="profile-bio"
        className="mb-2 block text-sm font-semibold text-near-black"
      >
        소개
      </label>

      <textarea
        id="profile-bio"
        name="bio"
        maxLength={150}
        placeholder="자신을 간단히 소개해보세요"
        className="min-h-24 w-full resize-none rounded-lg border border-linen bg-white px-3 py-2 text-sm text-near-black outline-none transition-colors placeholder:text-cool-gray focus:border-near-black"
      />

      <div className="mt-2 flex justify-between text-xs text-cool-gray">
        <span>최대 150자까지 입력할 수 있습니다.</span>
        <span>0 / 150</span>
      </div>
    </section>
  );
}
