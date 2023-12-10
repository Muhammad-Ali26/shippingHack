// @ts-nocheck
import React from "react";
import Layout from "../../Components/Layout";
import { BackButton } from "../../Utilities/Buttons";
import { useLocation } from "react-router-dom";
import GetAPI from "../../Utilities/GetAPI";
import Loader from "../../Components/Loader";
import DeliveryDetailsCard from "../../Components/DeliveryDetailsCard";
import OrderDetailsCard from "../../Components/OrderDetailsCard";
import ShippingCompanyCard from "../../Components/ShippingCompanyCard";
import { useTranslation } from "react-i18next";

export default function CompletedDetails() {
  const location = useLocation();
  const { data } = GetAPI(
    `warehouse/bookingdetails?id=${location?.state?.packageId}`
  );
  const { t } = useTranslation();

  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title={t("pages.completed.detailsTitle")}
      content={
        <section className="space-y-6">
          <div>
            <BackButton name={t("pages.details.backButton")} />
          </div>
          {data?.data?.packages?.map((value, index) => (
            <div className="bg-white rounded-lg px-5 py-3 space-y-2">
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

              <div className="flex xl:justify-between flex-wrap gap-5">
                <div className="space-y-2">
                  <h2 className="text-sm text-tabColor">{t("pages.details.companyName")}</h2>
                  <p className="text-black">{value?.ecommerceCompany?.title}</p>
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
                  <h2 className="text-sm text-tabColor">{t("pages.details.weight")}</h2>
                  <p className="text-black">{value?.weight} Kgs</p>
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
                  <h2 className="text-sm text-tabColor">{t("pages.details.eta")}</h2>
                  <p className="text-black">{value?.ETA}</p>
                </div>
                <div className="space-y-2">
                  <h2 className="text-sm text-tabColor">{t("pages.details.category")}</h2>
                  <p className="text-black">{value?.category?.title}</p>
                </div>
              </div>
            </div>
          ))}

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
