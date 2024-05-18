import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

// image import
import Logo from "@/assets/images/logo/logo_2.svg";

const login = () => {
  const isAuthenticated = useSelector((state) => state.authSlice?.user?.user);
  // console.log(isAuthenticated);
  // const [isDark] = useDarkMode();
  return (
    <>
      <ToastContainer />
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="left-column relative z-[1]">
            <div className="max-w-[520px] pt-20 ltr:pl-20 rtl:pr-20">
              <Link to="/">
                {/* <img src={isDark ? LogoWhite : Logo} alt="" className="mb-10" />  */}
              </Link>
            </div>
            <div className="absolute left-0 2xl:bottom-[-160px] bottom-[-130px] h-full w-full z-[-1]">
              <img src={Logo} alt="" className="h-full w-full object-contain" />
            </div>
          </div>
          <div className="right-column relative">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
                <div className="mobile-logo text-center mb-6 lg:hidden block">
                  <Link to="/">
                    <img src={Logo} alt="" className="mx-auto" />
                  </Link>
                </div>
                <div className="text-center 2xl:mb-10 mb-4">
                  <h4 className="font-medium">Connexion</h4>
                  <div className="text-slate-500 text-base">
                    Connectez-vous à votre compte pour commencer à utiliser
                    Alumi
                  </div>
                </div>
                <LoginForm />
              </div>
              <div className="auth-footer text-center">
                {/* Copyright {Date.now().getFullYear()}, Dashcode All Rights Reserved. */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default login;
