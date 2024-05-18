import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/components/ui/Card";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import Checkbox from "@/components/ui/Checkbox";
import Button from "../../../components/ui/Button";

import { getSingleAcademic, updateAcademicYears } from "../../../slice/admin/academicYearSlice";
function AcademicEdit() {
  const { loading } = useSelector((state) => state.academicYearSlice);
  const [credentials, setCredentials] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    try {
      dispatch(getSingleAcademic(id)).then((res) => {
        console.log(res);
        setCredentials(res.payload.data);
        if (res.payload.data.isCurrent) {
          toast.info(
            "Impossible de terminer cette année académique car elle est actuellement en cours. Veuillez d'abord mettre à jour une autre année académique comme année en cours avant de la terminer."
          );
        }

        if (res.error?.message === "Rejected") {
          toast.error("Cette année académique n'existe pas");
          navigate("/academic-year");
        }
      });
    } catch (error) {
      console.log(error);
      navigate("/academic-year");

      toast.error("Cette année académique n'existe pas");
      navigate("/academic-year");
    }
  }, [id]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const reponse = await dispatch(updateAcademicYears(credentials));
    console.log(reponse);
    if (reponse.error) {
      toast.error(reponse.error.message);
    } else {
      toast.success("Anneée éditee avec succès");
      navigate("/academic-year");
    }
    console.log(credentials);
    console.log("Envoyé");
  };
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
        <div className="xl:col-span-2 col-span-1">
          <Card title="Modifier l'annee académique">
            <form
              className="lg:grid-cols-2 grid gap-5 grid-cols-1"
              onSubmit={handleSubmit}
            >
              <div>
                <label htmlFor="default-picker" className=" form-label">
                  Entrez le premier jour de l'année académique
                </label>
                <Flatpickr
                  className="form-control py-2"
                  value={credentials?.fromYear}
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
              <div>
                <label htmlFor="default-picker" className=" form-label">
                  Entrez le dernier jour de l'année académique
                </label>
                <Flatpickr
                  className="form-control py-2"
                  value={credentials?.toYear}
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
              {!credentials?.isCurrent && (
                <Checkbox
                  label="Définir comme en cours"
                  value={credentials?.isCurrent}
                  activeClass="ring-primary-500 bg-primary-500"
                  onChange={() =>
                    setCredentials({
                      ...credentials,
                      isCurrent: !credentials.isCurrent,
                    })
                  }
                />
              )}
              <div className="lg:col-span-2 col-span-1">
                <div className="ltr:text-right rtl:text-left">
                  <Button
                    className="btn btn-dark text-center"
                    type="submit"
                    isLoading={loading}
                  >
                    Enregistrer
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AcademicEdit;
