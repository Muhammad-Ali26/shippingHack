// @ts-nocheck
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function ListHead(props) {
  const { Icon } = props;
  const location = useLocation().pathname;

  return (
    <>
      <Link
        to={props.to}
        className={`flex items-center justify-between gap-x-2 py-2.5 px-1 rounded-md my-1 font-medium hover:bg-theme hover:text-white duration-200 ${
          location === props.to || props.active
            ? "text-white bg-theme"
            : "text-menuColor"
        } `}
        onClick={props.onClick}
      >
        <div className="grid grid-cols-4 xl:grid-cols-7 gap-x-3">
          <Icon size={props.size} />
          <h1 className="col-span-3 xl:col-span-6">{props.title}</h1>
        </div>
      </Link>
      <hr
        className={`border-none h-[1px] ${
          location === props.to ? "bg-theme" : "bg-black bg-opacity-30"
        }  `}
      />
    </>
  );
}
