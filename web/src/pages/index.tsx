import React from "react";
import CampaignForm from "@/components/CampaignForm";
import { Profile } from "@/components/Profile";

import Image from "next/image";
import Logo from "../../public/Iso.svg";

export default function Home() {
  return (
    <div className="bg-[url('../../public/bg1.jpg')] h-screen bg-no-repeat bg-center bg-cover pt-4 overflow-auto">
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
      <div className="flex justify-center flex-col mb-10">
        <div className="h-container w-container rounded-3xl bg-white mx-auto">
          <div className="flex justify-center mt-6 flex-col">
            <h2 className="text-2xl mx-auto my-2 text-superfluid-100 leading-8 font-bold">
              Set up your campaign
            </h2>
            <CampaignForm />
          </div>
        </div>
      </div>
    </div>
  );
}
