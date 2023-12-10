// @ts-nocheck
import Layout from "../../Components/Layout";
import DataTable from "react-data-table-component";
import GetAPI from "../../Utilities/GetAPI";
import Loader from "../../Components/Loader";
import { useLocation } from "react-router-dom";
import { BackButton } from "../../Utilities/Buttons";
import primaryStyles from "../../Utilities/CustomStyles";
import { BASE_URL } from "../../Utilities/URL";
import { useTranslation } from "react-i18next";

export default function DriverDetails() {
  const location = useLocation();
  const { t } = useTranslation();

  const { data } = GetAPI(
    `warehouse/driverdetails?id=${location?.state?.driverId}`
  );

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
      selector: (row) => row.trackingId,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.pickupDBS"),
      selector: (row) => row.pickupAddress,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.dropOffDBS"),
      selector: (row) => row.dropoffAddress,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.date"),
      selector: (row) => row.pickupDate,
      minWidth: "250px",
    },
    {
      name: t("pages.tableData.status"),
      selector: (row) => row.status,
      minWidth: "250px",
    },
  ];

  const datas = [];

  data?.data?.userData1?.deliveryDriver?.map((value, index) => {
    return datas.push({
      serialNo: index + 1,
      id: value?.id,
      trackingId: value?.trackingId,
      pickupAddress: value?.pickupAddress?.postalCode,
      dropoffAddress: value?.dropoffAddress?.postalCode,
      pickupDate: value?.pickupDate,
      status: (
        <div className="py-3 px-2 bg-theme text-white rounded-md">
          {value?.bookingStatus?.title}
        </div>
      ),
    });
  });

  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title={t("pages.drivers.detailsTitle")}
      content={
        <section className="grid grid-cols-12 gap-10">
          <div className="col-span-9 space-y-4">
            <div>
              <BackButton name={t("pages.details.backButton")} />
            </div>
            <DataTable
              theme="myTheme"
              columns={columns}
              data={datas}
              customStyles={primaryStyles}
            />
          </div>

          <div className="bg-white p-10 mt-20 col-span-3 rounded-lg">
            <div>
              <img
                src={`${BASE_URL}${data?.data?.userData1?.image}`}
                alt="profile"
                className="w-24 h-24 m-auto object-contain rounded-full"
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl text-theme font-semibold pt-5">
                {data?.data?.userData1?.firstName}{" "}
                {data?.data?.userData1?.lastName}
              </h2>
              <p className="text-sm text-[#00000099]">{t("pages.drivers.memberSince")}</p>
              <p className="text-black text-base pb-5">
                {getDateFromTimestamp(data?.data?.userData1?.createdAt)}
              </p>
              <div className="w-full h-[2px] bg-[#00000066] "></div>
            </div>
            <div className="space-y-1">
              <h2 className="text-sm text-[#00000099] pt-5">{t("pages.drivers.email")}</h2>
              <p className="text-black text-base pb-5">
                {data?.data?.userData1?.email}
              </p>
              <div className="w-full h-[2px] bg-[#00000066] "></div>
            </div>
            <div className="space-y-1">
              <h2 className="text-sm text-[#00000099] pt-5">{t("pages.drivers.phone")}</h2>
              <p className="text-black text-base pb-5">
                {data?.data?.userData1?.countryCode}{" "}
                {data?.data?.userData1?.phoneNum}
              </p>
              <div className="w-full h-[2px] bg-[#00000066] "></div>
            </div>
            <div className="space-y-1">
              <h2 className="text-sm text-[#00000099] pt-5">{t("pages.drivers.vehicle")}</h2>
              <p className="text-black text-base pb-5">
                {data?.data?.userData1?.driverDetail?.vehicleType?.title}
              </p>
            </div>
            <div className="w-full h-[2px] bg-[#00000066] "></div>
          </div>
        </section>
      }
    />
  );
}
