"use client";

import { useState } from "react";
import { EditProfileModal, type UserData } from "@/components/modals/profile/edit-profile-modal";

export function EditProfileTrigger({
  user,
  children,
}: {
  user: UserData;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="inline-flex w-full cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {children}
      </div>
      <EditProfileModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        user={user}
      />
    </>
  );
}
