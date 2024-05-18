import React from "react";
import useSkin from "@/hooks/useSkin";
import { Link } from "react-router-dom";
// import Icon from "@/components/ui/Icon";
import { useSelector } from "react-redux";
const CourseCard = ({
  title,
  subtitle,
  headerslot,
  className = "custom-class",
  bodyClass = "p-6",
  noborder,
  titleClass = "custom-class",
  name,
  id,
  author,
}) => {
  const isAuthenticated = useSelector((state) => state.authSlice.user?.user);

  const getInitialLetter = (name) => {
    // Divise la chaîne en mots
    const words = name.split(" ");

    // Récupère les deux premiers mots
    const firstTwoWords = words.slice(0, 2);

    // Récupère la première lettre de chaque mot
    const initials = firstTwoWords.map((word) => word.charAt(0).toUpperCase());

    // Rejoint les lettres pour former les initiales
    return initials.join("");
  };
  const [skin] = useSkin();

  return (
    <div
      className={`
        card rounded-md bg-white dark:bg-slate-800   ${
          skin === "bordered"
            ? " border border-slate-200 dark:border-slate-700"
            : "shadow-base"
        }
   
    ${className}
        `}
    >
      <main className={`card-body ${bodyClass}`}>
        {" "}
        <Link to={`/mes-cours/${id}`}>
          <div className="space-y-6">
            <div className="flex space-x-3 items-center rtl:space-x-reverse">
              <div className="flex-none h-10 w-10 rounded-full bg-slate-800 dark:bg-slate-700 text-slate-300 flex flex-col items-center justify-center text-lg">
                <span className="text-xs font-bold">
                  {getInitialLetter(name)}
                </span>
              </div>
              <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
                {name}
              </div>
            </div>
            <div className="text-slate-600 dark:text-slate-300 text-sm">
              Enseignant : {isAuthenticated?._id === id ? "(Vous)" : author}
            </div>
          </div>
        </Link>
      </main>
    </div>
  );
};

export default CourseCard;
