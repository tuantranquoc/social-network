import React, {useState} from 'react'
import styled from "styled-components";

export function SideBarComponents(props) {
    const [isShown, setIsShown] = useState(false);
    const [anime, setAnime] = useState(false);
    const [news, setNews] = useState(false);
    const [art, setArt] = useState(false);
    const [music, setMusic] = useState(false);
    const [animal, setAnimal] = useState(false);

    const [home, setHome] = useState(false);
    const [profile, setProfile] = useState(false);
    const [notification, setNotification] = useState(false);
    const [message, setMessage] = useState(false);
    const [bookmark, setBookmark] = useState(false);
    const [create, setCreate] = useState(false);

    function changeTextColor(e) {
        e.target.style.color = '#1da1f2';
    }

    function changeTextColorLeave(e) {
        e.target.style.color = 'black';
        e.target.style.background = 'white';
    }

    const blueT = {
        color:"#1da1f2",
      fontSize: "19px",
        fontWeight: "700",
        lineHeight: "2px",
        fontFamily: "system-ui", textDecoration: "none", width: "100px",
    };

    const blackT = {
        fontSize: "19px",
        fontWeight: "700",
        lineHeight: "2px",
        color: "#14171a",
        fontFamily: "system-ui", textDecoration: "none", width: "100px",
    };

     const blueB = {
        backgroundColor: "#F0F8FF",
        maxWidth: "250px",
    };

    const yellowB = {
        backgroundColor: "#FFFF99",
        maxWidth: "150px",
        borderStyle: "solid",
        borderWidth:"2px",
        borderColor:"#bae8e8",
    };
    const whiteB = {
        backgroundColor: "white",
        maxWidth: "250px",
        border:"1px",
        borderColor:"black",
    };
    const style = {
        fontSize: "19px",
        fontWeight: "700",
        lineHeight: "2px",
        color: "#14171a",
        fontFamily: "system-ui", textDecoration: "none", width: "100px",
    };

    const HoverText = styled.a`
	color: #000;
	:hover {
		color: #ed1212;
		cursor: pointer;
		background:blue"
	}
`;

    return <div className="w-100" style={{width: "90%"}}>
        <nav className="navbar navbar-default p-0" style={{backgroundColor: "#ffffff"}}>
            <div className="container-fluid pl-4 mb-0" style={{border: "none", borderRadius: "10px"}}>
                <ul className="nav navbar-nav ">
                    <li className="active mb-3 text-left">
                        <div className="w-100 h-100 rounded-pill pb-1 pl-2" onMouseEnter={e => setHome(true)}
                        onMouseLeave={e => setHome(false)}
                        style={home === false ? whiteB : blueB}>
                            <a className="w-100 h-100" style={home === false ? blackT : blueT}
                                href="/">
                                <i className="fa fa-home" style={{fontSize: "19px"}} aria-hidden="true">
                                </i> Home</a></div>
                    </li>
                    <li className="mb-3 text-left">
                        <div className="w-100 h-100 rounded-pill pb-1 pl-2 text-left" onMouseEnter={e => setProfile(true)}
                        onMouseLeave={e => setProfile(false)}
                        style={profile === false ? whiteB : blueB}><a href="/profile/" style={profile === false ? blackT : blueT}
                                                                                                ><i
                            className="fa fa-user"
                            style={{fontSize: "19px"}}
                            aria-hidden="true">
                        </i> <HoverText>Profile</HoverText></a></div>
                    </li>
                    <li className="mb-3 text-left">
                        <div className="w-100 h-100 pl-2 pr-2 rounded-pill pb-1 px-0" onMouseEnter={e => setNotification(true)}
                        onMouseLeave={e => setNotification(false)}
                        style={notification === false ? whiteB : blueB}>
                            <a href="#" style={notification === false ? blackT : blueT} >
                                <i className="fa fa-bell" style={{fontSize: "19px"}} aria-hidden="true">
                                </i> Notifications
                            </a></div>
                    </li>
                    <li className="mb-3 text-left">
                        <div className="w-100 h-100 pl-2 rounded-pill pb-1 px-0" onMouseEnter={e => setMessage(true)}
                        onMouseLeave={e => setMessage(false)}
                        style={message === false ? whiteB : blueB}><a href="/chat/following/search"
                                                                                          style={message === false ? blackT : blueT}
                                                                                          ><i
                            className="fa fa-envelope"
                            style={{fontSize: "19px"}}
                            aria-hidden="true">
                        </i> Message</a></div>
                    </li>
                    <li className="mb-3 text-left">
                        <div className="w-100 h-100 pl-2 rounded-pill pb-1 px-0" onMouseEnter={e => setBookmark(true)}
                        onMouseLeave={e => setBookmark(false)}
                        style={bookmark === false ? whiteB : blueB}>
                            <a href="/bookmark/" style={bookmark === false ? blackT : blueT}>
                                <i className="fa fa-bookmark" style={{fontSize: "19px"}} aria-hidden="true">
                                </i> Bookmark</a></div>
                    </li>
                    <li onClick="topFunction()" className="mb-3 text-left">
                        <div className="w-100 h-100 pl-2 rounded-pill pb-1 px-0" onMouseEnter={e => setCreate(true)}
                        onMouseLeave={e => setCreate(false)}
                        style={create === false ? whiteB : blueB}><a href="#" style={create === false ? blackT : blueT}><i className="fa fa-inbox"
                                                                                                 style={{fontSize: "19px"}}
                                                                                                 aria-hidden="true">
                        </i> Create Tweet</a></div>
                    </li>
                </ul>
            </div>
            <div className="mb-2 ml-4 mr-auto" style={{height: "1px", width: "157px", backgroundColor: "black"}}>
            </div>
            <div className="container-fluid pl-4 mb-3" style={{border: "none", borderRadius: "10px"}}>
                <ul className="nav ml-2 navbar-nav" style={{fontSize: "15px"}}>
                    <li className="active mb-2"><a style={{
                        fontFamily: "system-ui", textDecoration: "none", fontWeight: "700",
                        lineHeight: "2px", fontSize: "18px", color: "black"
                    }} className="d-inline-flex text-center" href="/">Communities</a>
                    </li>
                    <li className="mb-1 p-1 pl-2 rounded-pill" onMouseEnter={e => setNews(true)}
                        onMouseLeave={e => setNews(false)}
                        style={news === false ? whiteB : yellowB}><a className="" style={{
                        fontFamily: "system-ui",
                        textDecoration: "none",
                        fontWeight: "500",
                        fontSize: "18px"
                    }} href="/community/news/"> News</a></li>
                    <li className="mb-1 p-1 pl-2 rounded-pill" onMouseEnter={e => setAnime(true)}
                        onMouseLeave={e => setAnime(false)}
                        style={anime === false ? whiteB : yellowB}><a
                        style={{fontFamily: "system-ui", textDecoration: "none", fontWeight: "500", fontSize: "18px"}}
                        href="/community/anime/">Anime</a></li>
                    <li className="mb-1 p-1 pl-2 rounded-pill" onMouseEnter={e => setArt(true)}
                        onMouseLeave={e => setArt(false)}
                        style={art === false ? whiteB : yellowB}><a
                        style={{fontFamily: "system-ui", textDecoration: "none", fontWeight: "500", fontSize: "18px"}}
                        href="/community/art & design/">Art & Design</a></li>
                    <li className="mb-1 p-1 pl-2 rounded-pill" onMouseEnter={e => setMusic(true)}
                        onMouseLeave={e => setMusic(false)}
                        style={music === false ? whiteB : yellowB}><a
                        style={{fontFamily: "system-ui", textDecoration: "none", fontWeight: "500", fontSize: "18px"}}
                        href="/community/music/">Music</a></li>
                    <li className="mb-1 p-1 pl-2 rounded-pill" onMouseEnter={e => setAnimal(true)}
                        onMouseLeave={e => setAnimal(false)}
                        style={animal === false ? whiteB : yellowB}><a
                        style={{fontFamily: "system-ui", textDecoration: "none", fontWeight: "500", fontSize: "18px"}}
                        href="/community/animals & pets/">Animals & Pets</a></li>
                </ul>
            </div>
        </nav>
    </div>
}