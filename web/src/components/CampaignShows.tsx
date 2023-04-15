import React from "react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

import Link from "next/link";

interface CampaignShowsInterface {
  campaign: string;
  amount: number;
}

export default function CampaignShows({
  campaign,
  amount,
}: CampaignShowsInterface) {
  return (
    <>
      <Link
        href={`/${campaign}`}
        className="border-1 py-4 rounded-full my-4  border-superfluid-100"
      >
        <div className="flex px-8">
          <div className="grid grid-cols-3 align-center  ">
            <div className="truncate justify-center">{campaign}</div>
            <div className="flex justify-center">
              <div className="font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                Active
              </div>
            </div>
            <div className="flex justify-center font-bold text-superfluid-100">
              {amount} USDCx
            </div>
          </div>
          <ChevronRightIcon
            className="h-8 w-8 text-superfluid-100"
            aria-hidden="true"
          />
        </div>
      </Link>
    </>
  );
}
