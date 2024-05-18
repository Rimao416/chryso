import React from "react";
import HomeHeader from "../../dashboard/HomeHeader";
import CourseCard from "@/components/ui/CourseCard";
// import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyCourses } from "@/slice/teacher/teacherSlice";

function Cours() {
  const dispatch = useDispatch();
  const { cours, loading } = useSelector((state) => state.academicTeacherSlice);
  useEffect(() => {
    dispatch(getMyCourses());
  }, []);
  return (
    <div className="space-y-5">
      <HomeHeader title="Cours" />
      <div className="grid lg:grid-cols-3 
      md:grid-cols-2 grid-cols-1 gap-6">
        {loading === false &&
          cours?.map((item) => (
            <CourseCard
              key={item._id}
              name={item.name}
              id={item.teacher.id}
              author={item.teacher.name + " " + item.teacher.lastname}
            />
          ))}
      </div>
    </div>
  );
}

export default Cours;
