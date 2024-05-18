import React, { useState } from "react";
import Card from "@/components/ui/Card";
import MultiValidation from "../../forms/validation";
// import MultiValidation from "./multiple-rules";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Textinput from "@/components/ui/Textinput";

import { useParams, useNavigate } from "react-router-dom";
import { getSingleClass, updateClass } from "../../../slice/admin/classSlice";
import * as yup from "yup";
function NiveauEdit() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState(null);

  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    try {
      dispatch(getSingleClass(id)).then((res) => {
        console.log(res);
        setCredentials(res.payload.data);
        if (res.error?.message === "Rejected") {
          toast.error("Cette classe n'existe pas");
          navigate("/niveaux");
        }
      });
    } catch (error) {
      console.log(error);
      navigate("/niveaux");

      toast.error("Cette classe n'existe pas");
    }
  }, [id]);
  const { loading } = useSelector((state) => state.classSlice);
  //   console.log(niveau);
  //   VALIDATION FORM
  const FormValidationSchema = yup.object({
    name: yup.string().required("Le nom est requis"),
  });
  const {
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
  });
  const onSubmit = (data) => {
    console.log(data);
    console.log("Envoyé");
  };
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(credentials);
    try {
      const response = await dispatch(updateClass(credentials));
      console.log(response);
      if (response.error) {
        toast.error(response.error.message);
        return;
      } else if (response.type === "academicClass/updateClass/fulfilled") {
        toast.success("Niveau modifié avec succès");
        navigate("/niveaux");
      }
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
      <div className="xl:col-span-2 col-span-1">
        <Card title="Modifier un niveau">
          <MultiValidation
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            loading={loading}
            title="Modifier"
          >
            <Textinput
              name="name"
              label="Classe"
              type="text"
              onChange={handleChange}
              defaultValue={credentials?.name}
              value={credentials?.name}
              register={register}
              error={errors.name}
            />
          
          </MultiValidation>
        </Card>
      </div>{" "}
    </div>
  );
}

export default NiveauEdit;
