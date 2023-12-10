// @ts-nocheck
import React from "react";
import Layout from "../../Components/Layout";
import { BackButton } from "../../Utilities/Buttons";
import { useLocation } from "react-router-dom";
import Loader from "../../Components/Loader";
import StatusPill from "../../Components/StatusPill";
import DeliveryDetailsCard from "../../Components/DeliveryDetailsCard";
import OrderDetailsCard from "../../Components/OrderDetailsCard";
import ShippingCompanyCard from "../../Components/ShippingCompanyCard";
import GetAPI from "../../Utilities/GetAPI";
import Select from "react-select";
import { error_toaster, success_toaster } from "../../Utilities/Toaster";
import { PutAPI } from "../../Utilities/PutAPI";
import { useTranslation } from "react-i18next";

export default function BookingDetails() {
  const location = useLocation();
  const trackId = location?.state?.trackId;
  const { data, reFetch } = GetAPI(`warehouse/bookingdetails?s=${trackId}`);
  const statuses = GetAPI("warehouse/all-booking-statuses");
  const { t } = useTranslation();

  const allStatus = [];
  statuses?.data?.data?.map((status, index) => {
    return allStatus.push({
      value: status?.id,
      label: status?.title,
    });
  });

  const changeStatusFunc = async (bookingStatusId) => {
    let res = await PutAPI("warehouse/update-booking-status", {
      bookingId: data?.data?.bookingId,
      bookingStatusId: bookingStatusId,
    });
    if (res?.data?.status === "1") {
      success_toaster(res?.data?.message);
      reFetch();
    } else {
      error_toaster(res?.data?.message);
    }
  };

  return data?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title={t("pages.orderTracking.trackOrderDetTitle")}
      search={false}
      content={
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <BackButton name={t("pages.details.backButton")} />
            </div>
            <div className="flex items-center gap-x-6">
              <div className="flex items-center gap-x-3">
                <h4 className="font-medium text-xl text-theme">
                  {t("pages.orderTracking.status")}:
                </h4>
                <div className="font-semibold text-lg text-white bg-theme border border-theme py-2 px-4 rounded">
                  {data?.data?.bookingStatus &&
                    data?.data?.bookingStatus?.title}
                </div>
              </div>
              <div className="w-80 inner">
                <Select
                  onChange={(e) => changeStatusFunc(e.value)}
                  options={allStatus}
                  inputId="dbs"
                  placeholder={t("pages.orderTracking.statusPh")}
                />
              </div>
            </div>
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
