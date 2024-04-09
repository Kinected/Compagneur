import React from "react";
import Pcomponent from "@/components/containers/Pcomponent";

export default function Home() {
  return (
    <div>
      <div className="w-full h-full flex flex-col items-center justify-center gap-10">
        <h1 className="flex color-white text-2xl">Dashboard</h1>


    
        <Pcomponent />
      </div>
    </div>
  );
}
