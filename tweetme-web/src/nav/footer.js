import React from "react";

export function FooterComponent(props) {
    const pStyle = {
        fontFamily: "system-ui",
        fontWeight: "400",
        lineHeight: "17px",
        fontSize: "13px",
        color: "#657786"
    };
    return <div className="d-block">
        <div className="d-flex" style={{maxWidth: "498px"}}>
            <p className="mr-1 mb-0" style={pStyle}>Term</p>
            <p className="mr-1 mb-0" style={pStyle}>Privacy Policy</p>
            <p className="mr-1 mb-0" style={pStyle}>Cookies</p>
            <p className="mr-1 mb-0" style={pStyle}>Ads info</p>
        </div>
        <div className="d-flex" style={{maxWidth: "498px"}}>
            <p className="mr-1" style={pStyle}>@ 2020 k02q, lnc.</p>
            <a style={pStyle} href="http://dungtran.top">@dungtran.top</a>
        </div>
    </div>

}