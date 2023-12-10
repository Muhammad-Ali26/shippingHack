import React from "react";
import { useTranslation } from "react-i18next";

export default function OrderDetailsCard(props) {
  const { t } = useTranslation();
  return (
    <div className="xl:row-span-3 2xl:col-span-4 xl:col-span-6 col-span-12 text-black  border border-borderColor py-8 px-10 rounded-lg space-y-6">
      <h1 className="font-medium text-2xl">
        {t("pages.orderDetails.order")}#
        <span className="text-black text-opacity-60 ml-2">
          {props.trackingId ? props.trackingId : "N/A"}
        </span>
      </h1>
      <div className="space-y-4">
        <h1 className="font-medium text-2xl">
          {t("pages.orderDetails.senderDetails")}
        </h1>
        <div className="space-y-2">
          <h5 className="font-semibold text-xl text-theme">
            {props.senderName && props.senderName !== undefined
              ? props.senderName
              : "N/A"}
          </h5>
          <div>
            <span className="font-normal text-sm text-black text-opacity-60">
              {t("pages.orderDetails.senderEmail")}
            </span>
            <p className="font-normal text-base">
              {props.senderEmail ? props.senderEmail : "N/A"}
            </p>
          </div>
          <div>
            <span className="font-normal text-sm text-black text-opacity-60">
              {t("pages.orderDetails.senderPhone")}
            </span>
            <p className="font-normal text-base">
              {props.senderPhone ? props.senderPhone : "N/A"}
            </p>
          </div>
          <div>
            <span className="font-normal text-sm text-black text-opacity-60">
              {t("pages.orderDetails.senderVbn")}
            </span>
            <p className="font-normal text-base">
              {props.virtualBoxNum ? props.virtualBoxNum : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="font-medium text-2xl">
          {t("pages.orderDetails.receiverDetails")}
        </h1>
        <div className="space-y-2">
          <h5 className="font-semibold text-xl text-theme">
            {props.receiverName && props.receiverName !== undefined
              ? props.receiverName
              : "N/A"}
          </h5>
          <div>
            <span className="font-normal text-sm text-black text-opacity-60">
              {t("pages.orderDetails.receiverEmail")}
            </span>
            <p className="font-normal text-base">
              {props.receiverEmail ? props.receiverEmail : "N/A"}
            </p>
          </div>
          <div>
            <span className="font-normal text-sm text-black text-opacity-60">
              {t("pages.orderDetails.receiverPhone")}
            </span>
            <p className="font-normal text-base">
              {props.receiverPhone ? props.receiverPhone : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="font-medium text-2xl">
          {t("pages.orderDetails.paymentDetails")}
        </h1>
        <div className="space-y-2">
          <div>
            <span className="font-normal text-sm text-black text-opacity-60">
              {t("pages.orderDetails.consolidation")}
            </span>
            <p className="font-normal text-base">
              {props.consolidation ? "Yes" : "No"}
            </p>
          </div>
          <div>
            <span className="font-normal text-sm text-black text-opacity-60">
              {t("pages.orderDetails.noOfPackages")}
            </span>
            <p className="font-normal text-base">{props.totalPackages}</p>
          </div>
          <div>
            <span className="font-normal text-sm text-black text-opacity-60">
              {t("pages.orderDetails.billableWeight")}
            </span>
            <p className="font-normal text-base">
              {props.chargedWeight ? `${props.chargedWeight} lbs` : "N/A"}
            </p>
          </div>
          <div>
            <span className="font-normal text-sm text-black text-opacity-60">
              {t("pages.orderDetails.price")}
            </span>
            <p className="font-normal text-base">
              {props.price ? `${props.price} $` : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
