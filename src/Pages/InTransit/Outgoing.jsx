// @ts-nocheck
import React, { useState } from "react";
import Layout from "../../Components/Layout";
import DataTable from "react-data-table-component";
import primaryStyles from "../../Utilities/CustomStyles";
import GetAPI from "../../Utilities/GetAPI";
import Loader from "../../Components/Loader";
import { TabButton } from "../../Utilities/Buttons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Outgoing() {
  const { data } = GetAPI("warehouse/intransitgroups");
  const navigate = useNavigate();
  const [tab, setTab] = useState("Outgoing");
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const viewDetails = (id) => {
    if (tab === "Outgoing") {
      navigate("/intransit/outgoing-details", {
        state: {
          transitId: id,
        },
      });
    } else {
      navigate("/intransit/outgoing-completed-details", {
        state: {
          transitId: id,
        },
      });
    }
  };

  const outgoingData = () => {
    const filteredData = data?.data?.outgoing?.outOngoing?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search)) ||
        (dat?.id && dat?.bookingIds.toString().includes(search)) ||
        (dat?.transitId &&
          dat?.transitId.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.deliveryWarehouseT?.companyName &&
          dat?.deliveryWarehouseT?.companyName
            .toLowerCase()
            .includes(search.toLowerCase())) ||
        (dat?.receivingWarehouseT?.companyName &&
          dat?.receivingWarehouseT?.companyName
            .toLowerCase()
            .includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const outgoingComData = () => {
    const filteredData = data?.data?.outgoing?.outCompleted?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search)) ||
        (dat?.id && dat?.bookingIds.toString().includes(search)) ||
        (dat?.transitId &&
          dat?.transitId.toLowerCase().includes(search.toLowerCase())) ||
        (dat?.deliveryWarehouseT?.companyName &&
          dat?.deliveryWarehouseT?.companyName
            .toLowerCase()
            .includes(search.toLowerCase())) ||
        (dat?.receivingWarehouseT?.companyName &&
          dat?.receivingWarehouseT?.companyName
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
      name: t("pages.tableData.id"),
      selector: (row) => row.id,
    },
    {
      name: t("pages.tableData.bookingId"),
      selector: (row) => row.bookingId,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.transitId"),
      selector: (row) => row.transitId,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.receivingWarehouse"),
      selector: (row) => row.receivingWarehouseT,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.deliveryWarehouse"),
      selector: (row) => row.deliveryWarehouseT,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.company"),
      selector: (row) => row.shippingCompany,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.date"),
      selector: (row) => row.setOffDate,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.receivedPack"),
      selector: (row) => row.quantity,
      minWidth: "250px",
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

  if (tab === "Outgoing") {
    outgoingData()?.map((value, index) => {
      return datas.push({
        serialNo: index + 1,
        id: value?.id,
        bookingId: value?.bookingIds,
        transitId: value?.transitId,
        deliveryWarehouseT: value?.deliveryWarehouseT?.companyName,
        receivingWarehouseT: value?.receivingWarehouseT?.companyName,
        setOffDate: getDateFromTimestamp(value?.setOffDate),
        quantity: value?.quantity,
        shippingCompany: value?.logisticCompany?.title,
        status: (
          <div className="bg-statusYellowBg p-2 text-statusYellow">
            {value?.status}
          </div>
        ),
        action: (
          <div>
            <button
              className="text-theme text-sm font-semibold border border-theme rounded-md px-6 py-2 hover:bg-theme hover:text-white duration-200"
              onClick={(e) => {
                viewDetails(value?.id);
              }}
            >
              {t("pages.tableData.viewDet")}
            </button>
          </div>
        ),
      });
    });
  } else {
    outgoingComData()?.map((value, index) => {
      return datas.push({
        serialNo: index + 1,
        id: value?.id,
        bookingId: value?.bookingIds,
        transitId: value?.transitId,
        deliveryWarehouseT: value?.deliveryWarehouseT?.companyName,
        receivingWarehouseT: value?.receivingWarehouseT?.companyName,
        setOffDate: getDateFromTimestamp(value?.setOffDate),
        quantity: value?.quantity,
        shippingCompany: value?.logisticCompany?.title,
        status: (
          <div className="bg-statusGreenBg p-2 text-statusGreen">
            {value?.status}
          </div>
        ),
        action: (
          <div>
            <button
              className="text-theme text-sm font-semibold border border-theme rounded-md px-6 py-2 hover:bg-theme hover:text-white duration-200"
              onClick={(e) => {
                viewDetails(value?.id);
              }}
            >
               {t("pages.tableData.viewDet")}
            </button>
          </div>
        ),
      });
    });
  }

  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title={
        tab === "Outgoing"
          ? t("pages.inTransit.outgoing.titleOne")
          : t("pages.inTransit.outgoing.titleTwo")
      }
      search={true}
      searchOnChange={(e) => setSearch(e.target.value)}
      searchValue={search}
      content={
        <div className="space-y-2">
          <TabButton text={["Outgoing", "Completed"]} set={setTab} tab={tab} />
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
