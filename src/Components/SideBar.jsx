import React from "react";
import { Link } from "react-router-dom";

export default function SideBar() {
  return (
    <div className="lg:py-12 py-4 lg:px-12 px-2 flex lg:flex-col items-center justify-center lg:gap-y-12 lg:border-r border-white border-opacity-40 h-72 m-auto w-full">
      <Link to="/" className="p-0">
        <img
          src="/images/logo.webp"
          alt="logo"
          className="xl:w-60 lg:w-52 w-40"
        />
      </Link>
    </div>
  );
}
