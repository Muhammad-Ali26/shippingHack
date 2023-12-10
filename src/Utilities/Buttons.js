import React from "react";
import { HiArrowLeft } from "react-icons/hi"
export function TabButton(props) {
    return (
        <>
            <div className="flex justify-between">
                {props.text ?
                    props.text.map((ele) => (<div className="space-y-4">
                        <button onClick={() => { props.set(ele) }} className={`text-start text-xl font-medium relative ${ele === props.tab ? "text-theme before:absolute before:h-2 before:w-full before:bg-theme before:-bottom-4 before:rounded-full" : "text-tabColor"}`}>
                            {ele}
                        </button>
                    </div>))
                    : ''}
            </div>
            <div className="w-full h-2 bg-tabLine col-span-full rounded-full"></div>
        </>

    );
}
export function TabButtonTwo(props) {
    return (
        <>
            <div className="flex">
                {props.text ?
                    props.text.map((ele) => (<div className="space-y-4">
                        <button onClick={() => { props.setTwo(ele) }} className={`py-2.5 px-3 border border-theme font-semibold 
                         ${ele === props.tabTwo ? "bg-theme text-white" : "text-theme bg-transparent"}`}>
                            {ele}
                        </button>
                    </div>))
                    : ''}
            </div>
        </>

    );
}

export function BackButton(props) {
    return (
        <button
            onClick={() => window.history.back()}
            className="flex items-center gap-x-2 font-medium text-base text-white bg-theme py-2.5 px-5 border border-theme rounded hover:bg-transparent
             hover:text-theme duration-200"
        >
            <HiArrowLeft />
            {props.name}
        </button>
    );
}


export function ModalButtons(props) {
    return (
        <div className="flex justify-end gap-x-2">
            <button
                type="button"
                onClick={props.close}
                className="py-2.5 w-24 rounded font-medium text-sm text-themePurple border border-themePurple hover:bg-themePurple hover:text-white"
            >
                Cancel
            </button>
            <button
                type="submit"
                onClick={props.action}
                disabled={props.disabled}
                className="py-2.5 w-24 rounded font-medium text-sm text-white bg-themePurple border border-themePurple hover:bg-transparent hover:text-themePurple"
            >
                {props.text}
            </button>
        </div>
    );
}


