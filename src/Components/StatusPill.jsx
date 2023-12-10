import React from "react";
import { BsCheckLg } from "react-icons/bs";

export default function StatusPill(props) {
  return (
    <div className="space-y-1">
      {props.pillStatus === "completed" ? (
        <div
          className={`w-10 h-10 rounded-full border border-theme bg-theme text-white flex`}
        >
          <BsCheckLg size={28} className="m-auto" />
        </div>
      ) : props.pillStatus === "inProcess" ? (
        <div
          className={`w-10 h-10 rounded-full border border-theme bg-theme  flex animate-pulse`}
        >
          <div className="bg-white w-4 h-4 rounded-full m-auto"></div>
        </div>
      ) : (
        <div className={`w-10 h-10 rounded-full border`}></div>
      )}
      <h4 className={`font-bold text-sm leading-4`}>{props.title}</h4>
      <p className={`font-bold text-xs text-opacity-60 leading-4`}>
        {props.text}
      </p>
      <div className="flex flex-col font-medium text-xs">
        <div>{props.date}</div>
        <div>{props.time}</div>
      </div>
    </div>
  );
}
