// @ts-nocheck
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import GetAPI from "../../Utilities/GetAPI";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../Utilities/Toaster";
import { inputStyle, labelStyle } from "../../Utilities/Input";
import Layout from "../../Components/Layout";
import { MiniLoader } from "../../Components/Loader";
import { BackButton } from "../../Utilities/Buttons";
import { PutAPI } from "../../Utilities/PutAPI";
import { useTranslation } from "react-i18next";

export default function UpdateDriverVehicleInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const driverDetail = location?.state?.driverDetails;
  const activeVeh = GetAPI("warehouse/getactivevehicles");
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();

  const [vehicle, setVehicle] = useState({
    userId: driverDetail?.user?.id,
    vehicleMake: driverDetail?.vehicleMake,
    vehicleModel: driverDetail?.vehicleModel,
    vehicleYear: driverDetail?.vehicleYear,
    vehicleColor: driverDetail?.vehicleColor,
    vehicleTypeId: "",
    imageUpdated: false,
    vehImages: [],
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
    } else if (vehicle.vehicleTypeId === "") {
      info_toaster("Please select Vehicle Type");
    } else if (vehicle.imageUpdated && vehicle.vehImages.length === 0) {
      info_toaster("Please select at least one image for the vehicle");
    } else {
      setLoader(true);
      const formData = new FormData();
      formData.append("vehicleMake", vehicle.vehicleMake);
      formData.append("vehicleModel", vehicle.vehicleModel);
      formData.append("vehicleColor", vehicle.vehicleColor);
      formData.append("vehicleYear", vehicle.vehicleYear);
      formData.append("vehicleTypeId", vehicle.vehicleTypeId.value);
      formData.append("userId", vehicle.userId);
      formData.append("imageUpdated", vehicle.imageUpdated);
      vehicle.imageUpdated &&
        vehicle.vehImages.forEach((file) => {
          formData.append("updateVehData", file);
        });
      let res = await PutAPI("warehouse/updateDriverVehicle", formData);
      if (res?.data?.status === "1") {
        setVehicle({
          userId: "",
          vehicleMake: "",
          vehicleModel: "",
          vehicleYear: "",
          vehicleColor: "",
          vehicleTypeId: "",
          imageUpdated: false,
          vehImages: [],
        });
        navigate("/drivers");
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
  return (
    <>
      <Layout
        title={t("pages.drivers.updateDriver")}
        content={
          <section className="space-y-4">
            <div>
              <BackButton name={t("pages.details.backButton")} />
            </div>
            <section className="grid grid-cols-12 gap-5">
              <form className="col-span-8 grid grid-cols-2 gap-x-20 gap-y-5 bg-white rounded-md p-8 relative min-h-[659.61px]">
                {loader ? (
                  <MiniLoader />
                ) : (
                  <>
                    <div className="col-span-2 flex items-center text-lg my-4">
                      <h3 className="font-medium text-2xl">
                        {" "}
                        {t("pages.drivers.vehicleInfo")}
                      </h3>
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
                      <input
                        value={vehicle.vehicleYear}
                        onChange={onChange2}
                        type="text"
                        name="vehicleYear"
                        id="vehicleYear"
                        placeholder="Enter Vehicle's Year"
                        className={inputStyle}
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
                    <div className="flex items-center gap-x-4 min-h-[79.61px]">
                      <label className={labelStyle} htmlFor="imageUpdated">
                        {t("pages.drivers.newImage")}
                      </label>
                      <input
                        value={vehicle.imageUpdated}
                        onChange={(e) =>
                          setVehicle({
                            ...vehicle,
                            imageUpdated: !vehicle.imageUpdated,
                          })
                        }
                        type="checkbox"
                        name="imageUpdated"
                        id="imageUpdated"
                      />
                    </div>
                    <div
                      className={`space-y-1 ${
                        vehicle.imageUpdated ? "visible" : "invisible"
                      }`}
                    >
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
                    <div className="col-span-2 flex justify-end items-center mt-20">
                      <button
                        type="submit"
                        onClick={vehicleFunc}
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
                    {t("pages.drivers.vehicleMake")}
                  </h6>
                  <p className="font-bold text-base text-black text-opacity-60">
                    {vehicle.vehicleMake === ""
                      ? t("pages.drivers.placeholderSeven")
                      : vehicle.vehicleMake}
                  </p>
                </div>
                <hr className="border-none h-0.5 bg-black bg-opacity-10" />
                <div>
                  <h6 className="font-medium text-sm">
                    {t("pages.drivers.vehicleModel")}
                  </h6>
                  <p className="font-bold text-base text-black text-opacity-60">
                    {vehicle.vehicleModel === ""
                      ? t("pages.drivers.placeholderEight")
                      : vehicle.vehicleModel}
                  </p>
                </div>
                <hr className="border-none h-0.5 bg-black bg-opacity-10" />
                <div>
                  <h6 className="font-medium text-sm">
                    {t("pages.drivers.vehicleColor")}
                  </h6>
                  <p className="font-bold text-base text-black text-opacity-60">
                    {vehicle.vehicleColor === ""
                      ? t("pages.drivers.placeholderNine")
                      : vehicle.vehicleColor}
                  </p>
                </div>
                <hr className="border-none h-0.5 bg-black bg-opacity-10" />
                <div>
                  <h6 className="font-medium text-sm">
                    {t("pages.drivers.regYear")}
                  </h6>
                  <p className="font-bold text-base text-black text-opacity-60">
                    {vehicle.vehicleYear === ""
                      ? t("pages.drivers.placeholderTen")
                      : vehicle.vehicleYear}
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
