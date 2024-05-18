import React from "react";
import Datatables from "../../table/react-tables/Datatables";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import HomeHeader from "../../dashboard/HomeHeader";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { assetsURL } from "../../../configs/config";
import { Menu } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import dayjs from "dayjs";
import {
  archiveStudent,
  fetchAcademicStudent,
} from "../../../slice/admin/studentSlice";
function Professeurs() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const COLUMNS = [
    {
      Header: "Id",
      accessor: (row, index) => index + 1,
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Nom",
      accessor: (row) => ({
        name: row.name,
        image: row.photo,
        lastname: row.lastname,
      }),
      Cell: (row) => {
        const { name, image, lastname } = row?.cell?.value || {};
        // console.log(row)
        return (
          <div>
            <span className="inline-flex items-center">
              <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600">
                <img
                  src={`${assetsURL}/img/users/${image}`}
                  alt=""
                  className="object-cover w-full h-full rounded-full"
                />
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
                {name + " " + lastname}
              </span>
            </span>
          </div>
        );
      },
    },

    {
      Header: "Mail",
      accessor: "email",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Date de création",
      accessor: "createdAt",
      Cell: (row) => {
        return <span>{dayjs(row?.cell?.value).format("DD/MM/YYYY")}</span>;
      },
    },

    {
      Header: "status",
      accessor: "status",
      Cell: (row) => {
        return (
          <span className="block w-full">
            <span
              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                row?.cell?.value === "Confirmé"
                  ? "text-success-500 bg-success-500"
                  : ""
              }
                ${
                  row?.cell?.value === "due"
                    ? "text-warning-500 bg-warning-500"
                    : ""
                }
                ${
                  row?.cell?.value === "Bloqué"
                    ? "text-danger-500 bg-danger-500"
                    : ""
                }
    
                 `}
            >
              {row?.cell?.value}
            </span>
          </span>
        );
      },
    },
    {
      Header: "action",
      accessor: "action",
      Cell: (row) => {
        const handleActionClick = (actionName) => {
          console.log(row);
          const { row: professorData } = row.cell;
          console.log(actionName);
          // Logique à exécuter lorsque l'utilisateur clique sur un bouton d'action
          switch (actionName) {
            case "view":
              // console.log(professorData)
              // const professorData = row.cell.row.original;
              console.log(
                "Donnéeees du professeur :",
                professorData.original._id
              );
              navigate("/students-view/" + professorData.original._id);

              break;
            case "edit":
              navigate("/students-edit/" + professorData.original._id);
              break;
            case "archiver":
              if (
                window.confirm(
                  "Etes-vous sûr de vouloir archiver cet étudiant ?"
                )
              ) {
                dispatch(archiveStudent(professorData.original._id)).then(
                  (res) => {
                    console.log(res);
                  }
                );
              }
              break;
            default:
              console.log("Action inconnue");
          }
        };
        return (
          <div>
            <Dropdown
              classMenuItems="right-0 w-[140px] top-[110%] "
              label={
                <span className="text-xl text-center block w-full">
                  <Icon icon="heroicons-outline:dots-vertical" />
                </span>
              }
            >
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {actions.map((item, i) => (
                  <Menu.Item key={i}>
                    <div
                      className={`
      
                        ${
                          item.name === "delete"
                            ? "bg-danger-500 text-danger-500 bg-opacity-30   hover:bg-opacity-100 hover:text-white"
                            : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"
                        }
                         w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer
                         first:rounded-t last:rounded-b flex  space-x-2 items-center rtl:space-x-reverse `}
                      onClick={() => handleActionClick(item.name)}
                    >
                      <span className="text-base">
                        <Icon icon={item.icon} />
                      </span>
                      <span>{item.name}</span>
                    </div>
                  </Menu.Item>
                ))}
              </div>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const actions = [
    {
      name: "view",
      icon: "heroicons-outline:eye",
    },
    {
      name: "edit",
      icon: "heroicons:pencil-square",
    },
    {
      name: "archiver",
      icon: "heroicons-outline:trash",
    },
  ];

  useEffect(() => {
    dispatch(fetchAcademicStudent());
  }, []);
  const { academicStudents: students, loading } = useSelector(
    (state) => state.academicStudentSlice
  );
  // const { academicStudents: students, loading } = useSelector(
  //   (state) => state.studentSclice
  // );
  return (
    <div className="space-y-5">
      <HomeHeader title="Etudiants">
        <div className="flex sm:space-x-4 space-x-2 sm:justify-end items-center rtl:space-x-reverse">
          <Button
            text="Ajouter un étudiant"
            className="btn-primary"
            link="/students-create"
          />
        </div>
      </HomeHeader>

      {loading == false && (
        <Datatables
          title="Liste des étudiants"
          content={students}
          col={COLUMNS}
        />
      )}
    </div>
  );
}

export default Professeurs;
