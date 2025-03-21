import { ReactElement } from "react"

interface buttonProperies{
    title: string,
    style?: string,
    toolTipTitle: string,
    size: "sm" | "md" | "lg",
    type: "secondary" | "primary" | "logout",
    frontIcon?: ReactElement,
    backIcon?: ReactElement,
    onClick?: () => void
}

const buttonStyle = {
    "sm": "px-3 py-2 text-sm",
    "md": "px-4 py-2 text-lg",
    "lg": "px-5 py-3 text-2xl"
}

const buttonType = {
    "primary": "bg-[#5944e2] rounded-md text-white font-normal",
    "secondary": "bg-[#e1e7fe] rounded-md text-[#503fb9] font-normal",
    "logout": "bg-red-600 rounded-md text-white font-normal",
}

export default function Button(props: buttonProperies){
    return (
        <button title={props.toolTipTitle}
          className={`${buttonStyle[props.size]} ${buttonType[props.type]} transition-all duration-300 transform hover:scale-110`}
          onClick={props.onClick}
        >
          <div className="flex gap-1 justify-center items-center ">
            <span className="">{props.frontIcon}</span>
            <span className={props.style}>{props.title}</span>
          </div>
        </button>
      )
}