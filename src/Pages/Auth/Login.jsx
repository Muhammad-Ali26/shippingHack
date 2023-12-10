// @ts-nocheck
import React from "react";
import SideBar from "../../Components/SideBar";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useFormik } from "formik";
import { error_toaster, success_toaster } from "../../Utilities/Toaster";
import { loginAPI } from "../../Utilities/PostAPI";
import { setLoginStatus } from "../../Utilities/AuthCheck";
import { loginSchema } from "../../Schemas";
import { errorStyle, inputStyle } from "../../Utilities/Input";
import { MiniLoaderTwo } from "../../Components/Loader";

export default function Login() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [loader, setLoader] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: loginSchema,
      onSubmit: async (values, action) => {
        setLoader(true);
        let res = await loginAPI("warehouse/signin", {
          email: values.email,
          password: values.password,
          dvToken: "saasas4",
        });
        if (res?.data?.status === "1") {
          setLoader(false);
          localStorage.setItem("accessToken", res?.data?.data?.accessToken);
          localStorage.setItem("userEmail", res?.data?.data?.email);
          setLoginStatus(true);
          navigate("/");
          success_toaster(res?.data?.message);
        } else {
          setLoader(false);
          error_toaster(res?.data?.message);
        }
        action.resetForm();
      },
    });

  return (
    <section className="bg-theme grid lg:grid-cols-2 min-h-screen">
      <SideBar />
      <form
        onSubmit={handleSubmit}
        className="xl:w-1/2 lg:w-3/4 md:w-1/2 sm:w-2/3 w-4/5 mx-auto flex flex-col justify-center gap-y-10 relative"
      >
        {loader ? (
          <MiniLoaderTwo />
        ) : (
          <>
            <h1 className="text-white font-bold sm:text-5xl text-4xl text-center">
              Sign in
            </h1>
            <div className="flex flex-col gap-y-5">
              <div className={errors.email && touched.email && errorStyle}>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Email"
                  className={inputStyle}
                  autoComplete="on"
                />
                {errors.email && touched.email && (
                  <div className="px-5 text-red-500 space-y-1 pb-1">
                    <hr className="border-none h-0.5 bg-black bg-opacity-20" />
                    <p>{errors.email}</p>
                  </div>
                )}
              </div>
              <div
                className={errors.password && touched.password && errorStyle}
              >
                <div className="relative">
                  <input
                    type={visible ? "text" : "password"}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Password"
                    className={inputStyle}
                    autoComplete="off"
                  />
                  <button
                    onClick={() => setVisible(!visible)}
                    type="button"
                    className="text-black text-opacity-40 absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {visible ? (
                      <AiOutlineEye size={28} />
                    ) : (
                      <AiOutlineEyeInvisible size={28} />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <div className="px-5 text-red-600 space-y-1 pb-1">
                    <hr className="border-none h-0.5 bg-black bg-opacity-20" />
                    <p>{errors.password}</p>
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="bg-themeOrange text-white font-medium sm:text-xl text-lg py-3 px-8 rounded-md w-full border border-themeOrange hover:bg-transparent 
              hover:text-themeOrange"
            >
              Sign in
            </button>
          </>
        )}
      </form>
    </section>
  );
}
