// @ts-nocheck
import React, { useEffect, useState } from "react";
import Layout from "../../Components/Layout";
import DataTable from "react-data-table-component";
import primaryStyles from "../../Utilities/CustomStyles";
import Loader from "../../Components/Loader";
import { TabButton } from "../../Utilities/Buttons";
import axios from "axios";
import { BASE_URL } from "../../Utilities/URL";
import { PostAPI } from "../../Utilities/PostAPI";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../Utilities/Toaster";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SelfPickup() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("Waiting");
  const [data, setData] = useState("");
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);

  const viewDetails = (bookingId) => {
    if (tab === "Waiting") {
      navigate("/self-pickup-details", {
        state: {
          bookingId: bookingId,
        },
      });
    } else {
      navigate("/picked-by-customer-details", {
        state: {
          bookingId: bookingId,
        },
      });
    }
  };

  const handOver = async (id) => {
    setLoader(true);
    setDisabled(true);
    const res = await PostAPI("warehouse/selfpickupdelivered", {
      bookingId: id,
    });
    if (res?.data?.status === "1") {
      reFetch();
      setDisabled(false);
      setLoader(false);
      success_toaster(res?.data?.message);
    } else {
      setLoader(false);
      setDisabled(false);
      error_toaster(res?.data?.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      };

      try {
        let response;
        if (tab === "Waiting") {
          setData("");
          response = await axios.get(
            BASE_URL + "warehouse/bookings?deliveryType=2&bookingStatus=20",
            config
          );
        } else {
          setData("");
          response = await axios.get(
            BASE_URL + "warehouse/bookings?deliveryType=2&bookingStatus=21",
            config
          );
        }

        setData(response?.data);
      } catch (err) {
        console.error("Error in request:", err);
      }
    };

    fetchData();
  }, [tab]);

  const reFetch = async () => {
    var config = {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    };
    try {
      let response;
      if (tab === "Waiting") {
        response = await axios.get(
          BASE_URL + "warehouse/bookings?deliveryType=2&bookingStatus=20",
          config
        );
      } else {
        response = await axios.get(
          BASE_URL + "warehouse/bookings?deliveryType=2&bookingStatus=21",
          config
        );
      }
      setData(response?.data);
    } catch (err) {
      info_toaster(err);
    }
  };

  const SelfPickupData = () => {
    const filteredData = data?.data?.filter((dat) => {
      return (
        search === "" ||
        (dat?.bookingData?.trackingId &&
          dat?.bookingData?.trackingId
            .toLowerCase()
            .includes(search.toLowerCase())) ||
        (dat?.bookingData?.virtualBoxNumber &&
          dat?.bookingData?.virtualBoxNumber
            .toLowerCase()
            .includes(search.toLowerCase())) ||
        (dat?.bookingData?.receivingWarehouse &&
          dat?.bookingData?.receivingWarehouse
            .toLowerCase()
            .includes(search.toLowerCase())) ||
        (dat?.bookingData?.deliveryWarehouse &&
          dat?.bookingData?.deliveryWarehouse
            .toLowerCase()
            .includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  function getDateFromTimestamp(timestamp) {
    const dateObject = new Date(timestamp);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }

  const columns = [
    {
      name: "#",
      selector: (row) => row.serialNo,
    },
    {
      name: t("pages.tableData.bookingId"),
      selector: (row) => row.bookingId,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.virtualBoxNum"),
      selector: (row) => row.virtualBoxNumber,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.deliveryWarehouse"),
      selector: (row) => row.deliveryWarehouse,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.receivingWarehouse"),
      selector: (row) => row.receivingWarehouse,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.consolidation"),
      selector: (row) => row.consolidation,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.date"),
      selector: (row) => row.date,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.receivedPack"),
      selector: (row) => row.quantity,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.address"),
      selector: (row) => row.dropoffAddress,
      minWidth: "350px",
    },
    {
      name: t("pages.tableData.status"),
      selector: (row) => row.status,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.action"),
      selector: (row) => row.action,
      minWidth: "250px",
    },
  ];

  const datas = [];
  SelfPickupData()?.map((value, index) => {
    return datas.push({
      serialNo: index + 1,
      bookingId: value?.bookingData?.trackingId,
      virtualBoxNumber: value?.bookingData?.virtualBoxNumber,
      deliveryWarehouse: value?.bookingData?.deliveryWarehouse,
      receivingWarehouse: value?.bookingData?.receivingWarehouse,
      date: getDateFromTimestamp(value?.bookingData?.date),
      consolidation: value?.bookingData?.consolidation,
      dropoffAddress:
        value?.dropoffAddress &&
        `${value?.dropoffAddress?.streetAddress}, ${value?.dropoffAddress?.district}, ${value?.dropoffAddress?.province}`,
      quantity: `${value?.packages?.arrived} / ${value?.packages?.total}`,
      status: (
        <div className="bg-statusYellowBg p-2 text-statusYellow">
          {value?.bookingStatus}
        </div>
      ),
      action: (
        <div className="flex flex-col gap-y-2 py-2">
          {tab === "Waiting" ? (
            <button
              className="text-white bg-theme text-sm font-semibold border border-theme rounded-md px-6 py-2 hover:bg-transparent hover:text-theme duration-200"
              onClick={(e) => handOver(value?.bookingData?.id)}
              disabled={disabled}
            >
              {t("pages.tableData.handedOverBtn")}
            </button>
          ) : (
            ""
          )}

          <button
            className="text-theme text-sm font-semibold border border-theme rounded-md px-6 py-2 hover:bg-theme hover:text-white duration-200"
            onClick={(e) => viewDetails(value?.bookingData?.id)}
          >
            {t("pages.tableData.viewDet")}
          </button>
        </div>
      ),
    });
  });

  return data.length === 0 || loader === true ? (
    <Loader />
  ) : (
    <Layout
      title={t("pages.selfPickup.title")}
      search={true}
      searchOnChange={(e) => setSearch(e.target.value)}
      searchValue={search}
      content={
        <div className="space-y-2">
          <TabButton
            text={["Waiting", "Picked By Customer"]}
            set={setTab}
            tab={tab}
          />
          <div className="pt-5">
            <DataTable
              theme="myTheme"
              customStyles={primaryStyles}
              columns={columns}
              data={datas}
              pagination
            />
          </div>
        </div>
      }
    />
  );
}
