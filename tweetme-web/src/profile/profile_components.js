import React from "react";
import 'font-awesome/css/font-awesome.min.css';
export function UserLink(props) {
    const {username} = props;
    const handleUserLink = (event) => {
        event.preventDefault();
        window.location.href = `/profile/${username}`
    };
    return <span className='pointer' onClick={handleUserLink}>
        {props.children}
    </span>
}

export function UserDisplay(props) {
    const {user, includeFullName, hideLink} = props;
    const nameDisplay = includeFullName === true ? `${user.first_name} ${user.last_name}` : null;
    return <React.Fragment>
        <div>
            {nameDisplay}{' '}
            {hideLink === true ? ` @${user.username}` : <UserLink username={user.username}>@{user.username}</UserLink>}
        </div>
    </React.Fragment>
}

export function UserPicture(props) {
    const {user, hideLink} = props;
    const userIdSpan = <img className="ml-2" src={user.avatar} style={{width:"45px",height:"45px",borderRadius: "50%"}}/>;
    return hideLink === true ? userIdSpan :
        <UserLink username={user.username}>{userIdSpan}
        </UserLink>
}

export function UserAvatar(props) {
    const {user} = props;
    return <img src={user.avatar} style={{width:"134px",height:"134px",borderRadius: "50%"}}/>
}

export function UserAvatarSm(props) {
    const {user} = props;
    return <img src={user.avatar} style={{width:"45px",height:"45px",borderRadius: "50%"}}/>
}







