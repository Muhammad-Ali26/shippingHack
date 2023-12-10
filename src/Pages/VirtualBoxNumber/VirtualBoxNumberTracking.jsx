// @ts-nocheck
import React, { useState } from "react";
import Layout from "../../Components/Layout";
import { useNavigate } from "react-router-dom";
import { info_toaster } from "../../Utilities/Toaster";
import { useTranslation } from "react-i18next";

export default function VirtualBoxNumberTracking() {
  const [disabled, setDisabled] = useState(false);
  const [virtualBoxNum, setVirtualBoxNum] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const trackingFunc = async () => {
    setDisabled(true);
    if (virtualBoxNum === "") {
      info_toaster("Please enter Virtual Box Number");
    } else {
      navigate("/virtualbox-number-details", {
        state: {
          virtualBoxNumber: virtualBoxNum,
        },
      });
    }
  };

  return (
    <Layout
      title={t("pages.trackVbn.title")}
      content={
        <>
          <div className="flex items-center">
            <input
              value={virtualBoxNum}
              onChange={(e) => setVirtualBoxNum(e.target.value)}
              type="search"
              name="trackingId"
              id="trackID"
              placeholder={t("pages.trackVbn.inputPlaceholder")}
              className="text-base font-normal rounded-l-md border border-transparent w-96 px-4 py-3 focus:outline-none"
            />
            <button
              onClick={trackingFunc}
              disabled={disabled}
              className="text-lg font-semibold text-white bg-theme rounded-r-md px-4 py-2.5 border border-theme hover:bg-transparent hover:text-theme duration-200"
            >
              {t("pages.trackVbn.button")}
            </button>
          </div>
        </>
      }
    />
  );
}
