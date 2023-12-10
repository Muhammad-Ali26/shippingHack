// @ts-nocheck
import React, { useEffect, useState } from "react";
// import { FiSearch } from "react-icons/fi";
import { TfiWorld } from "react-icons/tfi";
import { PiUserBold } from "react-icons/pi";
// import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import i18next from "i18next";
import Select from "react-select";

export default function Header() {
  const storedLang = localStorage.getItem("selectedLang") || "en";
  const [lang, setLang] = useState(storedLang);

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
  ];

  const handleChange = (selectedOption) => {
    const selectedLang = selectedOption.value;
    setLang(selectedLang);
    i18next.changeLanguage(selectedLang);
    localStorage.setItem("selectedLang", selectedLang);
  };

  useEffect(() => {
    i18next.changeLanguage(lang);
  }, [lang]);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "transparent",
      outline: "none",
      boxShadow: state.isFocused ? `0 0 0 2px #00538C` : "none",
      cursor: "pointer",
      border: "2px solid white",
      "&:hover": {
        border: "2px solid white",
      },
    }),
    menu: (provided) => ({
      ...provided,
      color: "#00538C",
    }),
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected ? "#00538C" : provided.background,
      color: state.isSelected ? "white" : provided.color,
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "white" : "white",
      "&:hover": {
        color: "white",
      },
    }),
  };

  return (
    <header className="bg-theme fixed top-0 w-full z-10">
      <nav className=" w-11/12 m-auto py-5 flex justify-between items-center">
        <Link to="/">
          <img src="/images/logo.webp" alt="logo" className="w-44 xl:w-52" />
        </Link>

        {/* <div className="relative">
          <input
            type="search"
            placeholder="Search for anything.."
            className="bg-inputfieldBg w-[350px] xl:w-[450px] px-4 py-2.5 rounded-md outline-none placeholder:text-white text-white"
          />
          <FiSearch
            className="absolute top-2.5 right-3"
            size={20}
            color="white"
          />
        </div> */}

        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-2">
            <TfiWorld size={24} color="white" />
            <Select
              value={{
                value: lang,
                label: languages.find((l) => l.value === lang)?.label,
              }}
              onChange={handleChange}
              options={languages}
              className="text-theme"
              styles={customStyles}
            />
          </div>

          {/* <div>
            <IoIosNotificationsOutline size={26} color="white" />
          </div> */}

          <div className="flex items-center gap-x-2">
            <div className="w-12 h-12 bg-inputfieldBg rounded-full flex items-center justify-center">
              <PiUserBold size={28} color="white" />
            </div>
            <div>
              <h2 className="text-white text-sm font-semibold">
                {localStorage.getItem("userEmail") === "rico@gmail.com"
                  ? "Puerto Rico Warehouse"
                  : "USA Warehouse"}
              </h2>
              <p className="text-white text-xs font-normal">
                {localStorage.getItem("userEmail")}
              </p>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
