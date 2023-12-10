// @ts-nocheck
import React, { useState } from "react";
import Layout from "../../Components/Layout";
import { useNavigate } from "react-router-dom";
import { info_toaster } from "../../Utilities/Toaster";
import { useTranslation } from "react-i18next";

export default function OrderTracking() {
  const [disabled, setDisabled] = useState(false);
  const [trackId, setTrackId] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const trackingFunc = async () => {
    setDisabled(true);
    if (trackId === "") {
      info_toaster("Please enter Tracking Id");
    } else {
      navigate("/booking-details", {
        state: {
          trackId: trackId,
        },
      });
    }
  };

  return (
    <Layout
      title={t("pages.orderTracking.title")}
      content={
        <>
          <div className="flex items-center">
            <input
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              type="search"
              name="trackingId"
              id="trackID"
              placeholder={t("pages.orderTracking.inputPlaceholder")}
              className="text-base font-normal rounded-l-md border border-transparent w-96 px-4 py-3 focus:outline-none"
            />
            <button
              onClick={trackingFunc}
              disabled={disabled}
              className="text-lg font-semibold text-white bg-theme rounded-r-md px-4 py-2.5 border border-theme hover:bg-transparent hover:text-theme duration-200"
            >
              {t("pages.orderTracking.button")}
            </button>
          </div>
        </>
      }
    />
  );
}
