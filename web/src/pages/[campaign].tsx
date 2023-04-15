import React from "react";
import { useRouter } from "next/router";

import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/Iso.svg";

import { ChevronLeftIcon } from "@heroicons/react/20/solid";

import { Profile } from "@/components/Profile";

function CampaignDetails() {
  const { query } = useRouter();
  let amount = 500;
  return (
    <div className="bg-[url('../../public/bg1.jpg')] h-screen bg-no-repeat bg-center bg-cover pt-10 overflow-auto">
      <div className="flex pb-10 pt-20 relative ">
        <h1 className="text-4xl text-superfluid-100 flex font-bold tracking-wider absolute inset-0 w-screen">
          <div className="m-auto flex items-center">
            <Image
              priority
              src={Logo}
              height={64}
              width={70}
              alt="Fluid sense logo"
              className="mx-4"
            />
            FluidSense
          </div>
        </h1>
        <Profile />
      </div>
      <div className="flex justify-center flex-col">
        <div className="h-containerDetails w-container rounded-3xl bg-white mx-auto">
          <div className="flex justify-center mt-10 flex-col">
            <div className="flex">
              <Link href="/">
                <ChevronLeftIcon
                  className="h-10 w-10 text-superfluid-100"
                  aria-hidden="true"
                />
              </Link>
              <h2 className="text-2xl mx-auto my-2 text-superfluid-100 leading-8 font-bold">
                Your campaign
              </h2>
            </div>
            <div className="flex px-10 my-8 mx-auto flex-col">
              <div>
                <span className="font-bold">Campaign Address: </span>
                {query.campaign}
              </div>
              <div>{amount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignDetails;
