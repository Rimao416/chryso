import React, { useState } from "react";
import Card from "@/components/ui/Card";
// import { useDispatch, useSelector } from "react-redux";
import InputGroup from "@/components/ui/InputGroup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Textinput from "@/components/ui/Textinput";
import * as yup from "yup";
import { toast } from "react-toastify";
import Button from "../../../components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  addAcademicPrograms,
  getSingleProgram,
  updateAcademicPrograms,
} from "../../../slice/admin/programSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { removeEmptyProperties } from "../../utility/utils";
function ProgrammAddPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const [status, setStatus] = useState("");
  const [dataProgram, setData] = useState(null);
  //   let status = "";
  useEffect(() => {
    if (location.pathname.startsWith("/programmes-create")) {
      //   status = "create";
      setStatus("create");
    } else if (location.pathname.startsWith("/programmes-edit")) {
      //   status = "edit";

      setStatus("edit");
      id &&
        dispatch(getSingleProgram(id)).then((res) => {
          setData(res.payload.data);
          const { name, duration, _id } = res.payload.data;
          const durationNumber = parseInt(duration.match(/\d+/)[0], 10);
          setData({
            _id: _id,
            name: name,
            duration: durationNumber,
          });
          //   setValue("name", name);
          //   setValue("duration", duration);
        });
    }
  }, [location, id]);

  const { academicProgram: program, loading } = useSelector(
    (state) => state.programSlice
  );

  const navigate = useNavigate();
  let FormValidationSchema = null;
  if (status === "create") {
    FormValidationSchema = yup.object({
      name: yup.string().required("Le nom est requis"),
      duration: yup.string().required("La durée est requise"),
    });
  } else if (status === "edit") {
    FormValidationSchema = yup.object({
      name: yup.string(),
      duration: yup.string(),
    });
  }
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
  });

  const onSubmit = (data) => {
    dispatch(addAcademicPrograms(data)).then((res) => {
      if (res.type == "academicPrograms/addAcademicPrograms/fulfilled") {
        navigate("/programmes");
        // toast.success("Programme ajouté avec succès");
      } else {
        toast.error("Une erreur est survenue");
      }
    });
  };
  const handleChange = (e) => {
    setData({ ...dataProgram, [e.target.name]: e.target.value });
  };
  const handleEdit = async (event) => {
    event.preventDefault();
    // console.log(dataProgram);
    let dataRemove = removeEmptyProperties(dataProgram);
    dataRemove = { ...dataRemove, duration: dataRemove.duration + " ans" };
    console.log(dataRemove);
    try {
      const response = await dispatch(updateAcademicPrograms(dataRemove));

      console.log(response);
      if (
        response.type == "academicPrograms/updateAcademicPrograms/fulfilled"
      ) {
        toast.success("Programme modifié avec succès");
        navigate("/programmes");
      }
    } catch (error) {
      console.log(error);
      toast.error("Une erreur s'est produite");
    }
  };

  //   const handleSubmit = (event) => {
  //     event.preventDefault();
  //     console.log("Salut");
  //   };
  return (
    <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
      <div className="xl:col-span-2 col-span-1">
        <Card
          title={
            status === "create"
              ? "Création"
              : "Modification" + " d'un programme"
          }
        >
          <form
            onSubmit={status === "create" ? handleSubmit(onSubmit) : handleEdit}
            className="lg:grid-cols-2 grid gap-5 grid-cols-1 "
          >
            <Textinput
              name="name"
              label="Nom"
              type="text"
              register={register}
              error={errors.name}
              defaultValue={dataProgram?.name}
              onChange={handleChange}
            />
            <InputGroup
              label="Durée"
              type="number"
              prepend="ANS"
              placeholder="3"
              name="duration"
              defaultValue={dataProgram?.duration}
              error={errors.duration}
              onChange={handleChange}
              register={register}
            />
            <div className="lg:col-span-2 col-span-1">
              <div className="ltr:text-right rtl:text-left">
                <Button
                  className="btn btn-dark text-center"
                  type="submit"
                  isLoading={loading}
                >
                  {status === "create" ? "Enregistrer" : "Modifier"}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default ProgrammAddPage;
