"use client";

import { UserButton } from "@clerk/nextjs";
import { ChartColumnBigIcon } from "lucide-react";
import { useRouter } from "next/navigation";

function UserDropDown() {
  let router = useRouter();
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
      >
        <UserButton.MenuItems>
          <UserButton.Action
            label="Dashboard"
            labelIcon={<ChartColumnBigIcon size="16" />}
            onClick={() => {
              router.push("/dashboard");
            }}
          />
        </UserButton.MenuItems>
      </UserButton>
    </div>
  );
}

export default UserDropDown;
