import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { API } from "@/configs/config";
import { useNavigate } from "react-router-dom";
const FormValidationSchema = yup
  .object({
    password: yup.string().required("Le mot de passe est requis"),
    passwordConfirm: yup
      .string()
      .required("Re-tapez le mot de passe")
      .oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas"),
  })
  .required();
const ForgotPass = ({ token }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
  });

  const onSubmit = (data) => {
    setLoading(true);
    console.log(data);
    API.patch("/api/v1/users/resetPassword/" + token, data)
      .then((response) => {
        console.log(response);
        // toast.success("Mot de passe mis à jour, vous pouvez vous connecter");
        // navigate("/");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
        setLoading(false);
        // Vous pouvez ajouter ici un traitement spécifique pour les erreurs de requête
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput
        name="password"
        label="password"
        type="password"
        register={register}
        error={errors.password}
      />
      <Textinput
        name="passwordConfirm"
        label="Re-tapez le mot de passe"
        type="password"
        register={register}
        error={errors.passwordConfirm}
      />
      <Button
        className="btn btn-dark block w-full text-center"
        type="submit"
        isLoading={loading}
      >
        Envoyer
      </Button>
      {/* <button className="btn btn-dark block w-full text-center" type="submit">
        Envoyer
      </button> */}
    </form>
  );
};

export default ForgotPass;
