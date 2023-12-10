// @ts-nocheck
import React from "react";
import Layout from "../../Components/Layout";
import { BackButton } from "../../Utilities/Buttons";
import { useLocation } from "react-router-dom";
import GetAPI from "../../Utilities/GetAPI";
import Select from "react-select";
import Loader, { MiniLoader } from "../../Components/Loader";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { PostAPI } from "../../Utilities/PostAPI";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../Utilities/Toaster";
import StatusPill from "../../Components/StatusPill";
import DeliveryDetailsCard from "../../Components/DeliveryDetailsCard";
import ShippingCompanyCard from "../../Components/ShippingCompanyCard";
import OrderDetailsCard from "../../Components/OrderDetailsCard";
import { useTranslation } from "react-i18next";

export default function IncomingDetails() {
  const location = useLocation();
  const { data, reFetch } = GetAPI(
    `warehouse/bookingdetails?id=${location?.state?.packageId}`
  );

  const categoryData = GetAPI("warehouse/getallcategory");
  const [modal, setModal] = useState(false);
  const [packageData, setPackageData] = useState(null);
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [measureData, setMeasureData] = useState({
    id: "",
    actualWeight: "",
    actualLength: "",
    actualWidth: "",
    actualHeight: "",
    actualVolume: "",
    category: "",
  });

  const handleInputEvent = (e) => {
    setMeasureData({ ...measureData, [e.target.name]: e.target.value });
  };

  const remeasurement = async () => {
    if (measureData.actualHeight === "") {
      info_toaster("Please Enter Package Height");
    } else if (measureData.actualLength === "") {
      info_toaster("Please Enter Package Length");
    } else if (measureData.actualWeight === "") {
      info_toaster("Please Enter Package Weight");
    } else if (measureData.actualWidth === "") {
      info_toaster("Please Enter Package Width");
    } else if (measureData.category === "") {
      info_toaster("Please Select Category");
    } else {
      setLoader(true);
      const res = await PostAPI("warehouse/remeasurement", {
        id: packageData?.id,
        actualWeight: measureData?.actualWeight,
        actualLength: measureData?.actualLength,
        actualWidth: measureData?.actualWidth,
        actualHeight: measureData?.actualHeight,
        actualVolume:
          measureData?.actualHeight *
          measureData?.actualWidth *
          measureData?.actualLength,
        category: measureData?.category?.value,
      });
      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setModal(false);
        setMeasureData({
          id: "",
          actualWeight: "",
          actualLength: "",
          actualWidth: "",
          actualHeight: "",
          actualVolume: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };
  const openModal = (value) => {
    setPackageData(value);
    setModal(true);
  };

  const closeModal = () => {
    setPackageData(null);
    setModal(false);
  };

  const options = [];
  categoryData.data?.status === "1" &&
    categoryData.data?.data?.map((categoryType, index) =>
      options.push({
        value: categoryType?.id,
        label: categoryType?.title,
      })
    );

  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title={t("pages.details.labelTitle")}
      search={false}
      content={
        <section className="space-y-6">
          <div className="flex justify-between">
            <BackButton name={t("pages.details.backButton")} />
          </div>

          <div className="bg-white py-8 px-10 rounded-lg">
            <div className="flex gap-5 [&>div]:min-w-[12.5%] overflow-auto pb-5">
              {data?.data?.history
                ?.filter((booking) => booking?.status === true)
                .map((booking, index) => (
                  <StatusPill
                    key={index}
                    title={booking?.statusText}
                    pillStatus="completed"
                    date={booking?.date}
                    time={booking?.time}
                  />
                ))}
              {data?.data?.history
                ?.filter((booking) => booking?.status === false)
                .map((booking, index) => (
                  <StatusPill
                    key={`inProcess_${index}`}
                    title={booking?.statusText}
                    pillStatus="inProcess"
                    date={booking?.date}
                    time={booking?.time}
                  />
                ))}
            </div>
          </div>

          {data?.data?.packages?.map((value, index) => (
            <>
              <div className="bg-white rounded-lg px-5 py-3 space-y-3">
                <div className="flex justify-between">
                  <div className="flex items-center gap-x-3">
                    <h2 className="text-black font-semibold ">
                      {t("pages.details.trackingNum")} {value?.trackingNum}
                    </h2>
                    {value?.arrived === "arrived" ? (
                      <div className="bg-statusGreenBg text-statusGreen p-1 text-xs">
                        {t("pages.details.statusReceived")}
                      </div>
                    ) : value?.arrived === "neverArrived" ? (
                      <div className="bg-[#EF233C1F] text-[#EF233C] p-1 text-xs">
                        {t("pages.details.statusNeverReceived")}
                      </div>
                    ) : (
                      <div className="bg-statusYellowBg text-statusYellow p-1 text-xs">
                        {t("pages.details.statusPending")}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(event) => {
                      const buttonText = event.target.textContent;
                      buttonText === t("pages.details.remeasureBtn")
                        ? openModal(value)
                        : info_toaster(
                            "You Have Already Measured the Dimensions of this Package"
                          );
                    }}
                    className={`border border-theme bg-theme p-2 rounded-md text-white text-sm  ${
                      value?.actualWeight === "0.00"
                        ? "bg-opacity-100 hover:text-theme hover:bg-transparent duration-200"
                        : "bg-opacity-40 border-opacity-0"
                    }`}
                    disabled={value?.actualWeight !== "0.00" ? true : false}
                  >
                    {value?.actualWeight === "0.00" ? (
                      <span>{t("pages.details.remeasureBtn")}</span>
                    ) : (
                      <span>{t("pages.details.alreadyMeasurebtn")}</span>
                    )}
                  </button>
                </div>

                <div className="flex xl:justify-between flex-wrap gap-5">
                  <div className="space-y-2">
                    <h2 className="text-sm text-tabColor">
                      {t("pages.details.companyName")}
                    </h2>
                    <p className="text-black capitalize">
                      {value?.ecommerceCompany?.title}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-sm text-tabColor">
                      {t("pages.details.name")}
                    </h2>
                    <p className="text-black">{value?.name}</p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-sm text-tabColor">
                      {t("pages.details.email")}
                    </h2>
                    <p className="text-black">{value?.email}</p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-sm text-tabColor">
                      {t("pages.details.phone")}
                    </h2>
                    <p className="text-black">{value?.phone}</p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-sm text-tabColor">
                      {t("pages.details.weight")} (lbs)
                    </h2>
                    <p className="text-black">
                      {value?.actualWeight === "0.00"
                        ? value?.weight
                        : value?.actualWeight}{" "}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-sm text-tabColor">
                      {t("pages.details.size")} (inches) <sup>3</sup>
                    </h2>
                    <p className="text-black">
                      {value?.actualHeight === "0.00" ||
                      value?.actualLength === "0.00" ||
                      value?.actualWidth === "0.00"
                        ? `${value?.length} x ${value?.width} x ${value?.height}`
                        : `${value?.actualHeight} x ${value?.actualWidth} x ${value?.actualLength}`}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-sm text-tabColor">
                      {t("pages.details.eta")}
                    </h2>
                    <p className="text-black">{value?.ETA}</p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-sm text-tabColor">
                      {t("pages.details.category")}
                    </h2>
                    <p className="text-black">{value?.category?.title}</p>
                  </div>

                  {/* <div className="flex gap-x-3">
                    <button className="bg-transparent border border-theme w-40 h-10 rounded-md text-theme text-sm hover:text-white hover:bg-theme duration-200">
                      Print Label
                    </button>
                    <button className="bg-transparent border border-theme w-40 h-10 rounded-md text-theme text-sm hover:text-white hover:bg-theme duration-200">
                      Mark Label
                    </button>
                  </div> */}
                </div>
              </div>
            </>
          ))}

          <Modal onClose={closeModal} isOpen={modal} isCentered size={"6xl"}>
            <ModalOverlay />
            <ModalContent bgColor="#F4F7FF">
              <ModalHeader padding={0}>
                <h2 className="text-theme py-2 px-4 text-xl">
                  {t("pages.modal.measurePack")}
                </h2>
              </ModalHeader>
              <ModalCloseButton
                color="white"
                bgColor="#00528C"
                border="1px solid #00528C"
                _hover={{ bgColor: "transparent", color: "#00528C" }}
              />
              {loader ? (
                <div className="h-[332px]">
                  <MiniLoader />
                </div>
              ) : (
                <ModalBody padding={0}>
                  <div className="py-2 px-4 space-y-3">
                    <h2 className="text-theme text-lg font-semibold ">
                      {t("pages.modal.packDet")}
                    </h2>

                    <div className="flex gap-x-5">
                      <p className="text-theme font-semibold">
                        {t("pages.modal.trackingNum")}:{" "}
                        <span className="text-menuColor">
                          {packageData?.trackingNum}
                        </span>
                      </p>
                      <p className="text-theme font-semibold">
                      {t("pages.modal.company")}:{" "}
                        <span className="text-menuColor capitalize">
                          {packageData?.ecommerceCompany?.title}
                        </span>
                      </p>
                    </div>

                    <div className="border p-5 space-y-3 bg-white rounded-md">
                      <ul className="grid grid-cols-6">
                        <li className="text-black font-semibold">{t("pages.modal.dimensions")}</li>
                        <li className="text-menuColor text-sm font-semibold">
                        {t("pages.modal.length")} (inches)
                        </li>
                        <li className="text-menuColor text-sm font-semibold">
                        {t("pages.modal.width")} (inches)
                        </li>
                        <li className="text-menuColor text-sm font-semibold">
                        {t("pages.modal.height")} (inches)
                        </li>
                        <li className="text-menuColor text-sm font-semibold">
                        {t("pages.modal.weight")} (lbs)
                        </li>
                        <li className="text-menuColor text-sm font-semibold">
                        {t("pages.modal.category")}
                        </li>
                      </ul>
                      <ul className="grid grid-cols-6">
                        <li className="text-black font-semibold">{t("pages.modal.captured")}</li>
                        <li className="text-menuColor text-sm font-semibold">
                          {packageData?.length}
                        </li>
                        <li className="text-menuColor text-sm font-semibold">
                          {packageData?.width}
                        </li>
                        <li className="text-menuColor text-sm font-semibold">
                          {packageData?.height}
                        </li>
                        <li className="text-menuColor text-sm font-semibold">
                          {packageData?.weight}
                        </li>
                        <li className="text-menuColor text-sm font-semibold">
                          {packageData?.category?.title}
                        </li>
                      </ul>
                      <div className="grid grid-cols-6">
                        <label className="text-black font-semibold">
                        {t("pages.modal.measured")}
                        </label>

                        <input
                          type="number"
                          className="bg-[#F4F4F4] w-36 px-2 py-1 outline-none"
                          name="actualLength"
                          onChange={handleInputEvent}
                          value={measureData.actualLength}
                        />
                        <input
                          type="number"
                          className="bg-[#F4F4F4] w-36 px-2 py-1 outline-none"
                          name="actualWidth"
                          onChange={handleInputEvent}
                          value={measureData.actualWidth}
                        />
                        <input
                          type="number"
                          className="bg-[#F4F4F4] w-36 px-2 py-1 outline-none"
                          name="actualHeight"
                          onChange={handleInputEvent}
                          value={measureData.actualHeight}
                        />
                        <input
                          type="number"
                          className="bg-[#F4F4F4] w-36 px-2 py-1 outline-none"
                          name="actualWeight"
                          onChange={handleInputEvent}
                          value={measureData.actualWeight}
                        />
                        <Select
                          value={measureData.category}
                          onChange={(e) =>
                            setMeasureData({ ...measureData, category: e })
                          }
                          options={options}
                          inputId="category"
                        />
                      </div>

                      <div className="flex justify-end ">
                        <button
                          className="flex items-center gap-x-2 font-medium text-base text-white bg-theme py-1.5 px-5 border border-theme rounded 
                                hover:bg-transparent hover:text-theme duration-200"
                          onClick={remeasurement}
                        >
                          {t("pages.modal.submit")}
                        </button>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              )}
            </ModalContent>
          </Modal>

          <div className="grid grid-cols-12 gap-5">
            <OrderDetailsCard
              trackingId={data?.data?.trackingId}
              senderName={data?.data?.senderDetails?.name}
              senderEmail={data?.data?.senderDetails?.email}
              senderPhone={data?.data?.senderDetails?.number}
              virtualBoxNum={data?.data?.senderDetails?.virtualBoxNumber}
              receiverName={data?.data?.receiverDetails?.name}
              receiverEmail={data?.data?.receiverDetails?.email}
              receiverPhone={data?.data?.receiverDetails?.number}
              consolidation={data?.data?.consolidation}
              totalPackages={data?.data?.packages.length}
              chargedWeight={data?.data?.chargedWeight}
              price={data?.data?.total}
            />
            <DeliveryDetailsCard
              pickupAddress={data?.data?.pickup?.address}
              dropoffAddress={data?.data?.dropoff?.address}
              orderInstruction={data?.data?.instructions}
              ricoAddress={data?.data?.ricoAddress?.address}
              deliveryType={data?.data?.deliveryType?.title}
            />
            <ShippingCompanyCard
              driverFirstName={data?.data?.deliveryDriver?.firstName}
              driverLastName={data?.data?.deliveryDriver?.lastName}
              driverEmail={data?.data?.deliveryDriver?.email}
              driverPhoneNumber={data?.data?.deliveryDriver?.phoneNum}
              driverCountryCode={data?.data?.deliveryDriver?.countryCode}
              driverJoinedOn={data?.data?.deliveryDriver?.joinedOn}
              driverImage={data?.data?.deliveryDriver?.image}
              consolidationStatus={location?.state?.consolidationStatus}
              logisticCompanyTrackingNum={
                location?.state?.consolidationStatus === "Yes"
                  ? data?.data?.logisticCompanyTrackingNum
                  : data?.data?.packages
              }
              bookingId={data?.data?.trackingId}
            />
          </div>
        </section>
      }
    />
  );
}
