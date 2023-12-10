// @ts-nocheck
import React from "react";
import Layout from "../../Components/Layout";
import { BackButton } from "../../Utilities/Buttons";
import { useLocation } from "react-router-dom";
import GetAPI from "../../Utilities/GetAPI";
import Loader, { MiniLoader } from "../../Components/Loader";
import StatusPill from "../../Components/StatusPill";
import DeliveryDetailsCard from "../../Components/DeliveryDetailsCard";
import OrderDetailsCard from "../../Components/OrderDetailsCard";
import ShippingCompanyCard from "../../Components/ShippingCompanyCard";
import { PostAPI } from "../../Utilities/PostAPI";
import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../Utilities/Toaster";
import { useTranslation } from "react-i18next";

export default function ReadyToShipDetails() {
  const location = useLocation();
  const { data, reFetch } = GetAPI(
    `warehouse/bookingdetails?id=${location?.state?.packageId}`
  );

  const [modal, setModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [bookingId, setBookingId] = useState();
  const [trackingNum, setTrackingNum] = useState("");
  const { t } = useTranslation();

  const openModal = (bookingId) => {
    setBookingId(bookingId);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const addTrackingNum = async () => {
    if (location?.state?.consolidationStatus === "Yes") {
      if (trackingNum === "") {
        info_toaster("Please Add Tracking Number");
      } else {
        setLoader(true);
        const res = await PostAPI("warehouse/tracking-on-booking", {
          bookingId: bookingId,
          trackingNum: trackingNum,
        });
        if (res?.data?.status === "1") {
          reFetch();
          setLoader(false);
          setModal(false);
          success_toaster(res?.data?.message);
        } else {
          setLoader(false);
          error_toaster(res?.data?.message);
        }
      }
    } else {
      if (trackingNum === "") {
        info_toaster("Please Add Tracking Number");
      } else {
        setLoader(true);
        const res = await PostAPI("warehouse/tracking-on-parcel", {
          parcelId: bookingId,
          trackingNum: trackingNum,
        });
        if (res?.data?.status === "1") {
          reFetch();
          setLoader(false);
          setModal(false);
          success_toaster(res?.data?.message);
        } else {
          setLoader(false);
          error_toaster(res?.data?.message);
        }
      }
    }
  };

  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title={t("pages.readyToShip.detailsTitle")}
      search={false}
      content={
        <section className="space-y-6">
          <div className="flex justify-between">
            <BackButton name={t("pages.details.backButton")}/>
            {location?.state?.consolidationStatus === "Yes" ? (
              <button
                className="flex items-center gap-x-2 font-medium text-base text-white bg-theme py-2.5 px-5 border border-theme rounded hover:bg-transparent
              hover:text-theme duration-200"
                onClick={(e) => {
                  openModal(data?.data?.bookingId);
                }}
              >
                {t("pages.readyToShip.addTrackNo")}
              </button>
            ) : (
              ""
            )}
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
            <div className="bg-white rounded-lg px-5 py-3 space-y-2">
              <div className="flex justify-between">
                <div className="flex gap-x-3">
                  <h2 className="text-black font-semibold ">
                  {t("pages.details.trackingNum")} {value?.trackingNum}
                  </h2>
                  {value?.arrived === "arrived" ? (
                    <div className="bg-statusGreenBg text-statusGreen text-xs w-20 h-7 flex justify-center items-center">
                     {t("pages.details.statusReceived")}
                    </div>
                  ) : value?.arrived === "neverArrived" ? (
                    <div className="bg-[#EF233C1F] text-[#EF233C] p-1 text-xs flex justify-center items-center">
                      {t("pages.details.statusNeverReceived")}
                    </div>
                  ) : (
                    <div className="bg-statusYellowBg text-statusYellow p-1 text-xs flex justify-center items-center">
                      {t("pages.details.statusPending")}
                    </div>
                  )}
                </div>

                {location?.state?.consolidationStatus === "No" ? (
                  <div className="flex justify-end">
                    <button
                      className="flex items-center gap-x-2 font-medium text-base text-white bg-theme py-2 px-5 border border-theme rounded hover:bg-transparent
                      hover:text-theme duration-200"
                      onClick={(e) => {
                        openModal(value?.id);
                      }}
                    >
                      {t("pages.readyToShip.addTrackNo")}
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className="flex xl:justify-between flex-wrap gap-5">
                <div className="space-y-2">
                  <h2 className="text-sm text-tabColor">{t("pages.details.companyName")}</h2>
                  <p className="text-black capitalize">
                    {value?.ecommerceCompany?.title}
                  </p>
                </div>
                <div className="space-y-2">
                  <h2 className="text-sm text-tabColor">{t("pages.details.name")}</h2>
                  <p className="text-black">{value?.name}</p>
                </div>
                <div className="space-y-2">
                  <h2 className="text-sm text-tabColor">{t("pages.details.email")}</h2>
                  <p className="text-black">{value?.email}</p>
                </div>
                <div className="space-y-2">
                  <h2 className="text-sm text-tabColor">{t("pages.details.phone")}</h2>
                  <p className="text-black">{value?.phone}</p>
                </div>
                <div className="space-y-2">
                  <h2 className="text-sm text-tabColor">{t("pages.details.weight")} (lbs)</h2>
                  <p className="text-black">
                    {value?.actualWidth === "0.00"
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
                  <h2 className="text-sm text-tabColor">{t("pages.details.eta")}</h2>
                  <p className="text-black">{value?.ETA}</p>
                </div>
                <div className="space-y-2">
                  <h2 className="text-sm text-tabColor">{t("pages.details.category")}</h2>
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
          ))}

          <Modal onClose={closeModal} isOpen={modal} isCentered size={"xl"}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <h2 className="text-theme py-2 px-4 text-xl text-center">
                {t("pages.readyToShip.addTrackNo")}
                </h2>
              </ModalHeader>
              <ModalCloseButton
                color="white"
                bgColor="#00528C"
                border="1px solid #00528C"
                _hover={{ bgColor: "transparent", color: "#00528C" }}
              />
              {loader ? (
                <div className="h-[218px]">
                  <MiniLoader />
                </div>
              ) : (
                <ModalBody>
                  <div className="space-y-3">
                    <label className="text-theme font-semibold">
                    {t("pages.readyToShip.label")}
                    </label>

                    <input
                      type="text"
                      className="bg-gray-100 w-full px-2.5 py-1 outline-none rounded-sm"
                      name="trackingNum"
                      onChange={(e) => setTrackingNum(e.target.value)}
                    />

                    <div className="flex justify-end pt-2">
                      <button
                        className="flex items-center gap-x-2 font-medium text-base text-white bg-theme py-1.5 px-5 border border-theme rounded 
                                hover:bg-transparent hover:text-theme duration-200"
                        onClick={addTrackingNum}
                      >
                        {t("pages.readyToShip.addBtn")}
                      </button>
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
