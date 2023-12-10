// @ts-nocheck
import Layout from "../../Components/Layout";
import DataTable from "react-data-table-component";
import primaryStyles from "../../Utilities/CustomStyles";
import GetAPI from "../../Utilities/GetAPI";
import { PostAPI } from "../../Utilities/PostAPI";
import Loader, { MiniLoader } from "../../Components/Loader";
import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { BASE_URL } from "../../Utilities/URL";
import { error_toaster, success_toaster } from "../../Utilities/Toaster";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Received() {
  const { data, reFetch } = GetAPI("warehouse/bookings?bookingStatus=12");
  const drivers = GetAPI("warehouse/allassociateddrivers");
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const openModal = (id) => {
    setModal(true);
    setBookingId(id);
  };
  const closeModal = () => {
    setModal(false);
  };

  const assignDriver = async (driverId) => {
    setLoader(true);
    const res = await PostAPI("warehouse/assigndriver", {
      bookingId: bookingId,
      overRide: true,
      driverId: driverId,
    });
    if (res?.data?.status === "1") {
      reFetch();
      success_toaster(res?.data?.message);
      setLoader(false);
      setModal(false);
    } else {
      error_toaster(res?.data?.message);
      setLoader(false);
    }
  };

  const viewDetails = (bookingId) => {
    navigate("/received-details", {
      state: {
        bookingId: bookingId,
      },
    });
  };

  const receivedData = () => {
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

  receivedData()?.map((value, index) => {
    return datas.push({
      serialNo: index + 1,
      bookingId: value?.bookingData?.trackingId,
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
        <div className="flex flex-col gap-y-3 my-2">
          <button
            className="text-white bg-theme text-sm font-semibold border border-theme rounded-md px-6 py-2 hover:bg-white hover:text-theme duration-200"
            onClick={(e) => {
              openModal(value?.bookingData?.id);
            }}
          >
            {t("pages.orderManagementRico.assignDriBtn")}
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

  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title={t("pages.orderManagementRico.titleOne")}
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

            <Modal onClose={closeModal} isOpen={modal} isCentered>
              <ModalOverlay />
              <ModalContent bgColor="#F4F7FF">
                <ModalHeader padding={0}>
                  <h2 className="text-theme py-2 px-4 text-xl text-center font-semibold">
                  {t("pages.orderManagementRico.allDrivers")}
                  </h2>
                </ModalHeader>
                <ModalCloseButton
                  color="white"
                  bgColor="#00528C"
                  border="1px solid #00528C"
                  _hover={{ bgColor: "transparent", color: "#00528C" }}
                />
                {loader ? (
                  <div className="h-[252px]">
                    <MiniLoader />
                  </div>
                ) : (
                  <ModalBody padding={0}>
                    {drivers?.data?.data?.map((value, index) => (
                      <>
                        <div className="grid grid-cols-5 p-3">
                          <img
                            src={`${BASE_URL}${value?.user?.image}`}
                            alt="drivers"
                            className="w-14 h-14 rounded-full"
                          />

                          <div className="col-span-2">
                            <h4 className="text-xl font-semibold text-theme capitalize">
                              {`${value?.user?.firstName} ${value?.user?.lastName}`}
                            </h4>
                            <p className="text-activeColor">Active</p>
                          </div>

                          <div className="col-span-2 flex justify-end items-center">
                            <button
                              onClick={(e) => assignDriver(value?.user?.id)}
                              className="border border-theme text-theme w-20 h-10 rounded-md hover:bg-theme hover:text-white duration-200"
                            >
                              {t("pages.orderManagementRico.assignBtn")}
                            </button>
                          </div>
                        </div>

                        <hr />
                      </>
                    ))}
                  </ModalBody>
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>
      }
    />
  );
}
