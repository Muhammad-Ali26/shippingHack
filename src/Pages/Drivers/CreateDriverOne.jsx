// @ts-nocheck
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import { PostAPI } from "../../Utilities/PostAPI";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../Utilities/Toaster";
import { inputStyle, labelStyle, style } from "../../Utilities/Input";
import Layout from "../../Components/Layout";
import { BackButton } from "../../Utilities/Buttons";
import { MiniLoader } from "../../Components/Loader";
import { useTranslation } from "react-i18next";

export default function CreateDriverOne() {
  const navigate = useNavigate();
  const [timeline] = useState("1");
  const [visible, setVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [driver, setDriver] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "507",
    phoneNum: "",
    password: "",
    profileImage: "",
  });
  const onChange = (e) => {
    setDriver({ ...driver, [e.target.name]: e.target.value });
  };

  const driverFunc = async (e) => {
    e.preventDefault();
    if (driver.firstName === "") {
      info_toaster("Please enter Driver's First Name");
    } else if (driver.lastName === "") {
      info_toaster("Please enter Driver's Last Name");
    } else if (driver.email === "") {
      info_toaster("Please enter Driver's Email");
    } else if (driver.phoneNum === "") {
      info_toaster("Please enter Driver's Phone Number");
    } else if (driver.password === "") {
      info_toaster("Please create Driver's Password");
    } else if (driver.profileImage === "") {
      info_toaster("Please enter Driver's Profile Image");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("firstName", driver.firstName);
      formData.append("lastName", driver.lastName);
      formData.append("email", driver.email);
      formData.append("countryCode", "+" + driver.countryCode);
      formData.append("phoneNum", driver.phoneNum);
      formData.append("password", driver.password);
      formData.append("profileImage", driver.profileImage);
      let res = await PostAPI("warehouse/registerstep1", formData);
      if (res?.data?.status === "1") {
        setDriver({
          firstName: "",
          lastName: "",
          email: "",
          countryCode: "92",
          phoneNum: "",
          password: "",
          profileImage: "",
        });
        navigate("/create-driver/step-two", {
          state: { userId: res?.data?.data?.id },
        });
        success_toaster(res?.data?.message);
        setLoader(false);
      } else {
        error_toaster(res?.data?.error);
        setLoader(false);
      }
    }
  };
  return (
    <>
      <style>{style}</style>
      <Layout
        title={t("pages.drivers.createDriver")}
        content={
          <section className="space-y-4">
            <div>
              <BackButton name={t("pages.details.backButton")} />
            </div>
            <section className="grid grid-cols-12 gap-5">
              <form className="col-span-8 grid grid-cols-2 gap-x-20 gap-y-5 bg-white rounded-md p-8 relative min-h-[568px]">
                {loader ? (
                  <MiniLoader />
                ) : (
                  <>
                    <div className="col-span-2 flex items-center text-lg my-4">
                      <div
                        className={`
                    ${
                      timeline === "1" || timeline === "2" || timeline === "3"
                        ? "bg-theme text-white"
                        : "bg-black bg-opacity-20"
                    } min-w-[40px] min-h-[40px] rounded-fullest flex justify-center items-center`}
                      >
                        1
                      </div>
                      <div
                        className={`${
                          timeline === "2" || timeline === "3"
                            ? "border-y-theme"
                            : "border-y-black border-opacity-20"
                        } w-full h-0 border-y mx-4`}
                      ></div>
                      <div
                        className={`
                    ${
                      timeline === "2" || timeline === "3"
                        ? "bg-theme text-white"
                        : "bg-black bg-opacity-20"
                    } min-w-[40px] min-h-[40px] rounded-fullest flex justify-center items-center`}
                      >
                        2
                      </div>
                      <div
                        className={`${
                          timeline === "3"
                            ? "border-y-theme"
                            : "border-y-black border-opacity-20"
                        } w-full h-0 border-y mx-4`}
                      ></div>
                      <div
                        className={`
                    ${
                      timeline === "3"
                        ? "bg-theme text-white"
                        : "bg-black bg-opacity-20"
                    } min-w-[40px] min-h-[40px] rounded-fullest flex justify-center items-center`}
                      >
                        3
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className={labelStyle} htmlFor="firstName">
                      {t("pages.drivers.firstName")}
                      </label>
                      <input
                        value={driver.firstName}
                        onChange={onChange}
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder={t("pages.drivers.placeholderOne")}
                        className={inputStyle}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelStyle} htmlFor="lastName">
                      {t("pages.drivers.lastName")}
                      </label>
                      <input
                        value={driver.lastName}
                        onChange={onChange}
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder={t("pages.drivers.placeholderTwo")}
                        className={inputStyle}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelStyle} htmlFor="email">
                      {t("pages.drivers.email")}
                      </label>
                      <input
                        value={driver.email}
                        onChange={onChange}
                        type="email"
                        name="email"
                        id="email"
                        placeholder={t("pages.drivers.placeholderThree")}
                        className={inputStyle}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelStyle} htmlFor="phoneNum">
                      {t("pages.drivers.phone")}
                      </label>
                      <div className="flex gap-x-1">
                        <PhoneInput
                          inputStyle={{
                            display: "block",
                            width: "88px",
                            paddingTop: "22px",
                            paddingBottom: "22px",
                            background: "#F4F5FA",
                            color: "black",
                            border: "none",
                          }}
                          inputProps={{
                            id: "countryCode",
                            name: "countryCode",
                          }}
                          country="Panama"
                          value={driver.countryCode}
                          onChange={(code) =>
                            setDriver({ ...driver, countryCode: code })
                          }
                        />
                        <input
                          value={driver.phoneNum}
                          onChange={onChange}
                          type="number"
                          name="phoneNum"
                          id="phoneNum"
                          placeholder={t("pages.drivers.placeholderFour")}
                          className={inputStyle}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className={labelStyle} htmlFor="password">
                      {t("pages.drivers.password")}
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setVisible(!visible)}
                          type="button"
                          className="text-black text-opacity-40 absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          {visible ? (
                            <AiOutlineEye size={20} />
                          ) : (
                            <AiOutlineEyeInvisible size={20} />
                          )}
                        </button>
                        <input
                          value={driver.password}
                          onChange={onChange}
                          type={visible ? "text" : "password"}
                          name="password"
                          id="password"
                          placeholder={t("pages.drivers.placeholderFive")}
                          className={inputStyle}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className={labelStyle} htmlFor="profileImage">
                      {t("pages.drivers.image")}
                      </label>
                      <input
                        onChange={(e) =>
                          setDriver({
                            ...driver,
                            [e.target.name]: e.target.files[0],
                          })
                        }
                        type="file"
                        name="profileImage"
                        id="profileImage"
                        className={inputStyle}
                      />
                    </div>
                    <div className="col-span-2 flex justify-end items-center mt-20">
                      <button
                        type="submit"
                        onClick={driverFunc}
                        className="bg-theme w-40 font-medium text-xl text-white py-2.5 px-5 rounded border border-theme hover:text-theme hover:bg-transparent"
                      >
                        {t("pages.drivers.createBtn")}
                      </button>
                    </div>
                  </>
                )}
              </form>
              <div className="col-span-4 bg-white rounded-md space-y-5 p-8">
                <h2 className="font-bold text-xl text-theme">{t("pages.drivers.entries")}</h2>
                <hr className="border-none h-0.5 bg-black bg-opacity-10" />
                <div>
                  <h6 className="font-medium text-sm">{t("pages.drivers.name")}</h6>
                  <p className="font-bold text-base text-black text-opacity-60">
                    {driver.firstName === ""
                      ? t("pages.drivers.placeholderSix")
                      : driver.firstName + " " + driver.lastName}
                  </p>
                </div>
                <hr className="border-none h-0.5 bg-black bg-opacity-10" />
                <div>
                  <h6 className="font-medium text-sm">{t("pages.drivers.email")}</h6>
                  <p className="font-bold text-base text-black text-opacity-60">
                    {driver.email === ""
                      ? t("pages.drivers.placeholderThree")
                      : driver.email}
                  </p>
                </div>
                <hr className="border-none h-0.5 bg-black bg-opacity-10" />
                <div>
                  <h6 className="font-medium text-sm">{t("pages.drivers.phone")}</h6>
                  <p className="font-bold text-base text-black text-opacity-60">
                    {driver.phoneNum === ""
                      ? t("pages.drivers.placeholderFour")
                      : "+" + driver.countryCode + " " + driver.phoneNum}
                  </p>
                </div>
              </div>
            </section>
          </section>
        }
      />
    </>
  );
}
