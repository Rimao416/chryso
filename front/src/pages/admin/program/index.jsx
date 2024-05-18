import React from "react";
import HomeBredCurbs from "../../dashboard/HomeBredCurbs";
// import Card from "../../../components/ui/Card";
// import BasicArea from "../../chart/appex-chart/BasicArea";
// import ExamapleOne from "../../table/react-tables/ExampleOne";
import Datatables from "../../table/react-tables/Datatables";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import HomeHeader from "../../dashboard/HomeHeader";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
// import { assetsURL } from "../../../configs/config";
import { Menu } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import dayjs from "dayjs";
import { fetchAcademicPrograms } from "../../../slice/admin/programSlice";
function Programmes() {
  const navigate = useNavigate();
  const COLUMNS = [
    {
      Header: "Id",
      accessor: (row, index) => index + 1,
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Nom du programme",
      accessor: "name",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Durée",
      accessor: "duration",
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
      Header: "action",
      accessor: "action",
      Cell: (row) => {
        const handleActionClick = (actionName) => {
          console.log(actionName);
          const { row: programs } = row.cell;
          // Logique à exécuter lorsque l'utilisateur clique sur un bouton d'action
          switch (actionName) {
            case "Voir":
              // console.log(programs)
              // const programs = row.cell.row.original;
              console.log("Donnéeees du professeur :", programs.original._id);
              navigate("/professeurs-view/" + programs.original._id);

              break;
            case "Modifier":
              //   console.log("Bonsoir");
              navigate("/programmes-edit/" + programs.original._id);
              break;
            case "Supprimer":
              console.log("Au revoir");
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
      name: "Voir",
      icon: "heroicons-outline:eye",
    },
    {
      name: "Modifier",
      icon: "heroicons:pencil-square",
    },
    {
      name: "Supprimer",
      icon: "heroicons-outline:trash",
    },
  ];

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAcademicPrograms());
  }, []);
  const { academicProgram: programs, loading } = useSelector(
    (state) => state.programSlice
  );
  return (
    <div className="space-y-5">
      <HomeHeader title="Programmes">
        <div className="flex sm:space-x-4 space-x-2 sm:justify-end items-center rtl:space-x-reverse">
          <Button
            text="Ajouter un programme"
            className="btn-primary"
            link="/programmes-create"
          />
        </div>
      </HomeHeader>

      {loading == false && (
        <Datatables
          title="Liste des programmes"
          content={programs}
          col={COLUMNS}
        />
      )}
    </div>
  );
}

export default Programmes;
