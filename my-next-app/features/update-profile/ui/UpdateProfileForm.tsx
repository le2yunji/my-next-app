"use client";

import { ProfileImageField } from "./ProfileImageField";
import { ProfileLinkField } from "./ProfileLinkField";
import { ProfileBioField } from "./ProfileBioField";
import { ProfileGenderField } from "./ProfileGenderField";
import { PrimaryButton } from "@/shared/ui/button/PrimaryButton";

export function UpdateProfileForm() {
  return (
    <form className="space-y-6">
      <ProfileImageField />
      <ProfileLinkField />
      <ProfileBioField />
      <ProfileGenderField />
      <PrimaryButton>저장하기</PrimaryButton>
    </form>
  );
}
