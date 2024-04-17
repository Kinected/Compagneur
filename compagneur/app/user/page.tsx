"use client";
import React from "react";
import Mauria from "@/components/containers/Mauria";
import Spotify from "@/components/containers/Spotify";
import Identity from "@/components/containers/User";
import Cookies from "js-cookie";
import Ilevia from "../../components/containers/Ilevia/bus";
import IleviaVlille from "@/components/containers/Ilevia/vlille";

const Page = () => {
  const id = Cookies.get("userID") as string;

  return (
    <div className={"flex flex-col gap-8 p-4 py-12 max-w-2xl"}>
      <Identity id={id} />
      <Spotify id={id} />
      <Mauria id={id} />
      <Ilevia id={id} />
      <IleviaVlille id={id} />
    </div>
  );
};

export default Page;
