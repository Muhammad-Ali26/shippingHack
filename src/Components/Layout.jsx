// @ts-nocheck
import React from "react";
import Header from "./Header";
import LeftBar from "./LeftBar";
import MainSection from "./MainSection";

export default function Layout(props) {
  return (
    <>
      <Header />
      <LeftBar />
      <MainSection
        filter={props.filter}
        search={props.search}
        searchOnChange={props.searchOnChange}
        searchValue={props.searchValue}
        title={props.title}
        companyOnChange={props.companyOnChange}
        companyOptions={props.companyOptions}
        companyValue={props.companyValue}
        warehouseOnChange={props.warehouseOnChange}
        warehouseOptions={props.warehouseOptions}
        warehouseValue={props.warehouseValue}
        content={props.content}
        readyToShipTab={props.readyToShipTab}
      />
    </>
  );
}
