import React from "react";
import { Link } from "react-router-dom";

export default function HomeCard(props) {
  const { Icon } = props;
  return (
    <Link to={props.to} className="bg-white rounded-lg shadow p-5 space-y-4">
      <h2 className="text-menuColor text-xl ">{props.title}</h2>

      <div className="flex gap-x-6 items-center">
        <div className="bg-theme w-12 h-12 flex justify-center items-center rounded-md">
          <Icon size={props.size} className="text-white" />
        </div>

        <div className="text-4xl font-semibold text-black">{props.orders}</div>
      </div>
    </Link>
  );
}
