// @ts-nocheck
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import GetAPI from "../../Utilities/GetAPI";
import { PostAPI } from "../../Utilities/PostAPI";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../Utilities/Toaster";
import Layout from "../../Components/Layout";
import { MiniLoader } from "../../Components/Loader";
import { inputStyle, labelStyle } from "../../Utilities/Input";
import { useTranslation } from "react-i18next";

export default function CreateDriverTwo() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  useEffect(() => {
    if (location?.state?.userId === undefined) {
      navigate("/create-driver/step-one");
      info_toaster("Please complete Step One");
    }
  });
  const location = useLocation();
  console.log(location?.state?.userId);
  const activeVeh = GetAPI("warehouse/getactivevehicles");

  const [timeline] = useState("2");
  const [loader, setLoader] = useState(false);
  const [vehicle, setVehicle] = useState({
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    vehImages: [],
    vehicleTypeId: "",
  });

  const onChange2 = (e) => {
    if (e.target.name === "vehImages") {
      setVehicle({ ...vehicle, [e.target.name]: [...e.target.files] });
    } else {
      setVehicle({ ...vehicle, [e.target.name]: e.target.value });
    }
  };
  const vehicleFunc = async (e) => {
    e.preventDefault();
    if (vehicle.vehicleMake === "") {
      info_toaster("Please enter Vehicle's Make");
    } else if (vehicle.vehicleModel === "") {
      info_toaster("Please enter Vehicle's Model");
    } else if (vehicle.vehicleColor === "") {
      info_toaster("Please enter Vehicle's Color");
    } else if (vehicle.vehicleYear === "") {
      info_toaster("Please enter Vehicle's Year");
    } else if (vehicle.vehImages.length === 0) {
      info_toaster("Please select at least one image for the vehicle");
    } else if (vehicle.vehicleTypeId === "") {
      info_toaster("Please select Vehicle Type");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("vehicleMake", vehicle?.vehicleMake);
      formData.append("vehicleModel", vehicle?.vehicleModel);
      formData.append("vehicleColor", vehicle?.vehicleColor);
      formData.append("vehicleYear", vehicle?.vehicleYear?.value);
      formData.append("vehicleTypeId", vehicle?.vehicleTypeId?.value);
      formData.append("userId", location?.state?.userId);
      vehicle.vehImages.forEach((file) => {
        formData.append("vehImages", file);
      });
      let res = await PostAPI("warehouse/registerstep2", formData);
      if (res?.data?.status === "1") {
        setVehicle({
          vehicleMake: "",
          vehicleModel: "",
          vehicleYear: "",
          vehicleColor: "",
          vehImages: [],
          vehicleTypeId: "",
        });
        navigate("/create-driver/step-three", {
          state: {
            userId: res?.data?.data?.userId,
          },
        });
        success_toaster(res?.data?.message);
        setLoader(false);
      } else {
        error_toaster(res?.data?.message);
        setLoader(false);
      }
    }
  };
  const options = [];
  activeVeh.data?.data?.map((activeVeh, index) =>
    options.push({
      value: activeVeh?.id,
      label: activeVeh?.title,
    })
  );

  const currentYear = new Date().getFullYear();
  const startYear = 1980;
  const [years, setYears] = useState([]);

  useEffect(() => {
    const yearArray = [];
    for (let year = currentYear; year >= startYear; year--) {
      yearArray.push(year);
    }
    setYears(yearArray);
  }, [currentYear, startYear]);

  const selectYears = [];
  years?.map((year, index) =>
    selectYears.push({
      value: year,
      label: year,
    })
  );

  return (
    <>
      <Layout
        title={t("pages.drivers.createDriver")}
        content={
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
                    <label className={labelStyle} htmlFor="vehicleMake">
                      {t("pages.drivers.vehicleMake")}
                    </label>
                    <input
                      value={vehicle.vehicleMake}
                      onChange={onChange2}
                      type="text"
                      name="vehicleMake"
                      id="vehicleMake"
                      placeholder={t("pages.drivers.placeholderSeven")}
                      className={inputStyle}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="vehicleModel">
                    {t("pages.drivers.vehicleModel")}
                    </label>
                    <input
                      value={vehicle.vehicleModel}
                      onChange={onChange2}
                      type="text"
                      name="vehicleModel"
                      id="vehicleModel"
                      placeholder={t("pages.drivers.placeholderEight")}
                      className={inputStyle}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="vehicleColor">
                    {t("pages.drivers.vehicleColor")}
                    </label>
                    <input
                      value={vehicle.vehicleColor}
                      onChange={onChange2}
                      type="text"
                      name="vehicleColor"
                      id="vehicleColor"
                      placeholder={t("pages.drivers.placeholderNine")}
                      className={inputStyle}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="vehicleYear">
                    {t("pages.drivers.vehicleYear")}
                    </label>
                    <Select
                      value={vehicle.vehicleYear}
                      onChange={(selectedYear) => {
                        setVehicle({ ...vehicle, vehicleYear: selectedYear });
                      }}
                      options={years.map((year) => ({
                        value: year,
                        label: year,
                      }))}
                      placeholder="Year"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="vehImages">
                    {t("pages.drivers.vehicleImages")}
                    </label>
                    <input
                      onChange={onChange2}
                      type="file"
                      name="vehImages"
                      id="vehImages"
                      className={inputStyle}
                      multiple={true}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelStyle} htmlFor="vehicleTypeId">
                    {t("pages.drivers.vehicleType")}
                    </label>
                    <Select
                      value={vehicle.vehicleTypeId}
                      onChange={(e) =>
                        setVehicle({ ...vehicle, vehicleTypeId: e })
                      }
                      options={options}
                      inputId="vehicleTypeId"
                    />
                  </div>
                  <div className="col-span-2 flex justify-end items-center mt-20">
                    <button
                      type="submit"
                      onClick={vehicleFunc}
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
                <h6 className="font-medium text-sm">{t("pages.drivers.vehicleMake")}</h6>
                <p className="font-bold text-base text-black text-opacity-60">
                  {vehicle.vehicleMake === ""
                    ? t("pages.drivers.placeholderSeven")
                    : vehicle.vehicleMake}
                </p>
              </div>
              <hr className="border-none h-0.5 bg-black bg-opacity-10" />
              <div>
                <h6 className="font-medium text-sm">{t("pages.drivers.vehicleModel")}</h6>
                <p className="font-bold text-base text-black text-opacity-60">
                  {vehicle.vehicleModel === ""
                    ? t("pages.drivers.placeholderEight")
                    : vehicle.vehicleModel}
                </p>
              </div>
              <hr className="border-none h-0.5 bg-black bg-opacity-10" />
              <div>
                <h6 className="font-medium text-sm">{t("pages.drivers.vehicleColor")}</h6>
                <p className="font-bold text-base text-black text-opacity-60">
                  {vehicle.vehicleColor === ""
                    ? t("pages.drivers.placeholderNine")
                    : vehicle.vehicleColor}
                </p>
              </div>
              <hr className="border-none h-0.5 bg-black bg-opacity-10" />
              <div>
                <h6 className="font-medium text-sm">{t("pages.drivers.regYear")}</h6>
                <p className="font-bold text-base text-black text-opacity-60">
                  {vehicle.vehicleYear
                    ? vehicle.vehicleYear.label
                    : t("pages.drivers.placeholderTen")}
                </p>
              </div>
            </div>
          </section>
        }
      />
    </>
  );
}
