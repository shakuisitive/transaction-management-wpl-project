"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { ChartColumnBigIcon, Wallet, HandCoins } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserFromDatabase } from "@/actions/user";

function UserDropDown() {
  let router = useRouter();
  const { user: clerkUser } = useUser();
  const [dbUser, setDbUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (clerkUser?.id) {
        const user = await getUserFromDatabase(clerkUser.id);
        setDbUser(user);
      }
    };
    fetchUser();
  }, [clerkUser]);

  const displayName = dbUser?.firstName || clerkUser?.firstName || "";
  const displayLastName = dbUser?.lastName || clerkUser?.lastName || "";

  const fullName = `${displayName} ${displayLastName}`.trim();

  return (
    <div className="flex items-center gap-2">
      {fullName && <span className="text-white text-sm font-medium">{fullName}</span>}
      <UserButton
        showName={false}
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
            label="View All Transactions"
            labelIcon={<Wallet size="16" />}
            onClick={() => {
              router.push("/dashboard/transactions");
            }}
          />
        </UserButton.MenuItems>

        <UserButton.MenuItems>
          <UserButton.Action
            label="Create A New Transaction"
            labelIcon={<HandCoins size="16" />}
            onClick={() => {
              router.push("/dashboard/transactions/new");
            }}
          />
        </UserButton.MenuItems>
      </UserButton>
    </div>
  );
}

export default UserDropDown;
