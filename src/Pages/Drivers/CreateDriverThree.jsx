// @ts-nocheck
import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useLocation, useNavigate } from "react-router-dom";
import { PostAPI } from "../../Utilities/PostAPI";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../Utilities/Toaster";
import { inputStyle, labelStyle } from "../../Utilities/Input";
import Layout from "../../Components/Layout";
import { MiniLoader } from "../../Components/Loader";
import { useTranslation } from "react-i18next";

export default function CreateDriverThree() {
  const navigate = useNavigate();
  useEffect(() => {
    if (location?.state?.userId === undefined) {
      navigate("/create-driver/step-one");
      info_toaster("Please complete Step One");
    }
  });
  const location = useLocation();
  const [timeline] = useState("3");
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [license, setLicense] = useState({
    licIssueDate: "",
    licExpiryDate: "",
    frontImage: "",
    backImage: "",
  });

  const onChange3 = (e) => {
    setLicense({ ...license, [e.target.name]: e.target.value });
  };
  const licenseFunc = async (e) => {
    e.preventDefault();
    if (license.licIssueDate === "") {
      info_toaster("Please enter License's Issue Date");
    } else if (license.licExpiryDate === "") {
      info_toaster("Please enter License's Expiry Date");
    } else if (license.frontImage === "") {
      info_toaster("Please enter License's Front Image");
    } else if (license.backImage === "") {
      info_toaster("Please enter License's Back Image");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("licIssueDate", license.licIssueDate);
      formData.append("licExpiryDate", license.licExpiryDate);
      formData.append("frontImage", license.frontImage);
      formData.append("backImage", license.backImage);
      formData.append("userId", location?.state?.userId);
      let res = await PostAPI("warehouse/registerstep3", formData);

      if (res?.data?.status === "1") {
        navigate("/drivers");
        success_toaster(res?.data?.message);
        setLicense({
          licIssueDate: "",
          licExpiryDate: "",
          frontImage: "",
          backImage: "",
        });
        setLoader(false);
      } else {
        error_toaster(res?.data?.message);
        setLoader(false);
      }
    }
  };

  return (
    <>
      <Layout
        title={t("pages.drivers.createDriver")}
        content={
          <section className="grid grid-cols-12 gap-5">
            <form className="col-span-8 grid grid-cols-2 gap-x-20 gap-y-5 bg-white rounded-md p-8 relative min-h-[572px]">
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
                          ? "border-y-themePurple"
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
                          ? "border-y-themePurple"
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
                    <label className={labelStyle} htmlFor="licIssueDate">
                      {t("pages.drivers.licIssueDate")}
                    </label>
                    <input
                      value={license.licIssueDate}
                      onChange={onChange3}
                      type="date"
                      name="licIssueDate"
                      id="licIssueDate"
                      className={inputStyle}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="licExpiryDate">
                      {t("pages.drivers.licExpiryDate")}
                    </label>
                    <input
                      value={license.licExpiryDate}
                      onChange={onChange3}
                      type="date"
                      name="licExpiryDate"
                      id="licExpiryDate"
                      className={inputStyle}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="frontImage">
                      {t("pages.drivers.frontImage")}
                    </label>
                    <input
                      onChange={(e) =>
                        setLicense({
                          ...license,
                          [e.target.name]: e.target.files[0],
                        })
                      }
                      type="file"
                      name="frontImage"
                      id="frontImage"
                      className={inputStyle}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="backImage">
                      {t("pages.drivers.backImage")}
                    </label>
                    <input
                      onChange={(e) =>
                        setLicense({
                          ...license,
                          [e.target.name]: e.target.files[0],
                        })
                      }
                      type="file"
                      name="backImage"
                      id="backImage"
                      className={inputStyle}
                    />
                  </div>
                  <div className="col-span-2 flex justify-end items-center mt-20">
                    <button
                      type="submit"
                      onClick={licenseFunc}
                      className="bg-theme w-40 font-medium text-xl text-white py-2.5 px-5 rounded border border-theme hover:text-theme hover:bg-transparent"
                    >
                      {t("pages.drivers.createBtn")}
                    </button>
                  </div>
                </>
              )}
            </form>
            <div className="col-span-4 bg-white rounded-md space-y-5 p-8">
              <h2 className="font-bold text-xl text-themePurple">
                {t("pages.drivers.entries")}
              </h2>
              <hr className="border-none h-0.5 bg-black bg-opacity-10" />
              <div>
                <h6 className="font-medium text-sm">
                  {t("pages.drivers.licIssueDate")}
                </h6>
                <p className="font-bold text-base text-black text-opacity-60">
                  {license.licIssueDate === ""
                    ? t("pages.drivers.placeholderEle")
                    : license.licIssueDate}
                </p>
              </div>
              <hr className="border-none h-0.5 bg-black bg-opacity-10" />
              <div>
                <h6 className="font-medium text-sm">
                  {t("pages.drivers.licExpiryDate")}
                </h6>
                <p className="font-bold text-base text-black text-opacity-60">
                  {license.licExpiryDate === ""
                    ? t("pages.drivers.placeholderTwe")
                    : license.licExpiryDate}
                </p>
              </div>
              <hr className="border-none h-0.5 bg-black bg-opacity-10" />
            </div>
          </section>
        }
      />
    </>
  );
}
