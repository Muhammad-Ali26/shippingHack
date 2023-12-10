import React from "react";
import { FiSearch } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import Select from "react-select";

export default function MainSection(props) {
  const location = useLocation().pathname;

  return (
    <div className="bg-themeGray p-5 xl:p-10 w-[80%] xl:w-[85%] min-h-[calc(100vh-92px)] mt-[88px] xl:mt-[92px] float-right space-y-5">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-theme">{props.title}</h1>
        <div className="relative flex gap-x-4">
          {props.search ? (
            <>
              <input
                type="search"
                placeholder="Search for anything..."
                className="bg-white w-[350px] xl:w-[450px] px-9 py-2.5 rounded-md outline-none placeholder:text-menuColor placeholder:text-lg"
                onChange={props.searchOnChange}
                value={props.searchValue}
              />
              <FiSearch
                className="absolute top-3 left-2"
                size={20}
                color="#00000099"
              />
            </>
          ) : (
            ""
          )}

          {props.filter ? (
            <>
              <div>
                <Select
                  value={props.companyValue}
                  onChange={props.companyOnChange}
                  options={props.companyOptions}
                  inputId="companyType"
                  placeholder="Select Logistic Company"
                />
              </div>
              {location === "/by-warehouse-delivery" ||
              props.readyToShipTab === "By Warehouse Delivery Orders" ? (
                <div>
                  <Select
                    value={props.warehouseValue}
                    onChange={props.warehouseOnChange}
                    options={props.warehouseOptions}
                    inputId="warehouseType"
                    placeholder="Select Warehouse"
                  />
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      {props.content}
    </div>
  );
}
