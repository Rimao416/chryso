import React from "react";
// import Icon from "@/components/ui/Icon";
// import dayjs from "dayjs";

// import Datepicker from "react-tailwindcss-datepicker";
// import Button from "../components/ui/Button";
const HomeHeader = ({ title, children }) => {
  //   const [value, setValue] = useState({
  //     startDate: new Date(),
  //     endDate: new Date().setMonth(11),
  //   });

  return (
    <div className="flex justify-between flex-wrap items-center mb-6">
      <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
        {title}
      </h4>
      {children}
    </div>
  );
};

export default HomeHeader;
