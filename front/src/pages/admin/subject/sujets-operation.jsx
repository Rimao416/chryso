import React, { useState } from "react";
import Card from "@/components/ui/Card";
// import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Textinput from "@/components/ui/Textinput";
import * as yup from "yup";
import HorizontalForm from "../../forms/form-wizard/HozizontalForm";
import { toast } from "react-toastify";
import Button from "../../../components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchAcademicPrograms } from "../../../slice/admin/programSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
// import { removeEmptyProperties } from "../../utility/utils";
import SelectForm from "../../forms/select/SelectForm";
import MultiSelect from "../../forms/select/MultiSelect";
import { fetchAcademicTeacher } from "../../../slice/admin/teacherSlice";
import { getClass } from "../../../slice/admin/classSlice";
import {
  addSubjects,
  getSingleSubject,
  updateSubject,
} from "../../../slice/admin/subjectSlice";
import { getTerms } from "../../../slice/admin/termSlice";
function SujetsOperation() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const [status, setStatus] = useState("");
  const [credentials, setCredentials] = useState({
    name: "",
    academicTerm: "",
    teacher: "",
    classLevel: [],
  });

  useEffect(() => {
    dispatch(fetchAcademicPrograms());
    dispatch(fetchAcademicTeacher());
    dispatch(getClass());
    dispatch(getTerms());

    if (location.pathname.startsWith("/sujets-create")) {
      setStatus("create");
    } else if (location.pathname.startsWith("/sujets-edit")) {
      dispatch(getSingleSubject(id))
        .then((res) => {
          //   1) Mettre toutes les id des classes dans le tableau classLevel
          setCredentials({
            ...credentials,
            name: res.payload.data.name,
            academicTerm: res.payload.data.academicTerm._id,
            teacher: res.payload.data.teacher._id,
            classLevel: res.payload.data.classLevel.map(
              (classItem) => classItem._id
            ),
          });
          //   2) Mettre toutes les id des enseignants dans le tableau teacher
          //   3) Mettre tous les id des programmes dans le tableau academicProgram
        })
        .then(() => {
          dispatch(fetchAcademicPrograms());
          dispatch(fetchAcademicTeacher());
          dispatch(getClass());
          // dispatch(getTerms());
        });

      setStatus("edit");
    }
  }, [location, id]);

  const { academicTerm: periodes, loading } = useSelector(
    (state) => state.termSlice
  );
  const { academicTeacher: teachers } = useSelector(
    (state) => state.teacherSlice
  );
  const { academicClass: classes } = useSelector((state) => state.classSlice);
  const { academicSubject: subjects } = useSelector(
    (state) => state.subjectSlice
  );

  const navigate = useNavigate();
  let FormValidationSchema = null;
  // STEP VALIDATION

  let stepSchema = yup.object().shape({
    name: yup.string(),
  });
  const stepSchemas = [stepSchema];
  const [stepNumber, setStepNumber] = useState(0);
  const currentStepSchema = stepSchemas[stepNumber];

  const steps = [
    {
      id: 1,
      title: "Details du cours",
    },
    {
      id: 2,
      title: "Informations associées",
    },
  ];

  if (status === "create") {
    FormValidationSchema = yup.object({
      name: yup.string().required("Le nom est requis"),
    });
  } else if (status === "edit") {
    FormValidationSchema = yup.object({
      name: yup.string(),
    });
  }

  const {
    register,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(currentStepSchema),
    // keep watch on all fields
    mode: "all",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let totalSteps = steps.length;
    const isLastStep = stepNumber === totalSteps - 1;
    if (isLastStep) {
      if (status == "create") {
        const response = await dispatch(addSubjects(credentials));
        console.log(response);
        if (response.type == "academicSubject/addSubjects/fulfilled") {
          toast.success("Sujet ajouté avec succès");
          navigate("/sujets");
        } else if (response.type == "academicSubject/addSubjects/rejected") {
          toast.error(response.error?.message);
        }
      } else {
        // console.log(credentials);
        const sendData = { ...credentials, _id: subjects[0]._id };
        const response = await dispatch(updateSubject(sendData));
        console.log(response);
        if (response.type == "academicSubjects/updateSubjects/fulfilled") {
          
          toast.success("Sujet modifié avec succès");
          // navigate("/sujets");
        } else if (
          response.type == "academicSubjects/updateSubjects/rejected"
        ) {
          toast.error(response.error?.message);
        }
      }
    } else {
      setStepNumber(stepNumber + 1);
    }
  };

  // find current step schema

  const handlePrev = () => {
    setStepNumber(stepNumber - 1);
  };

  return (
    <>
      {loading === false && (
        <HorizontalForm
          title={status === "create" ? "Ajouter un sujet" : "Modifier le sujet"}
          steps={steps}
          stepNumber={stepNumber}
          handlePrev={handlePrev}
        >
          <form onSubmit={handleSubmit}>
            {stepNumber === 0 && (
              <div>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 pt-10">
                  <div className="lg:col-span-3 md:col-span-2 col-span-1">
                    <h4 className="text-base text-slate-800 dark:text-slate-300 my-6">
                      Entrez les détails du cours
                    </h4>
                  </div>
                  <Textinput
                    label="Nom du Cours"
                    type="text"
                    placeholder="Entrez le nom du cours"
                    defaultValue={credentials?.name}
                    name="name"
                    error={errors.name}
                    register={register}
                    onChange={handleChange}
                  />
                </div>
                {status == "edit" && (
                  <span className="text-slate-500 text-sm">
                    Le nom actuel du cours est {subjects[0]?.name}
                    <br />
                    Laissez le champ vide si vous ne voulez pas modifier le nom
                    du cours
                  </span>
                )}{" "}
              </div>
            )}

            {stepNumber === 1 && (
              <div>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                  <div className="md:col-span-2 col-span-1">
                    <h4 className="text-base text-slate-800 dark:text-slate-300 mb-6">
                      Informations associées
                    </h4>
                  </div>
                  <SelectForm
                    data={credentials}
                    setData={setCredentials}
                    header="academicTerm"
                    title="Période Académique"
                    register={register}
                    error={errors.academicTerm}
                    defaultValue={
                      periodes?.find(
                        (periode) => periode._id === credentials?.academicTerm
                      ) && {
                        value: credentials.academicTerm,
                        label: periodes?.find(
                          (periode) => periode._id === credentials.academicTerm
                        ).name,
                      }
                    }
                    options={periodes?.map((periode) => {
                      return {
                        value: periode._id,
                        label: periode.name,
                      };
                    })}
                  />
                  <SelectForm
                    data={credentials}
                    setData={setCredentials}
                    header="teacher"
                    title="Professeur de la matière"
                    //   LOOK TEACHER INTO CREDENTIALS
                    defaultValue={
                      teachers.find(
                        (teacher) => teacher._id === credentials?.teacher
                      ) && {
                        value: credentials.teacher,
                        label: teachers.find(
                          (teacher) => teacher._id === credentials.teacher
                        ).name,
                      }
                    }
                    //   register={register}
                    options={teachers.map((teacher) => {
                      return {
                        value: teacher._id,
                        label: teacher.name,
                      };
                    })}
                  />
                  <MultiSelect
                    title="Classes associées"
                    options={classes.map((program) => {
                      return {
                        value: program._id,
                        label: program.name,
                      };
                    })}
                    data={credentials}
                    setData={setCredentials}
                    header="classLevel"
                  />
                </div>
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
                text={stepNumber !== steps.length - 1 ? "Suivant" : "Envoyé"}
                className="btn-dark"
                type="submit"
              />
            </div>
          </form>
        </HorizontalForm>
      )}
    </>
  );
}

export default SujetsOperation;
