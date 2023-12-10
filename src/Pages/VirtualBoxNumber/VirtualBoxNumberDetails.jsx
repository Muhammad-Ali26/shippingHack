// @ts-nocheck
import Layout from "../../Components/Layout";
import DataTable from "react-data-table-component";
import primaryStyles from "../../Utilities/CustomStyles";
import GetAPI from "../../Utilities/GetAPI";
import Loader from "../../Components/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import { BackButton } from "../../Utilities/Buttons";
import { useTranslation } from "react-i18next";

export default function VirtualBoxNumberDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = GetAPI(
    `warehouse/bookings?virtualBox=${location?.state?.virtualBoxNumber}`
  );
  const { t } = useTranslation();

  const viewDetails = (id) => {
    navigate("/virtual-booking-details", {
      state: {
        bookingId: id,
      },
    });
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

  data?.data?.bookings?.map((value, index) => {
    return datas.push({
      serialNo: index + 1,
      bookingId: value?.bookingData?.id,
      virtualBoxNumber: value?.bookingData?.virtualBoxNumber,
      deliveryWarehouse: value?.bookingData?.deliveryWarehouse,
      receivingWarehouse: value?.bookingData?.receivingWarehouse,
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
      title={t("pages.trackVbn.allBookings")}
      content={
        <div className="space-y-10">
          <div>
            <BackButton name={t("pages.details.backButton")} />
          </div>
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
