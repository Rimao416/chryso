import React, { useState } from "react";
import Card from "@/components/ui/Card";
// import { useDispatch, useSelector } from "react-redux";
import InputGroup from "@/components/ui/InputGroup";
import { useForm } from "react-hook-form";
import StripeCheckout from "react-stripe-checkout";
import { yupResolver } from "@hookform/resolvers/yup";
import Textinput from "@/components/ui/Textinput";
import * as yup from "yup";
import { toast } from "react-toastify";
import Button from "../../../components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { removeEmptyProperties } from "../../utility/utils";
import { addAcademicPayment } from "../../../slice/admin/paymentSlice";
import axios from "axios";
import { API } from "../../../configs/config";
function PaymentPage() {
  const isAuthenticated = useSelector((state) => state.authSlice.user?.user);

  const [montant, setMontant] = useState(0);
  const [stripeToken, setStripeToken] = useState(null);

  const onToken = (token) => {
    setStripeToken(token);
  };
  // console.log(isAuthenticated);
  const dispatch = useDispatch();
  const location = useLocation();
  const { academicProgram: program, loading } = useSelector(
    (state) => state.programSlice
  );

  const navigate = useNavigate();
  let FormValidationSchema = null;

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
  });

  useEffect(() => {
    const makeRequest = async () => {
      try {
        API.withCredentials = true;
        const { token } = JSON.parse(localStorage.getItem("profile"));
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await API.post("/api/v1/academic-payments/create-checkout-session", {
          tokenId: stripeToken.id,
          amount: montant,
        });
        toast.success("Paiment effectué avec success");
        navigate("/payments");
      } catch (error) {
        console.log(error);
      }

      //     const res = await userRequest.post("/checkout/payment", {
      //       tokenId: stripeToken.id,
      //       amount: 500,
      //     });
      //     // history.push("/success", {
      //     //   stripeData: res.data,
      //     //   products: cart, });
    };
    stripeToken && makeRequest();
  }, [stripeToken, montant, navigate]);

  const onSubmit = async (data) => {
    //
    // console.log({data})

    const response = await API.post(
      "/api/v1/academic-payments/create-checkout-session",
      data
    );

    console.log(response);

    // const { token } = JSON.parse(localStorage.getItem("profile"));
    // API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // try {
    //   const response = await API.post(
    //     "/api/v1/academic-payments",
    //     newAcademicPayment
    //   );
    //   const session = await response.json();
    //   const result = await stripe.redirectToCheckout({ sessionId: session.id });
    //   console.log(result);
    //   if (result.error) {
    //     toast.error(result.error);
    //   }
    // dispatch(
    //   addAcademicPayment({ ...data, isAuthenticated })).then((res)=>{
    //     console.log(res)
    //   });
  };
  const handleChange = (e) => {
    setMontant(e.target.value);
    // setData({ ...dataProgram, [e.target.name]: e.target.value });
  };

  //   const handleSubmit = (event) => {
  //     event.preventDefault();
  //     console.log("Salut");
  //   };
  return (
    <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
      <div className="xl:col-span-2 col-span-1">
        <Card title="Formulaire de paiement">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:grid-cols-2 grid gap-5 grid-cols-1 "
          >
            <Textinput
              name="montant"
              label="Paiement"
              type="text"
              register={register}
              error={errors.name}
              // defaultValue={dataProgram?.name}
              onChange={handleChange}
            />

            <div className="lg:col-span-2 col-span-1">
              <div className="ltr:text-right rtl:text-left">
                <StripeCheckout
                  name="Time Université"
                  image="https://avatars.githubusercontent.com/u/1486366?v=4"
                  billingAddress
                  shippingAddress
                  description={"Le montant total est " + montant}
                  amount={montant * 100}
                  token={onToken}
                  stripeKey={
                    "pk_test_51J5TX7LLiFJrGSKS2YAiMz0QWVv2Ue1ijVZWAmSj3tpeiVl8n7qKdk21bVK9zMRUiLjLVXgMR2yvzQJwVrk9ysj500eu5Vy2Nm"
                  }
                >
                  {montant > 0 && <Button>Payer</Button>}
                </StripeCheckout>

                {/* <Button
                  className="btn btn-dark text-center"
                  type="submit"
                  // isLoading={loading}
                >
                  Enregistrer
                </Button> */}
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default PaymentPage;
