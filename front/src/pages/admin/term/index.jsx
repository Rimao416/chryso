import React from "react";
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
import { addTerms, getTerms } from "../../../slice/admin/termSlice";
function Periodes() {
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
      Header: "Nom de la période",
      accessor: "name",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },

    {
      Header: "action",
      accessor: "action",
      Cell: (row) => {
        const handleActionClick = (actionName) => {
          console.log(actionName);
          const { row: periodes } = row.cell;
          // Logique à exécuter lorsque l'utilisateur clique sur un bouton d'action
          switch (actionName) {
            case "Voir":
              // console.log(periodes)
              // const periodes = row.cell.row.original;
              console.log("Donnéeees du professeur :", periodes.original._id);
              navigate("/professeurs-view/" + periodes.original._id);

              break;
            case "Modifier":
              //   console.log("Bonsoir");
              navigate("/periodes-edit/" + periodes.original._id);
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
    dispatch(getTerms());
  }, []);
  const { academicTerm: periodes, loading } = useSelector(
    (state) => state.termSlice
  );
  const handleSubmit = async () => {
    try {
      const response = await dispatch(addTerms());
      console.log(response);
    } catch (error) {}
  };
  return (
    <div className="space-y-5">
      <HomeHeader title="Périodes Académiques">
        <div className="flex sm:space-x-4 space-x-2 sm:justify-end items-center rtl:space-x-reverse">
          <Button
            text="Ajouter une periode"
            className="btn-primary"
            // link="/programmes-create"
            onClick={handleSubmit}
            isLoading={loading}
          />
        </div>
      </HomeHeader>

      {loading == false && (
        <Datatables
          title="Liste des périodes"
          content={periodes}
          col={COLUMNS}
        />
      )}
    </div>
  );
}

export default Periodes;
