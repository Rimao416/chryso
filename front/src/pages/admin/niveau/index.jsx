import React from "react";
import HomeHeader from "../../dashboard/HomeHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addClass, getClass } from "../../../slice/admin/classSlice";
import Datatables from "../../table/react-tables/Datatables";
import dayjs from "dayjs";
import { Menu } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import SelectForm from "../../forms/select/SelectForm";
import Dropdown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import Modal from "@/components/ui/Modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Dropdwon
function Niveau() {
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
      Header: "Nom",
      accessor: "name",
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
          // Logique à exécuter lorsque l'utilisateur clique sur un bouton d'action
          const { row: levelData } = row.cell;

          switch (actionName) {
            case "view":
              break;
            case "edit":
              // console.log(professorData)
              // const professorData = row.cell.row.original;

              navigate("/niveaux-edit/" + levelData.original._id);

              break;
            case "delete":
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
      name: "Editer",
      icon: "heroicons:pencil-square",
    },
    {
      name: "Supprimer",
      icon: "heroicons-outline:trash",
    },
  ];

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getClass());
  }, []);

  const { academicClass: niveaux, loading } = useSelector(
    (state) => state.classSlice
  );
  const [levels, setLevels] = useState({
    name: "Licence",
  });
  const handleSubmit = () => {
    try {
      dispatch(addClass(levels)).then((result) => {
        if (result.type === "academicClass/addClass/fulfilled") {
          toast.success("Niveau Ajouté avec succès");
        }
        // window.location.reload();
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-5">
      <HomeHeader title="Niveaux">
        <div className="flex sm:space-x-4 space-x-2 sm:justify-end items-center rtl:space-x-reverse">
          <Modal
            title="Niveau"
            label="Ajouter un niveau"
            labelClass="btn-outline-dark"
            uncontrol
            footerContent={
              <Button
                text="Accept"
                className="btn-dark "
                onClick={handleSubmit}
                isLoading={loading}
              />
            }
          >
            <div className="text-base text-slate-600 dark:text-slate-300">
              <div className=" space-xy-6">
                <div className="text-base text-slate-600 dark:text-slate-300">
                  <SelectForm
                    data={levels}
                    setData={setLevels}
                    header="name"
                    title="Choisissez votre niveau"
                    options={[
                      {
                        value: "Licence",
                        label: "Licence",
                      },
                      {
                        value: "Master",
                        label: "Master",
                      },
                      {
                        value: "Doctorat",
                        label: "Doctorat",
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </Modal>
          {/* <Button
            text="Ajouter un niveau"
            className="btn-primary"
            link="/niveaux-create"
          /> */}
        </div>
      </HomeHeader>

      {loading == false && (
        <Datatables title="Liste des niveaux" content={niveaux} col={COLUMNS} />
      )}
    </div>
  );
}

export default Niveau;
