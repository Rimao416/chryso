import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import InputGroup from "@/components/ui/InputGroup";
// import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SelectForm from "../select/SelectForm";
import DropZoneFile from "../file-input/DropZoneFile";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addAcademicTeacher } from "../../../slice/admin/teacherSlice";

const steps = [
  {
    id: 1,
    title: "Détails du compte",
  },
  {
    id: 2,
    title: "Informations uniques",
  },
  {
    id: 3,
    title: "Media",
  },
];

let stepSchema = yup.object().shape({
  name: yup.string().required("Le nom est requis"),
  lastname: yup.string().required("Le prenom est requis"),
  adresse: yup.string().required("L'adresse est requise"),
  birthday: yup
    .date()
    .transform((originalValue, originalObject) => {
      console.log(originalValue);
      console.log(originalObject);
      // Utilisez la transformation pour gérer la conversion de la date
      return originalObject ? new Date(originalObject) : null;
    })
    .nullable(true)
    .required("La date de naissance est requise"),
  // .matches(/^[0-9]{12}$/, "Phone number is not valid"),
});

let personalSchema = yup.object().shape({
  email: yup
    .string()
    .email("L'email n'est pas valide")
    .required("L'email est requis"),
  phoneNumber: yup
    .string()
    .required("Le numéro de téléphone est requis")
    .matches(/^[0-9]{1,12}$/, "Entrez un numéro valide"),
  idNumber: yup.string().required("L'identifiant est requis"),
});
// let addressSchema = yup.object().shape({
//   address: yup.string(),
// });

const FormWizard = ({ title }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [teacher, setTeacher] = useState({
    photo: "",
    sexe: "Homme",
  });

  const [stepNumber, setStepNumber] = useState(0);
  const { loading } = useSelector((state) => state.teacherSlice);

  // find current stepschema
  let currentStepSchema;
  switch (stepNumber) {
    case 0:
      currentStepSchema = stepSchema;
      break;
    case 1:
      currentStepSchema = personalSchema;
      break;
    // case 2:
    //   currentStepSchema = addressSchema;
    //   break;

    default:
      currentStepSchema = stepSchema;
  }
  useEffect(() => {
    // console.log("step number changed");
  }, [stepNumber]);

  const {
    register,
    formState: { errors },
    handleSubmit,

    watch,
  } = useForm({
    resolver: yupResolver(currentStepSchema),
    // keep watch on all fields
    mode: "all",
  });
  //   const handleSubmit=(event)=>{
  //     event.preventDefault()
  //     console.log(teacher)
  //     console.log(teacher)
  //   }

  const onSubmit = (data) => {
    // next step until last step . if last step then submit form
    let totalSteps = steps.length;
    const isLastStep = stepNumber === totalSteps - 1;
    if (isLastStep) {
      console.log(data);
      console.log(teacher);
      const sendData = { ...data, photo: teacher.photo };
      console.log(sendData);
      //   CREATE FORM DATA
      const formData = new FormData();
      formData.append("name", sendData.name);
      formData.append("lastname", sendData.lastname);
      formData.append("birthday", sendData.birthday);
      formData.append("email", sendData.email);
      formData.append("phoneNumber", sendData.phoneNumber);
      //   formData.append("idNumber", sendData.idNumber);
      formData.append("address", sendData.address);
      formData.append("photo", sendData.photo);
      formData.append("sexe", teacher.sexe);
      //   SEND DATA
      dispatch(addAcademicTeacher(formData))
        .then(() => {
          // Code à exécuter après la réussite de l'action
          //   console.log("Action réussie avec la réponse :", response);
          navigate("/professeurs");
        })
        .catch((error) => {
          // Code à exécuter en cas d'échec de l'action
          console.error("Erreur lors de l'envoi de la requête :", error);
        });
    } else {
      setStepNumber(stepNumber + 1);
    }
  };

  const handlePrev = () => {
    setStepNumber(stepNumber - 1);
  };
  //   const handleFile = (e) => {
  //     setTeacher({ ...teacher, [e.target.name]: e.target.files[0] });
  //   };
  return (
    <div>
      <Card title={title}>
        <div className="grid gap-5 grid-cols-12">
          <div className="lg:col-span-3 col-span-12">
            <div className="flex z-[5] items-start relative flex-col lg:min-h-full md:min-h-[300px] min-h-[250px]">
              {steps.map((item, i) => (
                <div className="relative z-[1] flex-1 last:flex-none" key={i}>
                  <div
                    className={`   ${
                      stepNumber >= i
                        ? "bg-slate-900 text-white ring-slate-900 dark:bg-slate-900 dark:ring-slate-700  dark:ring-offset-slate-500 ring-offset-2"
                        : "bg-white ring-slate-900 ring-opacity-70  text-slate-900 dark:text-slate-300 text-opacity-70 dark:bg-slate-700 dark:ring-slate-700"
                    } 
            transition duration-150 icon-box md:h-12 md:w-12 h-8 w-8 rounded-full flex flex-col items-center justify-center relative z-[66] ring-1 md:text-lg text-base font-medium
            `}
                  >
                    {stepNumber <= i ? (
                      <span> {i + 1}</span>
                    ) : (
                      <span className="text-3xl">
                        <Icon icon="bx:check-double" />
                      </span>
                    )}
                  </div>

                  <div
                    className={` ${
                      stepNumber >= i
                        ? "bg-slate-900 dark:bg-slate-900"
                        : "bg-[#E0EAFF] dark:bg-slate-600"
                    } absolute top-0 left-1/2 -translate-x-1/2 h-full w-[2px]`}
                  ></div>
                  <div
                    className={` ${
                      stepNumber >= i
                        ? " text-slate-900 dark:text-slate-300"
                        : "text-slate-500 dark:text-slate-300 dark:text-opacity-40"
                    } absolute top-0 ltr:left-full rtl:right-full ltr:pl-4 rtl:pr-4 text-base leading-6 md:mt-3 mt-1 transition duration-150 w-full`}
                  >
                    <span className="w-max block">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="conten-box lg:col-span-9 col-span-12">
            <form onSubmit={handleSubmit(onSubmit)}>
              {stepNumber === 0 && (
                <div>
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
                    <div className="lg:col-span-3 md:col-span-2 col-span-1">
                      <h4 className="text-base text-slate-800 dark:text-slate-300 mb-6">
                        Entrez les détails du compte
                      </h4>
                    </div>
                    <Textinput
                      label="Nom"
                      type="text"
                      placeholder="Entrez le nom"
                      name="name"
                      error={errors.name}
                      register={register}
                    />
                    <Textinput
                      label="Prenom"
                      type="text"
                      placeholder="Entrez le prenom"
                      name="lastname"
                      error={errors.lastname}
                      register={register}
                    />
                    <Textinput
                      label="Adresse"
                      type="text"
                      placeholder="Entrez l'adresse de résidence"
                      name="adresse"
                      error={errors.adresse}
                      register={register}
                    />
                    <Textinput
                      label="Date de naissance"
                      type="date"
                      placeholder="Entrez l'adresse de résidence"
                      name="birthday"
                      error={errors.birthday}
                      register={register}
                    />
                    <SelectForm
                      data={teacher}
                      setData={setTeacher}
                      header="sexe"
                      title="Sexe"
                      options={[
                        {
                          value: "Homme",
                          label: "Homme",
                        },
                        {
                          value: "Femme",
                          label: "Femme",
                        },
                      ]}
                    />
                  </div>
                </div>
              )}

              {stepNumber === 1 && (
                <div>
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                    <div className="md:col-span-2 col-span-1">
                      <h4 className="text-base text-slate-800 dark:text-slate-300 mb-6">
                        Informations Uniques
                      </h4>
                    </div>

                    <Textinput
                      label="Email"
                      type="email"
                      placeholder="Tapez le mail"
                      name="email"
                      error={errors.email}
                      register={register}
                    />
                    <Textinput
                      label="CIN/Passeport"
                      type="text"
                      placeholder="Entrez le n° CIN/Passeport"
                      name="idNumber"
                      error={errors.idNumber}
                      register={register}
                    />
                    <InputGroup
                      label="Phone Number"
                      type="text"
                      prepend="MY  (+216)"
                      placeholder="Phone Number"
                      name="phoneNumber"
                      error={errors.phoneNumber}
                      register={register}
                    />
                  </div>
                </div>
              )}
              {stepNumber === 2 && (
                <div>
                  <DropZoneFile data={teacher} setData={setTeacher} />
                </div>
              )}

              <div
                className={`${
                  stepNumber > 0 ? "flex justify-between" : " text-right"
                } mt-10`}
              >
                {stepNumber !== 0 && (
                  <Button
                    text="retour"
                    className="btn-dark"
                    onClick={handlePrev}
                  />
                )}
                <Button
                  text={stepNumber !== steps.length - 1 ? "Avancer" : "submit"}
                  isLoading={loading}
                  className="btn-dark"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FormWizard;
