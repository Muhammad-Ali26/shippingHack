// @ts-nocheck
import React from "react";
import Layout from "../../Components/Layout";
import HomeCard from "../../Components/HomeCard";
import { LuPackageCheck, LuPackageX } from "react-icons/lu";
import GetAPI from "../../Utilities/GetAPI";
import Loader from "../../Components/Loader";
import { useTranslation } from "react-i18next";
import { TbPackageExport, TbPackageImport } from "react-icons/tb";
import { BsCashCoin } from "react-icons/bs";
import { FaTruckArrowRight } from "react-icons/fa6";
import { GiCardPickup } from "react-icons/gi";

export default function Home() {
  const { data } = GetAPI("warehouse/homepage");
  const { t } = useTranslation();

  return data.length === 0 ? (
    <Loader />
  ) : (
    <Layout
      title={t("pages.home.dasboard")}
      content={
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-5 py-5">
          {/* <HomeCard
            icon="1"
            title={t("pages.home.allOrder")}
            Icon={FiPackage}
            size={30}
            orders={data?.data?.allorders}
          /> */}
          <HomeCard
            icon="2"
            title={t("pages.home.incoming")}
            to="/incoming"
            Icon={TbPackageImport}
            size={34}
            orders={data?.data?.incoming}
          />
          <HomeCard
            icon="4"
            title={t("pages.home.waitingConsolidation")}
            to="/awaiting-consolidation"
            Icon={LuPackageX}
            size={30}
            orders={data?.data?.waitingForConsolidation}
          />
          <HomeCard
            icon="3"
            title={t("pages.home.pendingPayment")}
            to="/pending-payments"
            Icon={BsCashCoin}
            size={30}
            orders={data?.data?.pendingPayements}
          />
          <HomeCard
            icon="5"
            title={t("pages.home.readyToShip")}
            to="/ready-to-ship"
            Icon={FaTruckArrowRight}
            size={30}
            orders={data?.data?.readyToShip}
          />
          <HomeCard
            icon="6"
            title={t("pages.home.inTransitIncoming")}
            to="/intransit/incoming"
            Icon={TbPackageImport}
            size={34}
            orders={data?.data?.incomingTransit}
          />
          <HomeCard
            icon="6"
            title={t("pages.home.inTransitOutgoing")}
            to="/intransit/outgoing"
            Icon={TbPackageExport}
            size={34}
            orders={data?.data?.outgoingTransit}
          />
          <HomeCard
            icon="3"
            title={t("pages.home.received")}
            to="/incoming"
            Icon={LuPackageCheck}
            size={30}
            orders={data?.data?.receivedAtWarehouse}
          />
          <HomeCard
            icon="7"
            title={t("pages.home.deliverd")}
            to="/received"
            Icon={LuPackageCheck}
            size={30}
            orders={data?.data?.deliveredAtWarehouse}
          />
          <HomeCard
            icon="8"
            title={t("pages.home.selfPickup")}
            to="/self-pickup"
            Icon={GiCardPickup}
            size={30}
            orders={data?.data?.awaitingForSelfPickup}
          />
          <HomeCard
            icon="8"
            title={t("pages.home.completed")}
            to="/completed"
            Icon={LuPackageCheck}
            size={30}
            orders={data?.data?.deliveredToUser}
          />
          <HomeCard
            icon="8"
            title={t("pages.home.cancelled")}
            to="/cancelled"
            Icon={LuPackageX}
            size={30}
            orders={data?.data?.cancelled}
          />
        </div>
      }
    />
  );
}
