// @ts-nocheck
import Layout from "../../Components/Layout";
import DataTable from "react-data-table-component";
import primaryStyles from "../../Utilities/CustomStyles";
import GetAPI from "../../Utilities/GetAPI";
import Loader from "../../Components/Loader";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AwaitingConsolidation() {
  const { data } = GetAPI("warehouse/bookings?consolidation=1&bookingStatus=7");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const viewDetails = (id) => {
    navigate("/awaiting-consolidation-details", {
      state: {
        packageId: id,
      },
    });
  };

  const awaitingConsolidationData = () => {
    const filteredData = data?.data?.filter((dat) => {
      return (
        search === "" ||
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

  awaitingConsolidationData()?.map((value, index) => {
    return datas.push({
      serialNo: index + 1,
      bookingId: value?.bookingData?.trackingId,
      receivingWarehouse: value?.bookingData?.receivingWarehouse,
      consolidation: value?.bookingData?.consolidation,
      date: getDateFromTimestamp(value?.bookingData?.date),
      quantity: `${value?.packages?.arrived} / ${value?.packages?.total}`,
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

  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title={t("pages.orderManagement.titleThree")}
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
