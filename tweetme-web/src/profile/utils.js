import numeral from "numeral";
import React from "react";

export function DisplayCount(props) {
    return <span className={props.className} >{numeral(props.children).format("0a")}</span>
}