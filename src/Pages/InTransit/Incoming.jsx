// @ts-nocheck
import React, { useState } from "react";
import Layout from "../../Components/Layout";
import DataTable from "react-data-table-component";
import primaryStyles from "../../Utilities/CustomStyles";
import GetAPI from "../../Utilities/GetAPI";
import Loader from "../../Components/Loader";
import { TabButton } from "../../Utilities/Buttons";
import { useNavigate } from "react-router-dom";
import { PostAPI } from "../../Utilities/PostAPI";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../Utilities/Toaster";
import { useTranslation } from "react-i18next";

export default function Incoming() {
  const { data, reFetch } = GetAPI("warehouse/intransitgroups");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tab, setTab] = useState("Incoming");
  const [selectedRows, setSelectedRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);

  const viewDetails = (id) => {
    if (tab === "Incoming") {
      navigate("/intransit/incoming-details", {
        state: {
          transitId: id,
        },
      });
    } else {
      navigate("/intransit/incoming-completed-details", {
        state: {
          transitId: id,
        },
      });
    }
  };

  const setNewArr = (arg) => {
    setSelectedRows(arg);
  };

  const transitReceived = async () => {
    if (selectedRows.length === 0) {
      info_toaster("Please Select At Least One Package");
    } else {
      const bookingIds = selectedRows?.map((e) => e.bookingId);
      const inTransitGroupId = selectedRows?.map((e) => e.id);
      setLoader(true);
      const res = await PostAPI("warehouse/transitRecived", {
        bookingIds: bookingIds,
        inTransitGroupId: inTransitGroupId,
      });
      if (res?.data?.status === "1") {
        reFetch();
        success_toaster(res?.data?.message);
        setLoader(false);
      } else {
        setLoader(false);
        error_toaster(res?.data?.message);
      }
    }
  };

  const incomingData = () => {
    const filteredData = data?.data?.incoming?.inOngoing?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search)) ||
        (dat?.id && dat?.bookingIds.toString().includes(search)) ||
        (dat?.transitId &&
          dat?.transitId?.toLowerCase().includes(search.toLowerCase())) ||
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

  const incomingComData = () => {
    const filteredData = data?.data?.incoming?.inCompleted?.filter((dat) => {
      return (
        search === "" ||
        (dat?.id && dat?.id.toString().includes(search)) ||
        (dat?.id && dat?.bookingIds.toString().includes(search)) ||
        (dat?.transitId &&
          dat?.transitId?.toLowerCase().includes(search.toLowerCase())) ||
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

  if (tab === "Incoming") {
    incomingData()?.map((value, index) => {
      return datas.push({
        serialNo: index + 1,
        id: value?.id,
        bookingId: value?.bookingIds,
        transitId: value?.transitId,
        deliveryWarehouseT: value?.deliveryWarehouseT?.companyName,
        receivingWarehouseT: value?.receivingWarehouseT?.companyName,
        shippingCompany: value?.logisticCompany?.title,
        setOffDate: getDateFromTimestamp(value?.setOffDate),
        quantity: value?.quantity,
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
    incomingComData()?.map((value, index) => {
      return datas.push({
        serialNo: index + 1,
        id: value?.id,
        bookingId: value?.bookingIds,
        transitId: value?.transitId,
        deliveryWarehouseT: value?.deliveryWarehouseT?.companyName,
        receivingWarehouseT: value?.receivingWarehouseT?.companyName,
        shippingCompany: value?.logisticCompany?.title,
        setOffDate: getDateFromTimestamp(value?.setOffDate),
        quantity: value?.quantity,
        status: (
          <div className="bg-statusGreenBg p-2 text-statusGreen">
            {value?.status}
          </div>
        ),
        action: (
          <button
            className="text-theme text-sm font-semibold border border-theme rounded-md px-6 py-2.5 hover:bg-theme hover:text-white duration-200"
            onClick={(e) => {
              viewDetails(value?.id);
            }}
          >
           {t("pages.tableData.viewDet")}
          </button>
        ),
      });
    });
  }

  return data.length === 0 || loader === true ? (
    <Loader />
  ) : (
    <Layout
      title={
        tab === "Incoming"
          ? t("pages.inTransit.incoming.titleOne")
          : t("pages.inTransit.incoming.titleTwo")
      }
      search={true}
      searchOnChange={(e) => setSearch(e.target.value)}
      searchValue={search}
      content={
        <div className="space-y-2">
          <TabButton text={["Incoming", "Completed"]} set={setTab} tab={tab} />
          <div className="flex justify-end pt-5">
            {tab === "Incoming" ? (
              <button
                className="text-white bg-theme text-sm font-semibold border border-theme rounded-md px-6 py-3 hover:bg-transparent hover:text-theme duration-200"
                onClick={transitReceived}
              >
                {t("pages.inTransit.incoming.transitReceivedBtn")}
              </button>
            ) : (
              ""
            )}
          </div>
          <div className="pt-5">
            <DataTable
              theme="myTheme"
              customStyles={primaryStyles}
              columns={columns}
              data={datas}
              pagination
              selectableRows={tab === "Incoming" ? true : false}
              onSelectedRowsChange={({ selectedRows }) =>
                setNewArr(selectedRows)
              }
            />
          </div>
        </div>
      }
    />
  );
}
