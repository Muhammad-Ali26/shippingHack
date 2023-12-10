// @ts-nocheck
import React, { useEffect, useState } from "react";
import Layout from "../../Components/Layout";
import DataTable from "react-data-table-component";
import primaryStyles from "../../Utilities/CustomStyles";
import Loader from "../../Components/Loader";
import { TabButton } from "../../Utilities/Buttons";
import axios from "axios";
import { BASE_URL } from "../../Utilities/URL";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AllOrders() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("Incoming");
  const [data, setData] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      };

      try {
        let response;
        if (tab === "Incoming") {
          setData("");
          response = await axios.get(
            BASE_URL + "warehouse/bookings?bookingStatus=1,2,3,4,5,6",
            config
          );
        } else if (tab === "Received/ pending label") {
          setData("");
          response = await axios.get(
            BASE_URL + "warehouse/bookings?consolidation=0&bookingStatus=7",
            config
          );
        } else if (tab === "Awaiting Consolidation") {
          setData("");
          response = await axios.get(
            BASE_URL + "warehouse/bookings?consolidation=1&bookingStatus=7",
            config
          );
        } else {
          setData("");
          response = await axios.get(
            BASE_URL + "warehouse/bookings?bookingStatus=8,9",
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

  const readyToShipData = () => {
    const filteredData = data?.data?.filter((dat) => {
      return (
        search === "" ||
        (dat?.bookingData?.trackingId &&
          dat?.bookingData?.trackingId
            .toLowerCase()
            .includes(search.toLowerCase())) ||
        (dat?.bookingData?.virtualBoxNumber &&
          dat?.bookingData.virtualBoxNumber
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

  const viewDetails = (id) => {
    if (tab === "Incoming") {
      navigate("/incoming-details", {
        state: {
          packageId: id,
        },
      });
    } else if (tab === "Received/ pending label") {
      navigate("/pending-label-details", {
        state: {
          packageId: id,
        },
      });
    } else if (tab === "Awaiting Consolidation") {
      navigate("/awaiting-consolidation-details", {
        state: {
          packageId: id,
        },
      });
    } else {
      navigate("/pending-payment-details", {
        state: {
          packageId: id,
        },
      });
    }
  };

  var columns = [
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
      name: t("pages.tableData.CreatedAt"),
      selector: (row) => row.date,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.receivedPack"),
      selector: (row) => row.quantity,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.action"),
      selector: (row) => row.action,
      minWidth: "250px",
    },
  ];

  const datas = [];
  readyToShipData()?.map((value, index) => {
    return datas.push({
      serialNo: index + 1,
      bookingId: value?.bookingData?.trackingId,
      virtualBoxNumber: value?.bookingData?.virtualBoxNumber,
      receivingWarehouse: value?.bookingData?.receivingWarehouse,
      consolidation: value?.bookingData?.consolidation,
      date: getDateFromTimestamp(value?.bookingData?.date),
      quantity: `${value?.packages?.arrived} / ${value?.packages?.total}`,
      status: (
        <div className="bg-statusYellowBg p-2 text-statusYellow">
          {value?.bookingStatus}
        </div>
      ),
      action: (
        <button
          className="text-theme text-sm font-semibold border border-theme rounded-md px-6 py-2 hover:bg-theme hover:text-white duration-200"
          onClick={(e) => {
            viewDetails(value?.bookingData?.id);
          }}
        >
          {t("pages.tableData.viewDet")}
        </button>
      ),
    });
  });

  function getDateFromTimestamp(timestamp) {
    const dateObject = new Date(timestamp);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }

  return data?.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title={
        tab === "Incoming"
          ? t("pages.orderManagement.titleOne")
          : tab === "Received/ pending label"
          ? t("pages.orderManagement.titleTwo")
          : tab === "Awaiting Consolidation"
          ? t("pages.orderManagement.titleThree")
          : tab === "Pending Payment"
          ? t("pages.orderManagement.titleFour")
          : null
      }
      search={true}
      searchOnChange={(e) => setSearch(e.target.value)}
      searchValue={search}
      content={
        <div className="space-y-2">
          <TabButton
            text={[
              "Incoming",
              "Received/ pending label",
              "Awaiting Consolidation",
              "Pending Payment",
            ]}
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
