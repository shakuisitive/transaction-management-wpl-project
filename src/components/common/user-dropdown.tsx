"use client";

import { UserButton } from "@clerk/nextjs";
import { ChartColumnBigIcon, Wallet, HandCoins } from "lucide-react";
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
