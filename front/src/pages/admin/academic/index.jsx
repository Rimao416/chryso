import React from "react";
import HomeHeader from "../../dashboard/HomeHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Flatpickr from "react-flatpickr";
import Checkbox from "@/components/ui/Checkbox";
import Datatables from "../../table/react-tables/Datatables";
import dayjs from "dayjs";
import { Menu } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import Modal from "@/components/ui/Modal";
import { useState } from "react";
import Card from "@/components/ui/Card";
import { useNavigate } from "react-router-dom";
import {
  addAcademicYear,
  getAcademicYears,
} from "../../../slice/admin/academicYearSlice";
function Academic() {
  const { academicYear, loading } = useSelector(
    (state) => state.academicYearSlice
  );
  useEffect(() => {
    dispatch(getAcademicYears());
  }, []);
  console.log(academicYear);
  const dispatch = useDispatch();
  const [picker, setPicker] = useState(new Date());
  const [credentials, setCredentials] = useState({
    fromYear: new Date(),
    toYear: new Date(),
    isCurrent: true,
  });
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
      Header: "Statut",
      accessor: "isCurrent",
      Cell: (row) => {
        console.log(row?.cell?.value);
        return (
          <span className="block w-full">
            <span
              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                row?.cell?.value === true
                  ? "text-success-500 bg-success-500"
                  : ""
              } 
         
          ${row?.cell?.value === false ? "text-danger-500 bg-danger-500" : ""}
          
           `}
            >
              {row?.cell?.value ? "En cours" : "Terminé"}
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
          console.log(actionName)
          // Logique à exécuter lorsque l'utilisateur clique sur un bouton d'action
          const { row: academicData } = row.cell;

          switch (actionName) {
            case "Voir":
              break;
            case "Editer":
              // console.log(professorData)
              // const professorData = row.cell.row.original;

              navigate("/academic-year-edit/" + academicData.original._id);

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
  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await dispatch(addAcademicYear(credentials));
    console.log(response);
    if (response.type == "academicYear/addAcademicYear/fulfilled") {
      toast.success("Anneée académique ajoutée avec succès");
    } else {
      toast.error(response.error.message);
    }
  };

  return (
    <div className="space-y-5">
      <HomeHeader title="Années académiques">
        <div className="flex sm:space-x-4 space-x-2 sm:justify-end items-center rtl:space-x-reverse">
          <Modal
            title="Année académique"
            label="Ajouter une année académique"
            labelClass="btn-outline-dark"
            uncontrol
            footerContent={
              <Button
                text="Accept"
                className="btn-dark "
                onClick={handleSubmit}
                isLoading={false}
              />
            }
          >
            <div className="text-base text-slate-600 dark:text-slate-300">
              <div className=" space-xy-6">
                <div className="text-base text-slate-600 dark:text-slate-300">
                  <div>
                    <label htmlFor="default-picker" className=" form-label">
                      Entrez le premier jour de l'année académique
                    </label>

                    <Flatpickr
                      className="form-control py-2"
                      value={credentials.fromYear}
                      options={{
                        dateFormat: "Y-m-d", // Utilisez le format "Y" pour afficher seulement l'année
                        mode: "single", // Utilisez le mode "single" pour sélectionner une seule date
                      }}
                      onChange={(date) =>
                        setCredentials({ ...credentials, fromYear: date })
                      }
                      id="default-picker"
                    />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="default-picker" className=" form-label">
                      Entrez le dernier jour de l'année académique
                    </label>

                    <Flatpickr
                      className="form-control py-2"
                      value={credentials.toYear}
                      options={{
                        dateFormat: "Y-m-d", // Utilisez le format "Y" pour afficher seulement l'année
                        mode: "single", // Utilisez le mode "single" pour sélectionner une seule date
                      }}
                      onChange={(date) =>
                        setCredentials({ ...credentials, toYear: date })
                      }
                      id="default-picker"
                    />
                  </div>
                  <Checkbox
                    label="Définir comme en cours"
                    value={credentials.isCurrent}
                    activeClass="ring-primary-500 bg-primary-500"
                    onChange={() =>
                      setCredentials({
                        ...credentials,
                        isCurrent: !credentials.isCurrent,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </HomeHeader>
      {loading == false && (
        <Datatables
          title="Liste des programmes"
          content={academicYear}
          col={COLUMNS}
        />
      )}
    </div>
  );
}

export default Academic;
