// @ts-nocheck
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../Utilities/Toaster";
import { inputStyle, labelStyle, style } from "../../Utilities/Input";
import Layout from "../../Components/Layout";
import { BackButton } from "../../Utilities/Buttons";
import { MiniLoader } from "../../Components/Loader";
import { PutAPI } from "../../Utilities/PutAPI";
import { useTranslation } from "react-i18next";

export default function UpdateDriverInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const driverDetails = location?.state?.driverDetails;
  const { t } = useTranslation();

  const [loader, setLoader] = useState(false);
  const [driver, setDriver] = useState({
    userId: driverDetails?.user?.id || "",
    firstName: driverDetails?.user?.firstName || "",
    lastName: driverDetails?.user?.lastName || "",
    countryCode: driverDetails?.user?.countryCode || "",
    phoneNum: driverDetails?.user?.phoneNum || "",
    imageUpdated: false,
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
    } else if (driver.phoneNum === "") {
      info_toaster("Please enter Driver's Phone Number");
    } else if (driver.imageUpdated && driver.profileImage === "") {
      info_toaster("Please enter Driver's Profile Image");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("userId", driver.userId);
      formData.append("firstName", driver.firstName);
      formData.append("lastName", driver.lastName);
      formData.append("countryCode", driver.countryCode);
      formData.append("phoneNum", driver.phoneNum);
      formData.append("imageUpdated", driver.imageUpdated);
      driver.imageUpdated
        ? formData.append("profileImage", driver.profileImage)
        : formData.append("profileImage", "");
      let res = await PutAPI("warehouse/updateDriverProfile", formData);
      if (res?.data?.status === "1") {
        setDriver({
          userId: "",
          firstName: "",
          lastName: "",
          countryCode: "507",
          phoneNum: "",
          imageUpdated: false,
          profileImage: "",
        });
        navigate("/drivers");
        success_toaster(res?.data?.message);
      } else {
        error_toaster(res?.data?.message);
      }
    }
  };
  return (
    <>
      <style>{style}</style>
      <Layout
        title={t("pages.drivers.updateDriver")}
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
                      <h3 className="font-medium text-2xl">
                        {t("pages.drivers.personalInfo")}
                      </h3>
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
                    <div className="flex items-center gap-x-4 min-h-[79.61px]">
                      <label className={labelStyle} htmlFor="imageUpdated">
                        {t("pages.drivers.newImage")}
                      </label>
                      <input
                        value={driver.imageUpdated}
                        onChange={(e) =>
                          setDriver({
                            ...driver,
                            imageUpdated: !driver.imageUpdated,
                          })
                        }
                        type="checkbox"
                        name="imageUpdated"
                        id="imageUpdated"
                      />
                    </div>
                    <div
                      className={`space-y-1 ${
                        driver.imageUpdated ? "visible" : "invisible"
                      }`}
                    >
                      <label className={labelStyle} htmlFor="profileImage">
                        {t("pages.drivers.profileImg")}
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
                        {t("pages.drivers.updateBtn")}
                      </button>
                    </div>
                  </>
                )}
              </form>
              <div className="col-span-4 bg-white rounded-md space-y-5 p-8">
                <h2 className="font-bold text-xl text-theme">
                  {t("pages.drivers.entries")}
                </h2>
                <hr className="border-none h-0.5 bg-black bg-opacity-10" />
                <div>
                  <h6 className="font-medium text-sm">
                    {t("pages.drivers.name")}
                  </h6>
                  <p className="font-bold text-base text-black text-opacity-60">
                    {driver.firstName === ""
                      ? t("pages.drivers.placeholderSix")
                      : driver.firstName + " " + driver.lastName}
                  </p>
                </div>
                <hr className="border-none h-0.5 bg-black bg-opacity-10" />
                <div>
                  <h6 className="font-medium text-sm">
                    {t("pages.drivers.phone")}
                  </h6>
                  <p className="font-bold text-base text-black text-opacity-60">
                    {driver.phoneNum === ""
                      ? t("pages.drivers.placeholderFour")
                      : `${driver.countryCode} ${driver.phoneNum}`}
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
