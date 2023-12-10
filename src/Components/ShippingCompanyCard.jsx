import React from "react";
import { BASE_URL } from "../Utilities/URL";
import { useTranslation } from "react-i18next";

export default function ShippingCompanyCard(props) {
  const { t } = useTranslation();
  return (
    <div className="xl:row-span-3 2xl:col-span-4 xl:col-span-6 col-span-12 border border-borderColor  text-black py-8 px-10 rounded-lg space-y-6">
      <div className="space-y-4">
        <h1 className="font-medium text-2xl flex items-center gap-x-5">
          <span>{t("pages.shippingDetails.title")}</span>
        </h1>
        <div className="border border-borderColor rounded-lg p-5 flex gap-x-5 items-center">
          <img
            src="/images/tracking.webp"
            alt="tracking"
            className="w-10 h-10"
          />

          <div>
            <h4 className="text-black font-medium">
              {t("pages.shippingDetails.trackingNum")}
            </h4>
            {props.consolidationStatus === "Yes" ? (
              <p className="text-sm text-menuColor">
                The Tracking Number of Booking {props.bookingId} is{" "}
                {props.logisticCompanyTrackingNum
                  ? props.logisticCompanyTrackingNum
                  : "N/A"}
              </p>
            ) : (
              props.logisticCompanyTrackingNum.map((trackingNum, index) => (
                <div key={index}>
                  <p className="text-sm text-menuColor">
                    The Tracking Number of Package {trackingNum?.id} is{" "}
                    {trackingNum?.logisticCompanyTrackingNum
                      ? trackingNum?.logisticCompanyTrackingNum
                      : "N/A"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="font-medium text-2xl flex items-center gap-x-5">
          <span>{t("pages.shippingDetails.driver")}</span>
        </h1>
        <div className="flex gap-x-5 items-center">
          <img
            src={`${BASE_URL}${props.driverImage}`}
            alt="Profile"
            className="w-20 h-20"
          />

          <div>
            <h4 className="text-black font-medium">
              {t("pages.shippingDetails.driverName")}:{" "}
              {props.driverFirstName && props.driverLastName
                ? `${props.driverFirstName}${props.driverLastName}`
                : "N/A"}
            </h4>
            <p className="text-sm text-menuColor">
              {t("pages.shippingDetails.memberSince")}:{" "}
              {props.driverJoinedOn ? props.driverJoinedOn : "N/A"}
            </p>
            <p className="text-sm text-menuColor">
              {t("pages.shippingDetails.order")}#{" "}
              {props.driverOrderNum ? props.driverOrderNum : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <h4 className="text-menuColor font-medium">
            {" "}
            {t("pages.shippingDetails.driverEmail")}
          </h4>
          <p className="text-sm">
            {props.driverEmail ? props.driverEmail : "N/A"}
          </p>
        </div>
        <div>
          <h4 className="text-menuColor font-medium">
            {" "}
            {t("pages.shippingDetails.driverPhone")}
          </h4>
          <p className="text-sm">
            {props.driverPhoneNumber && props.driverCountryCode
              ? `${props.driverCountryCode}${props.driverPhoneNumber}`
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
