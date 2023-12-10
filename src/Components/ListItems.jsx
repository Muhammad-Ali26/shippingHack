import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function ListItems(props) {
  const location = useLocation().pathname;

  return (
    <>
      <li>
        <Link
          to={props.to}
          className={`flex items-center justify-between gap-x-2 p-1 font-medium rounded-md hover:bg-theme [&>div:last-child]:hover:bg-white [&>div:last-child]:hover:text-theme hover:text-white
           duration-200 ${
             location === props.to || props.active
               ? "bg-theme text-white [&>div:last-child]:bg-white [&>div:last-child]:text-theme"
               : "text-menuColor"
           } `}
        >
          <div className="flex">
            <span>{props.title}</span>
          </div>
          <div
            className={`min-w-[20px] h-5 text-xs text-white font-semibold rounded-full flex justify-center items-center  ${
              location === props.to || props.active
                ? "bg-theme"
                : "bg-menuColor"
            }`}
          >
            {props.totalOrders ? props.totalOrders : "0" }
          </div>
        </Link>
      </li>
    </>
  );
}
