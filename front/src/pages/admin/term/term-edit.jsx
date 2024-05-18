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
import { updateClass } from "../../../slice/admin/classSlice";
import * as yup from "yup";
import { getSingleTerm, updateTerm } from "../../../slice/admin/termSlice";
function TermEdit() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState(null);

  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    try {
      dispatch(getSingleTerm(id)).then((res) => {
        setCredentials(res.payload.data);
        if (res.error?.message === "Rejected") {
          toast.error("Cette période n'existe pas");
          navigate("/periodes");
        }
      });
    } catch (error) {
      navigate("/periodes");

      toast.error("Cette période n'existe pas");
    }
  }, [id]);
  const { loading } = useSelector((state) => state.termSlice);
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
  };
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await dispatch(updateTerm(credentials));
      if (response.error) {
        toast.error(response.error.message);
        return;
      } else if (response.type === "academicTerms/updateTerms/fulfilled") {
        toast.success("Période modifiée avec succès");
        navigate("/periodes");
      }
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
      <div className="xl:col-span-2 col-span-1">
        <Card title="Modifier une période">
          <MultiValidation
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            loading={loading}
            title="Modifier"
          >
            <Textinput
              name="name"
              label="Période"
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

export default TermEdit;
