// @ts-nocheck
import Layout from "../../Components/Layout";
import DataTable from "react-data-table-component";
import primaryStyles from "../../Utilities/CustomStyles";
import GetAPI from "../../Utilities/GetAPI";
import Loader from "../../Components/Loader";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { TabButton } from "../../Utilities/Buttons";
import axios from "axios";
import { BASE_URL } from "../../Utilities/URL";
import { useEffect } from "react";
import { PostAPI } from "../../Utilities/PostAPI";
import {
  error_toaster,
  info_toaster,
  success_toaster,
} from "../../Utilities/Toaster";
import { useTranslation } from "react-i18next";

export default function ReadyToShip() {
  const companies = GetAPI("warehouse/logistic-companies");
  const warehouse = GetAPI("warehouse/all-active-warehouse");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tab, setTab] = useState(t("Direct Delivery Orders"));
  const [search, setSearch] = useState("");
  const [data, setData] = useState("");
  const [selectLogCompOptions, setSelectLogCompOptions] = useState(null);
  const [selectWarehouse, setSelectWarehouse] = useState(null);
  const [selectedRows, setSelectedRows] = useState("");

  const companiesOptions = [];
  const warehousesOptions = [];

  companies.data?.status === "1" &&
    companies.data?.data?.map((value, index) =>
      companiesOptions.push({
        value: value?.id,
        label: value?.title,
      })
    );

  warehouse.data?.status === "1" &&
    warehouse.data?.data?.map((value, index) =>
      warehousesOptions.push({
        value: value?.id,
        label: value?.companyName,
      })
    );

  const handleCompanySelectChange = (selectedOption) => {
    setSelectLogCompOptions(selectedOption);
  };

  const handleWarehouseSelectChange = (selectedOption) => {
    setSelectWarehouse(selectedOption);
  };

  const viewDetails = (id, consolidation) => {
    navigate("/ready-to-ship-details", {
      state: {
        packageId: id,
        consolidationStatus: consolidation,
      },
    });
  };

  const setNewArr = (arg) => {
    setSelectedRows(arg);
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
        if (tab === "Direct Delivery Orders") {
          setData("");
          response = await axios.get(
            BASE_URL +
              "warehouse/bookings?bookingStatus=10&deliveryType=1&deliveryStatus=direct",
            config
          );
        } else {
          setData("");
          response = await axios.get(
            BASE_URL +
              "warehouse/bookings?bookingStatus=10&deliveryStatus=byWarehouse",
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
      if (tab === "Direct Delivery Orders") {
        response = await axios.get(
          BASE_URL +
            "warehouse/bookings?bookingStatus=10&deliveryType=1&deliveryStatus=direct",
          config
        );
      } else {
        response = await axios.get(
          BASE_URL +
            "warehouse/bookings?bookingStatus=10&deliveryStatus=byWarehouse",
          config
        );
      }
      setData(response?.data);
    } catch (err) {
      info_toaster(err);
    }
  };

  const readyToShipData = () => {
    const filteredData = data?.data?.filter((dat) => {
      return (
        (search === "" ||
          (dat?.bookingData?.trackingId &&
            dat?.bookingData.trackingId
              .toLowerCase()
              .includes(search.toLowerCase())) ||
          (dat?.bookingData?.virtualBoxNumber &&
            dat?.bookingData.virtualBoxNumber
              .toLowerCase()
              .includes(search.toLowerCase())) ||
          (dat?.bookingData?.receivingWarehouse &&
            dat?.bookingData.receivingWarehouse
              .toLowerCase()
              .includes(search.toLowerCase())) ||
          (dat?.bookingData?.deliveryWarehouse &&
            dat?.bookingData.deliveryWarehouse
              .toLowerCase()
              .includes(search.toLowerCase())) ||
          (dat?.bookingDeliveryType?.title &&
            dat?.bookingDeliveryType.title
              .toLowerCase()
              .includes(search.toLowerCase()))) &&
        (!selectLogCompOptions ||
          (dat?.logisticCompany?.title &&
            dat?.logisticCompany.title
              .toLowerCase()
              .includes(selectLogCompOptions.label.toLowerCase())))
      );
    });
    return filteredData;
  };

  const handleDelivery = async () => {
    if (tab === "Direct Delivery Orders") {
      if (selectLogCompOptions === "" || selectLogCompOptions === null) {
        info_toaster("Please Select Logistic Company");
      } else if (selectedRows.length === 0) {
        info_toaster("Please Select Atleast One Package For Delivery");
      } else {
        const bookingIds = selectedRows?.map((e) => e.id);
        setData("");
        const res = await PostAPI("warehouse/to-direct-deliver", {
          bookingIds: bookingIds,
          logisticCompanyId: selectLogCompOptions.value,
          deliveryWarehouseId: selectLogCompOptions.value,
        });
        if (res?.data?.status === "1") {
          reFetch();
          success_toaster(res?.data?.message);
          setSelectLogCompOptions(null);
          setSelectWarehouse(null);
        } else {
          error_toaster(res?.data?.message);
        }
      }
    } else {
      if (selectLogCompOptions === "" || selectLogCompOptions === null) {
        info_toaster("Please Select Logistic Company");
      } else if (selectWarehouse === "" || selectWarehouse === null) {
        info_toaster("Please Select Warehouse");
      } else if (selectedRows.length === 0) {
        info_toaster("Please Select Atleast One Package For Delivery");
      } else {
        const bookingIds = selectedRows?.map((e) => e.id);
        setData("");
        const res = await PostAPI("warehouse/totransit", {
          bookingIds: bookingIds,
          logisticCompanyId: selectLogCompOptions.value,
          deliveryWarehouseId: selectWarehouse.value,
        });
        if (res?.data?.status === "1") {
          reFetch();
          success_toaster(res?.data?.message);
          setSelectLogCompOptions(null);
          setSelectWarehouse(null);
        } else {
          error_toaster(res?.data?.message);
        }
      }
    }
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
      name: t("pages.tableData.receivingWarehouse"),
      selector: (row) => row.receivingWarehouse,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.deliveryWarehouse"),
      selector: (row) => row.deliveryWarehouse,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.deliveryType"),
      selector: (row) => row.deliveryType,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.consolidation"),
      selector: (row) => row.consolidation,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.company"),
      selector: (row) => row.logisticCompany,
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
      id: value?.bookingData?.id,
      bookingId: value?.bookingData?.trackingId,
      virtualBoxNumber: value?.bookingData?.virtualBoxNumber,
      receivingWarehouse: value?.bookingData?.receivingWarehouse,
      deliveryWarehouse: value?.bookingData?.deliveryWarehouse,
      deliveryType: value?.bookingDeliveryType?.title,
      consolidation: value?.bookingData?.consolidation,
      logisticCompany: value?.logisticCompany?.title,
      date: getDateFromTimestamp(value?.bookingData?.date),
      dropoffAddress:
        value?.dropoffAddress &&
        `${value?.dropoffAddress?.streetAddress}, ${value?.dropoffAddress?.district}, ${value?.dropoffAddress?.province}`,
      quantity: `${value?.packages?.arrived} / ${value?.packages?.total}`,
      action: (
        <button
          className="text-theme text-sm font-semibold border border-theme rounded-md px-6 py-2.5 hover:bg-theme hover:text-white duration-200"
          onClick={(e) => {
            viewDetails(
              value?.bookingData?.id,
              value?.bookingData?.consolidation
            );
          }}
        >
           {t("pages.tableData.viewDet")}
        </button>
      ),
    });
  });

  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title={
        tab === "Direct Delivery Orders"
          ? t("pages.readyToShip.titleOne")
          : t("pages.readyToShip.titleTwo")
      }
      search={true}
      searchOnChange={(e) => setSearch(e.target.value)}
      searchValue={search}
      filter={true}
      companyOnChange={handleCompanySelectChange}
      companyOptions={companiesOptions}
      companyValue={selectLogCompOptions}
      warehouseOnChange={handleWarehouseSelectChange}
      warehouseOptions={warehousesOptions}
      warehouseValue={selectWarehouse}
      readyToShipTab={tab}
      content={
        <div className="space-y-2">
          <TabButton
            text={["Direct Delivery Orders", "By Warehouse Delivery Orders"]}
            set={setTab}
            tab={tab}
          />
          <div className="flex justify-end pt-5">
            <button
              className="text-white bg-theme text-sm font-semibold border border-theme rounded-md px-6 py-3  hover:bg-transparent hover:text-theme 
          duration-200"
              onClick={handleDelivery}
            >
              {tab === "Direct Delivery Orders"
                ? t("pages.readyToShip.directDelBtn")
                : t("pages.readyToShip.byWarehouseBtn")}
            </button>
          </div>
          <div>
            <DataTable
              theme="myTheme"
              customStyles={primaryStyles}
              columns={columns}
              data={datas}
              pagination
              selectableRows
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
