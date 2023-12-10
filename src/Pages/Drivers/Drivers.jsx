// @ts-nocheck
import React, { useState } from "react";
import Layout from "../../Components/Layout";
import DataTable from "react-data-table-component";
import primaryStyles from "../../Utilities/CustomStyles";
import GetAPI from "../../Utilities/GetAPI";
import Loader from "../../Components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { error_toaster, success_toaster } from "../../Utilities/Toaster";
import { PutAPI } from "../../Utilities/PutAPI";
import { FaEye, FaTrash } from "react-icons/fa";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Tooltip,
} from "@chakra-ui/react";
import { MdModeEditOutline } from "react-icons/md";
import { DeleteAPI } from "../../Utilities/DeleteAPI";
import { useTranslation } from "react-i18next";

export default function Drivers() {
  const { data, reFetch } = GetAPI("warehouse/alldrivers");
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [driverData, setDriverData] = useState();
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const driverDetails = (id) => {
    navigate("/driver-details", {
      state: {
        driverId: id,
      },
    });
  };

  const changeDriverStatus = async (status, userId) => {
    setDisabled(true);
    let change = await PutAPI("warehouse/updateDriverStatus", {
      status: status,
      userId: userId,
    });
    if (change?.data?.status === "1") {
      reFetch();
      success_toaster(change?.data?.message);
      setDisabled(false);
    } else {
      error_toaster(change?.data?.message);
      setDisabled(false);
    }
  };

  const deleteDriver = async (id) => {
    setDisabled(true);
    const res = await DeleteAPI(`warehouse/deleteDriver?id=${id}`);
    if (res?.data?.status === "1") {
      reFetch();
      success_toaster(res?.data?.message);
      setDisabled(false);
    } else {
      error_toaster(res?.data?.message);
      setDisabled(false);
    }
  };

  const openEditModal = (driverdetails) => {
    setEditModal(true);
    setDriverData(driverdetails);
  };
  const closeEditModal = () => {
    setEditModal(false);
  };
  const driversData = () => {
    const filteredData = data?.data?.filter((dat) => {
      const fullName = `${dat?.user?.firstName} ${dat?.user?.lastName}`;
      return (
        search === "" ||
        (fullName && fullName.toLowerCase().includes(search.toLowerCase()))
      );
    });
    return filteredData;
  };

  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
    },
    {
      name: t("pages.tableData.name"),
      selector: (row) => row.name,
    },
    {
      name: t("pages.tableData.phone"),
      selector: (row) => row.phone,
    },
    {
      name: t("pages.tableData.approvalStatus"),
      selector: (row) => row.approvedByAdmin,
    },
    {
      name: t("pages.tableData.status"),
      selector: (row) => row.status,
    },
    {
      name: t("pages.tableData.action"),
      selector: (row) => row.action,
    },
  ];

  const datas = [];

  driversData()?.map((value, index) => {
    return datas.push({
      id: index + 1,
      name: `${value?.user?.firstName} ${value?.user?.lastName}`,
      phone: `${value?.user?.countryCode} ${value?.user?.phoneNum}`,
      approvedByAdmin: value?.approvedByAdmin ? (
        <div className="py-3 px-8 bg-theme text-white rounded-md">Approved</div>
      ) : (
        <div className="py-3 px-8 bg-theme text-white rounded-md">
          Not Approved
        </div>
      ),
      status: (
        <div>
          {value?.user?.status === true ? (
            <button
              className="border border-green-500 rounded-sm w-20 h-8 text-green-500"
              onClick={() => changeDriverStatus(0, value?.user?.id)}
              disabled={disabled}
            >
              Active
            </button>
          ) : (
            <button
              className="border border-red-500 rounded-sm w-20 h-8 text-red-500"
              onClick={() => changeDriverStatus(1, value?.user?.id)}
              disabled={disabled}
            >
              Inactive
            </button>
          )}
        </div>
      ),

      action: (
        <div className="flex items-center gap-3">
          {/* Driver Details Button */}
          <Tooltip
            label="View Details"
            aria-label="A tooltip"
            bgColor="#00538C"
          >
            <button
              onClick={() => driverDetails(value?.user?.id)}
              className=" border border-theme text-theme rounded-full w-8 h-8 flex justify-center items-center hover:bg-theme hover:text-white"
            >
              <FaEye className="text-xl" />
            </button>
          </Tooltip>

          {/* Driver Details Edit Button */}
          <Tooltip label="Edit" aria-label="A tooltip" bgColor="#00538C">
            <button className=" border border-theme text-theme rounded-full w-8 h-8 flex justify-center items-center hover:bg-theme hover:text-white">
              <MdModeEditOutline
                className="text-xl"
                onClick={(e) => {
                  openEditModal(value);
                }}
              />
            </button>
          </Tooltip>

          {/*Delete Driver Button */}
          <Tooltip
            label="Delete Driver"
            aria-label="A tooltip"
            bgColor="red.500"
          >
            <button
              onClick={() => deleteDriver(value?.user?.id)}
              className="border border-red-500 text-red-500 rounded-full w-8 h-8 flex justify-center items-center hover:text-white hover:bg-red-500"
              disabled={disabled}
            >
              <FaTrash className="text-lg " />
            </button>
          </Tooltip>
        </div>
      ),
    });
  });

  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title={t("pages.drivers.title")}
      search={true}
      searchOnChange={(e) => setSearch(e.target.value)}
      searchValue={search}
      content={
        <div className="space-y-10">
          <div className="flex justify-end">
            <Link
              to={"/create-driver/step-one"}
              className="py-3 px-8 rounded bg-theme font-medium text-base text-white border border-theme hover:bg-transparent hover:text-theme"
            >
              {t("pages.drivers.createDriver")}
            </Link>
          </div>
          <div>
            <DataTable
              theme="myTheme"
              customStyles={primaryStyles}
              columns={columns}
              data={datas}
              pagination
            />

            <Modal
              onClose={closeEditModal}
              isOpen={editModal}
              size="xl"
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                  <div className="font-medium text-xl text-center text-theme mb-4 mt-10">
                    {t("pages.drivers.select")}
                  </div>
                  <div className="flex justify-center items-center gap-x-5 mb-10 [&>button]:bg-transparent [&>button]:py-2.5 [&>button]:px-5 [&>button]:font-medium [&>button]:text-base [&>button]:text-theme [&>button]:rounded [&>button]:border [&>button]:border-theme">
                    <button
                      className="hover:bg-theme hover:text-white"
                      onClick={(e) => {
                        navigate("/update/driver-profile", {
                          state: { driverDetails: driverData },
                        });
                      }}
                    >
                      {t("pages.drivers.personalInfo")}
                    </button>
                    <button
                      className="hover:bg-theme hover:text-white"
                      onClick={(e) => {
                        navigate("/update/driver-vehicle-info", {
                          state: { driverDetails: driverData },
                        });
                      }}
                    >
                      {t("pages.drivers.vehicleInfo")}
                    </button>
                    <button
                      className="hover:bg-theme hover:text-white"
                      onClick={(e) => {
                        navigate("/update/driver-license-info", {
                          state: { driverDetails: driverData },
                        });
                      }}
                    >
                      {t("pages.drivers.licenseInfo")}
                    </button>
                  </div>
                </ModalBody>
              </ModalContent>
            </Modal>
          </div>
        </div>
      }
    />
  );
}
