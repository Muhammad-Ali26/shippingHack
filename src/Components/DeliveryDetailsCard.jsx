import React from "react";
import { useTranslation } from "react-i18next";
import { TbTruckDelivery } from "react-icons/tb";

export default function DeliveryDetailsCard(props) {
  const { t } = useTranslation();
  return (
    <div className="xl:row-span-3 2xl:col-span-4 xl:col-span-6 col-span-12 border border-borderColor  text-black py-8 px-10 rounded-lg space-y-12">
      <div className="space-y-4">
        <h1 className="font-medium text-2xl flex items-center gap-x-5">
          <TbTruckDelivery size={32} className="text-theme" />
          <span>{t("pages.deliveryDetails.title")}</span>
        </h1>
        <div className="flex gap-x-5 relative">
          <div className="flex flex-col items-center">
            <div className="w-fit border border-themeOrange rounded-full p-1">
              <div className="w-4 h-4 rounded-full bg-themeOrange"></div>
            </div>

            <img src="/images/line.webp" alt="line" className="h-16" />
            <div className="w-fit border border-themeOrange p-1">
              <div className="w-4 h-4 bg-themeOrange"></div>
            </div>
            {props.ricoAddress ? (
              <>
                <img src="/images/line.webp" alt="line" className="h-16" />
                <div className="w-fit border border-themeOrange rounded-full p-1">
                  <div className="w-4 h-4 rounded-full bg-themeOrange"></div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>

          <div className="flex flex-col gap-y-6">
            <div>
              <div className="flex justify-between items-center">
                <p className="font-medium">
                  {t("pages.deliveryDetails.pickup")}
                </p>
                <p className="text-menuColor text-sm">10:00 AM</p>
              </div>
              <p className="text-menuColor text-sm">
                {props.pickupAddress ? props.pickupAddress : "N/A"}
              </p>
            </div>

            {props.ricoAddress ? (
              <div>
                <p className="font-medium">
                  {t("pages.deliveryDetails.receivingWarehouse")}
                </p>
                <p className="text-menuColor text-sm">{props.ricoAddress}</p>
              </div>
            ) : (
              ""
            )}

            <div>
              <p className="font-medium">
                {t("pages.deliveryDetails.dropOff")}
              </p>
              <p className="text-menuColor text-sm">
                {props.dropoffAddress ? props.dropoffAddress : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-2xl text-black font-medium">
          {t("pages.details.deliveryType")}
          </h4>
          <p className="text-menuColor capitalize">
          {props.deliveryType ? props.deliveryType : "N/A"}
          </p>
        </div>
        <div>
          <h4 className="text-2xl text-black font-medium">
            {t("pages.deliveryDetails.instruction")}
          </h4>
          <p className="text-menuColor capitalize">
            {props.orderInstruction ? props.orderInstruction : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
