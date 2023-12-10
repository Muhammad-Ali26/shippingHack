// @ts-nocheck
import React from "react";
import Layout from "../../Components/Layout";
import { BackButton } from "../../Utilities/Buttons";
import { useLocation } from "react-router-dom";
import GetAPI from "../../Utilities/GetAPI";
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

export default function AwaitingConsolidationDetails() {
  const location = useLocation();
  const { t } = useTranslation();
  const { data, reFetch } = GetAPI(
    `warehouse/bookingdetails?id=${location?.state?.packageId}`
  );

  const [modal, setModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [bookingId, setBookingId] = useState();

  const openModal = (bookingId) => {
    setBookingId(bookingId);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const [measureData, setMeasureData] = useState({
    id: bookingId,
    weight: "",
    length: "",
    width: "",
    height: "",
    volume: "",
  });

  const handleInputEvent = (e) => {
    setMeasureData({ ...measureData, [e.target.name]: e.target.value });
  };

  const remeasurement = async () => {
    if (measureData.height === "") {
      info_toaster("Please Enter Package Height");
    } else if (measureData.length === "") {
      info_toaster("Please Enter Package Length");
    } else if (measureData.weight === "") {
      info_toaster("Please Enter Package Weight");
    } else if (measureData.width === "") {
      info_toaster("Please Enter Package Width");
    } else {
      setLoader(true);
      const res = await PostAPI("warehouse/consolidateMeasurement", {
        id: bookingId,
        weight: measureData.weight,
        length: measureData.length,
        width: measureData.width,
        height: measureData.height,
        volume: measureData.height * measureData.width * measureData.length,
      });

      if (res?.data?.status === "1") {
        reFetch();
        setLoader(false);
        success_toaster(res?.data?.message);
        setModal(false);
        setMeasureData({
          id: "",
          weight: "",
          length: "",
          width: "",
          height: "",
          volume: "",
        });
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };

  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title={t("pages.details.awaitingConsolidationTitle")}
      search={false}
      content={
        <section className="space-y-6">
          <div className="flex justify-between">
            <BackButton name={t("pages.details.backButton")} />

            <button
              onClick={() => {
                openModal(data?.data?.bookingId);
              }}
              className={`border border-theme bg-theme p-2 rounded-md text-white text-sm  ${
                data?.data?.bookingStatus?.id === 8
                  ? "bg-opacity-40 border-opacity-0"
                  : "bg-opacity-100 hover:text-theme hover:bg-transparent duration-200"
              }`}
              disabled={data?.data?.bookingStatus?.id === 8 ? true : false}
            >
              {data?.data?.bookingStatus?.id === 8
                ? t("pages.details.alreadyMeasurebtn")
                : t("pages.details.remeasureBtn")}
            </button>
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

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-theme">
              {t("pages.modal.consMeasurments")}
            </h2>
            <div className="flex gap-1">
              <h4>{t("pages.details.size")} :</h4>
              <p className="text-menuColor">
                {data?.data?.measurements?.length
                  ? data?.data?.measurements?.length
                  : "0.00"}{" "}
                x{" "}
                {data?.data?.measurements?.width
                  ? data?.data?.measurements?.width
                  : "0.00"}{" "}
                x{" "}
                {data?.data?.measurements?.height
                  ? data?.data?.measurements?.height
                  : "0.00"}{" "}
                (inches) <sup>3</sup>
              </p>
            </div>
            <div className="flex gap-1">
              <h4>{t("pages.details.weight")} :</h4>
              <p className="text-menuColor">
                {data?.data?.measurements?.weight
                  ? data?.data?.measurements?.weight
                  : "0.00"}{" "}
                (lbs)
              </p>
            </div>
          </div>

          {data?.data?.packages?.map((value, index) => (
            <>
              <div className="bg-white rounded-lg px-5 py-3 space-y-3">
                <div className="flex justify-between">
                  <div className="flex gap-x-3">
                    <h2 className="text-black font-semibold ">
                      {t("pages.details.trackingNum")}
                      {value?.trackingNum}
                    </h2>
                    {value?.arrived === "arrived" ? (
                      <div className="bg-statusGreenBg text-statusGreen w-20 h-7 flex justify-center items-center text-xs">
                        {t("pages.details.statusReceived")}
                      </div>
                    ) : value?.arrived === "neverArrived" ? (
                      <div className="bg-[#EF233C1F] text-[#EF233C] w-20 h-7 flex justify-center items-center text-xs">
                        {t("pages.details.statusNeverReceived")}
                      </div>
                    ) : (
                      <div className="bg-statusYellowBg text-statusYellow w-20 h-7 flex justify-center items-center text-xs">
                        {t("pages.details.statusPending")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex xl:justify-between flex-wrap gap-5">
                  <div className="space-y-2">
                    <h2 className="text-sm text-tabColor">
                      {" "}
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
                    <p className="text-black">{value?.weight} </p>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-sm text-tabColor">
                      {t("pages.details.size")} (inches) <sup>3</sup>
                    </h2>
                    <p className="text-black">
                      {value?.length} x {value?.width} x {value?.height}
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
                  {t("pages.modal.remeasureTitle")}
                </h2>
              </ModalHeader>
              <ModalCloseButton
                color="white"
                bgColor="#00528C"
                border="1px solid #00528C"
                _hover={{ bgColor: "transparent", color: "#00528C" }}
              />
              {loader ? (
                <div className="h-[252px]">
                  <MiniLoader />
                </div>
              ) : (
                <ModalBody padding={0}>
                  <div className="py-2 px-4 my-4">
                    <div className="border p-5 space-y-3 bg-white rounded-md">
                      <ul className="grid grid-cols-5">
                        <li className="text-black font-semibold">
                          {t("pages.modal.dimensions")}
                        </li>
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
                      </ul>
                      <div className="grid grid-cols-5">
                        <label className="text-black font-semibold">
                          {t("pages.modal.measured")}
                        </label>

                        <input
                          type="number"
                          className="bg-[#F4F4F4] w-40 px-2 py-1 outline-none"
                          name="length"
                          onChange={handleInputEvent}
                          value={measureData.length}
                        />
                        <input
                          type="number"
                          className="bg-[#F4F4F4] w-40 px-2 py-1 outline-none"
                          name="width"
                          onChange={handleInputEvent}
                          value={measureData.width}
                        />
                        <input
                          type="number"
                          className="bg-[#F4F4F4] w-40 px-2 py-1 outline-none"
                          name="height"
                          onChange={handleInputEvent}
                          value={measureData.height}
                        />
                        <input
                          type="number"
                          className="bg-[#F4F4F4] w-40 px-2 py-1 outline-none"
                          name="weight"
                          onChange={handleInputEvent}
                          value={measureData.weight}
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
