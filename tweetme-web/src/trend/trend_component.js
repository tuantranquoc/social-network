import React, {useEffect, useState} from "react";
import {apiTrendList} from "./lookup";
import '../App.css'

function Trend(props) {
    const {hashTag} = props;
    const [trend,setTrend] = useState(false);

    const whiteDB = {
         backgroundColor: "#f5f8fa",
    };

    const endpoint = `/hash_tag/search/${hashTag}`;
    console.log("tag", hashTag);
    return hashTag !== undefined ?
        <div className="my-auto d-inline-flex" onMouseEnter={e => setTrend(true)} onMouseLeave={e => setTrend(false)}>
            <a className="" href={endpoint}><p className="font-italic text-justify ml-1 mb-1"
                                               style={{
                                                   fontSize: "15px",
                                                   fontWeight: "500",
                                                   lineHeight: "20px",
                                                   color: "#14171a", fontFamily: "system-ui"
                                               }}>#{hashTag}</p>
            </a></div> : <div>not found</div>
}

export function TrendComponent(props) {
    const [didCall, setDidCall] = useState(false);
    const [trend, setTrend] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [tag, setTag] = useState(null);
    const [endpoint, setEndPoint] = useState("");
    const handleBackEndLookup = (response, status) => {
        if (status === 200) {
            console.log("set-trend", response);
            setTrend(response.results);
            setDidCall(true);
            if (response.next !== null) {
                setNextUrl(response.next)
            }
        }
    };
    useEffect(() => {
        if (didCall === false) {
            apiTrendList(handleBackEndLookup, nextUrl);
        }
    });

    const handleChange = (event) => {
        event.preventDefault();
        if (event.target.value !== undefined && event.target.value.length !== 0) {
            const hashTag = event.target.value;
            const newTags = hashTag.replace(/#/g,"-");
            console.log("hash_tag",newTags);
            setTag(newTags);
            const ep = `/hash_tag/search/${newTags}`;
            console.log("setHashTag", ep);
            setEndPoint(ep);
             console.log("setHashTag", endpoint);
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();
        console.log("endpoint-raw", endpoint)
    };

    return (trend !== undefined && trend.length !== 0) ?
        <div className="" style={{maxWidth:"498px"}}>
            <div className="position-relative" style={{width:"498px"}}>
                <input className="rounded-pill ml-2 mb-2 bx shadow-none border p-1 pl-3" maxLength="19"  type="text" style={{width:"250px",
                    fontSize: "15px",
                    fontWeight: "500",
                    lineHeight: "25px", fontFamily: "system-ui",paddingRight:"80px",textOverflow:"ellipsis",boxShadow:"none",border:"0"
                }} onChange={handleChange} placeholder="Search hash tag"/>
                <a style={{fontSize: "15px",
                fontWeight: "400",
                lineHeight: "20px"
              , fontFamily: "system-ui",marginLeft:"-76px"}} href={endpoint.length !== 0 ? endpoint : ""} className="btn rounded-pill btn-outline-info">Search</a>
            </div>
            <h6 className="ml-3 w-auto" style={{
                fontSize: "19px",
                fontWeight: "800",
                lineHeight: "25px",
                color: "#14171a", fontFamily: "system-ui"
            }}>Trends for you</h6>
            <div className="ml-3 rounded-circle" style={{width:"298px"}}>
                <div className="h-auto"
                     style={{width: "298px", background: "#f5f8fa", borderRadius: "20px", border: "1px"}}>
                    {trend.map((item, index) => {
                        return <div className="p-1 w-75 h-100 p-0">
                            <Trend hashTag={item.hash_tag}/>
                        </div>
                    })}</div>
            </div>
        </div> : null
}

