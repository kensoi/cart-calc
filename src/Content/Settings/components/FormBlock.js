import { useContext } from "react";
import { ToolKitContext } from "@web-cross-ui/utils/toolkit"

export function FormBlock(props) {  
  const toolkit = useContext(ToolKitContext)

  const ClassList = ["form-block"]

  if (toolkit.settings.loaded) {
    ClassList.push("visible");
  }

  if (toolkit.settings.mounted) {
    return <div className={ClassList.join(" ")}>
      {props.children}
    </div>
  }

  return <></>
}