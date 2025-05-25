"use client";

import { UserButton } from "@clerk/nextjs";

function UserDropDown() {
  return (
    <div>
      <UserButton
        showName
        appearance={{
          elements: {
            userButtonOuterIdentifier: {
              color: "#fff",
            },
          },
        }}
      />
    </div>
  );
}

export default UserDropDown;
