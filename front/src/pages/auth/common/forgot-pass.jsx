import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { API } from "@/configs/config";

const schema = yup
  .object({
    identifier: yup.string().required("L'identifiant est requis"),
  })
  .required();
const ForgotPass = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    setLoading(true);
    API.post("/api/v1/users/forgotPassword", data)
      .then((response) => {
        toast.info(response.data.message)
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
        name="identifier"
        label="Adresse mail / Code"
        type="text"
        register={register}
        error={errors.identifier}
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
