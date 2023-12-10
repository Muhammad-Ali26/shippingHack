// @ts-nocheck
import React from "react";
import ListHead from "./ListHead";
import ListItems from "./ListItems";
import { RiDashboardFill } from "react-icons/ri";
import { GiCardPickup } from "react-icons/gi";
import { FaUserNurse } from "react-icons/fa";
import { FaTruckArrowRight } from "react-icons/fa6";
import { TbCapture, TbTruckDelivery } from "react-icons/tb";
import { LuCalendarCheck2, LuCalendarX2, LuPackageCheck } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlinePoweroff } from "react-icons/ai";
import { info_toaster } from "../Utilities/Toaster";
import { GetPackages } from "../Utilities/GetAPI";
import { useTranslation } from "react-i18next";
import { FiPackage } from "react-icons/fi";

export default function LeftBar() {
  const location = useLocation().pathname;
  const navigate = useNavigate();
  const incomingOrders = GetPackages(
    "warehouse/bookings?bookingStatus=1,2,3,4,5,6"
  );
  const pendingLabelOrders = GetPackages(
    "warehouse/bookings?consolidation=0&bookingStatus=7"
  );
  const consolidationOrders = GetPackages(
    "warehouse/bookings?consolidation=1&bookingStatus=7"
  );
  const paymentOrders = GetPackages("warehouse/bookings?bookingStatus=8,9");
  const directDeliveryOrders = GetPackages(
    "warehouse/bookings?bookingStatus=10&deliveryType=1&deliveryStatus=direct"
  );
  const byWarehouseOrders = GetPackages(
    "warehouse/bookings?bookingStatus=10&deliveryStatus=byWarehouse"
  );
  const intransitOrders = GetPackages("warehouse/intransitgroups");
  const receivedOrders = GetPackages("warehouse/bookings?bookingStatus=12");
  const assignDriverOrders = GetPackages("warehouse/bookings?bookingStatus=13");
  const onTheWayOrders = GetPackages("warehouse/bookings?bookingStatus=17");

  const logoutFunc = (e) => {
    e.preventDefault();
    setTimeout(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("loginStatus");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("selectedLang");
      localStorage.removeItem("i18nextLng");
      navigate("/sign-in");
      info_toaster("Successfully Logged out!");
    }, 400);
  };

  const { t } = useTranslation();
  return (
    <div className="w-[20%] xl:w-[15%] fixed h-4/5 overflow-auto bg-white pb-7 px-4 mt-[92px]">
      <div>
        <ul className="flex flex-col">
          <div className="space-y-2">
            <div>
              <ListHead
                to="/"
                title={t("leftbar.title.dashboard")}
                Icon={RiDashboardFill}
                size={26}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <ListHead
                to="/track-order"
                title={t("leftbar.title.orderTracking")}
                Icon={TbCapture}
                size={26}
                active={
                  location === "/track-order" || location === "/booking-details"
                    ? true
                    : false
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <ListHead
                to="/track-virtualbox-number"
                title={t("leftbar.title.virtualBoxNumber")}
                Icon={TbCapture}
                size={26}
                active={
                  location === "/virtualbox-number-details" ||
                  location === "/virtual-booking-details"
                    ? true
                    : false
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <ListHead
                to="/all-orders"
                title={t("leftbar.title.orderManagement")}
                Icon={FiPackage}
                size={26}
                active={
                  location === "/incoming" ||
                  location === "/incoming-details" ||
                  location === "/pending-label" ||
                  location === "/pending-label-details" ||
                  location === "/remeasurements" ||
                  location === "/awaiting-consolidation" ||
                  location === "/awaiting-consolidation-details" ||
                  location === "/pending-payments" ||
                  location === "/pending-payment-details"
                    ? true
                    : false
                }
              />
            </div>

            <div className="flex flex-col gap-y-1">
              <ListItems
                to="/incoming"
                title={t("leftbar.title.incoming")}
                active={location === "/incoming-details" ? true : false}
                totalOrders={incomingOrders?.data?.length}
              />
              <ListItems
                to="/pending-label"
                title={t("leftbar.title.pendingMeasurements")}
                active={location === "/pending-label-details" ? true : false}
                totalOrders={pendingLabelOrders?.data?.length}
              />
              <ListItems
                to="/awaiting-consolidation"
                title={t("leftbar.title.awaitingConsolidation")}
                active={
                  location === "/awaiting-consolidation-details" ? true : false
                }
                totalOrders={consolidationOrders?.data?.length}
              />
              <ListItems
                to="/pending-payments"
                title={t("leftbar.title.pendingPayment")}
                active={location === "/pending-payment-details" ? true : false}
                totalOrders={paymentOrders?.data?.length}
              />
              <hr className="border-none h-[1px] bg-black bg-opacity-30 mt-2" />
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <ListHead
                to="/ready-to-ship"
                title={t("leftbar.title.readyToShip")}
                Icon={FaTruckArrowRight}
                size={26}
                active={
                  location === "/ready-to-ship-details" ||
                  location === "/direct-delivery" ||
                  location === "/by-warehouse-delivery"
                    ? true
                    : false
                }
              />
            </div>

            <div className="flex flex-col gap-y-1">
              <ListItems
                to="/direct-delivery"
                title={t("leftbar.title.directDelivery")}
                active={location === "/direct-delivery" ? true : false}
                totalOrders={directDeliveryOrders?.data?.length}
              />
              <ListItems
                to="/by-warehouse-delivery"
                title={t("leftbar.title.byWarehouse")}
                active={location === "/by-warehouse-delivery" ? true : false}
                totalOrders={byWarehouseOrders?.data?.length}
              />
              <hr className="border-none h-[1px] bg-black bg-opacity-30 mt-2" />
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <ListHead
                to="/intransit/incoming"
                title={t("leftbar.title.inTransit")}
                Icon={LuPackageCheck}
                size={26}
                active={
                  location === "/intransit/incoming" ||
                  location === "/intransit/incoming-details" ||
                  location === "/intransit/incoming-completed-details" ||
                  location === "/intransit/outgoing" ||
                  location === "/intransit/outgoing-details" ||
                  location === "/intransit/outgoing--completed-details"
                    ? true
                    : false
                }
              />
            </div>

            <div className="flex flex-col gap-y-1">
              <ListItems
                to="/intransit/incoming"
                title={t("leftbar.title.incoming")}
                active={
                  location === "/intransit/incoming-details" ||
                  location === "/intransit/incoming-completed-details"
                    ? true
                    : false
                }
                totalOrders={
                  intransitOrders?.data?.incoming?.inCompleted?.length +
                  intransitOrders?.data?.incoming?.inOngoing?.length
                }
              />
              <ListItems
                to="/intransit/outgoing"
                title={t("leftbar.title.outgoing")}
                active={
                  location === "/intransit/outgoing-details" ||
                  location === "/intransit/outgoing-completed-details"
                    ? true
                    : false
                }
                totalOrders={
                  intransitOrders?.data?.outgoing?.outCompleted?.length +
                  intransitOrders?.data?.outgoing?.outOngoing?.length
                }
              />

              <hr className="border-none h-[1px] bg-black bg-opacity-30 mt-2" />
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <ListHead
                to="/outgoing-package"
                active={
                  location === "/received" ||
                  location === "/received-details" ||
                  location === "/awaiting-driver" ||
                  location === "/awaiting-driver-detals" ||
                  location === "/on-the-way"
                }
                title={t("leftbar.title.orderManagementRico")}
                Icon={FiPackage}
                size={26}
              />
            </div>

            <div className="flex flex-col gap-y-1">
              <ListItems
                to="/received"
                title={t("leftbar.title.received")}
                active={location === "/received-details" ? true : false}
                totalOrders={receivedOrders?.data?.length}
              />
              <ListItems
                to="/awaiting-driver"
                title={t("leftbar.title.assignDriver")}
                active={location === "/awaiting-driver-details" ? true : false}
                totalOrders={assignDriverOrders?.data?.length}
              />
              <ListItems
                to="/on-the-way"
                title={t("leftbar.title.onTheWay")}
                active={location === "/on-the-way-details" ? true : false}
                totalOrders={onTheWayOrders?.data?.length}
              />
              <hr className="border-none h-[1px] bg-black bg-opacity-30 mt-2" />
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <ListHead
                to="/direct-delivery-orders"
                title={t("leftbar.title.directDeliveryOrders")}
                Icon={TbTruckDelivery}
                size={26}
                active={location === "/direct-delivery-details" ? true : false}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <ListHead
                to="/self-pickup"
                title={t("leftbar.title.selfPickup")}
                Icon={GiCardPickup}
                size={26}
                active={
                  location === "/self-pickup-details" ||
                  location === "/picked-by-customer-details"
                    ? true
                    : false
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <ListHead
                to="/completed"
                title={t("leftbar.title.completedOrders")}
                Icon={LuCalendarCheck2}
                size={26}
                active={location === "/completed-details" ? true : false}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <ListHead
                to="/cancelled"
                title={t("leftbar.title.cancelledOrders")}
                Icon={LuCalendarX2}
                size={26}
                active={location === "/cancelled-details" ? true : false}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <ListHead
                to="/drivers"
                title={t("leftbar.title.driver")}
                Icon={FaUserNurse}
                size={26}
                active={
                  location === "/driver-details" ||
                  location === "/create-driver/step-one" ||
                  location === "/create-driver/step-two" ||
                  location === "/create-driver/step-three" ||
                  location === "/update/driver-profile" ||
                  location === "/update/driver-vehicle-info" ||
                  location === "/update/driver-license-info"
                    ? true
                    : false
                }
              />
            </div>
          </div>
        </ul>
        <ul className="fixed bottom-5 bg-white z-20 w-[16.3%] xl:w-[13.3%]">
          <li>
            <button
              onClick={logoutFunc}
              className={`w-full flex items-center gap-x-4 rounded text-menuColor px-1 font-medium py-3`}
            >
              <AiOutlinePoweroff size={26} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
