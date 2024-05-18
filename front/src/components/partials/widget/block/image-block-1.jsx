import React from "react";

import image1 from "@/assets/images/all-img/widget-bg-1.png";
const ImageBlock1 = () => {
  return (
    <div
      className="bg-no-repeat bg-cover bg-center p-4 rounded-[6px] relative"
      style={{
        backgroundImage: `url(${image1})`,
      }}
    >
      <div className="max-w-[169px]">
        <div className="text-xl font-medium text-slate-900 mb-2">
          Bienvenue
        </div>
      </div>
     
    </div>
  );
};

export default ImageBlock1;
