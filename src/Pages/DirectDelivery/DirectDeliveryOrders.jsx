// @ts-nocheck
import Layout from "../../Components/Layout";
import DataTable from "react-data-table-component";
import primaryStyles from "../../Utilities/CustomStyles";
import GetAPI from "../../Utilities/GetAPI";
import Loader from "../../Components/Loader";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PostAPI } from "../../Utilities/PostAPI";
import { error_toaster, success_toaster } from "../../Utilities/Toaster";
import { useTranslation } from "react-i18next";

export default function DirectDelivery() {
  const { data, reFetch } = GetAPI(
    "warehouse/bookings?bookingStatus=14&deliveryStatus=direct"
  );
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();

  const viewDetails = (bookingId) => {
    navigate("/direct-delivery-details", {
      state: {
        bookingId: bookingId,
      },
    });
  };

  const deliver = async (bookingId) => {
    setLoader(true);
    const res = await PostAPI("warehouse/mark-deliver", {
      bookingId: bookingId,
    });
    if (res?.data?.status === "1") {
      reFetch();
      setLoader(false);
      success_toaster(res?.data?.message);
    } else {
      error_toaster(res?.data?.message);
      setLoader(false);
    }
  };

  const directDeliveryData = () => {
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

  directDeliveryData()?.map((value, index) => {
    return datas.push({
      serialNo: index + 1,
      bookingId: value?.bookingData?.trackingId,
      virtualBoxNumber: value?.bookingData?.virtualBoxNumber,
      deliveryWarehouse: value?.bookingData?.deliveryWarehouse,
      receivingWarehouse: value?.bookingData?.receivingWarehouse,
      deliveryType: value?.bookingDeliveryType?.title,
      consolidation: value?.bookingData?.consolidation,
      logisticCompany: value?.logisticCompany?.title,
      date: value?.bookingData?.date,
      dropoffAddress:
        value?.dropoffAddress &&
        `${value?.dropoffAddress?.streetAddress}, ${value?.dropoffAddress?.district}, ${value?.dropoffAddress?.province}`,
      quantity: `${value?.packages?.arrived} / ${value?.packages?.total}`,
      action: (
        <div className="flex flex-col gap-y-3 my-2">
          <button
            className="text-white bg-theme text-sm font-semibold border border-theme rounded-md px-6 py-2 hover:bg-white hover:text-theme duration-200"
            onClick={(e) => {
              deliver(value?.bookingData?.id);
            }}
          >
             {t("pages.tableData.deliverBtn")}
          </button>
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
      title={t("pages.directDelivery.title")}
      search={true}
      searchOnChange={(e) => setSearch(e.target.value)}
      searchValue={search}
      content={
        <div className="space-y-10">
          <div>
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
