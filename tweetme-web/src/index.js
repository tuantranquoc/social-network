import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {FeedComponent,TweetComponent, TweetDetailComponent, CommunityComponent} from "./tweets";
import {ProfileBadgeComponent} from "./profile";
import {CommentComponent, BookmarkComponent, HashTagComponent} from "./tweets/tweet_components";
import {TrendComponent} from "./trend/trend_component";
import {RecommendGlobalComponent,RecommendFeedComponent,RecommendProfileComponent} from "./recommend-user/recommend_user_components";
import {ChatComponents, ProfileList,ProfileMessageList} from "./chat/chat_components";
import {SideBarComponents} from "./nav/side";
import {NavBar} from "./nav/nav";
import {RegisterComponent} from "./auth/register";
import {LoginComponent} from "./auth/login";
import {EditComponent} from "./auth/edit";
import {LogoutComponent} from "./auth/logout";
import {ProfileListFollower} from "./chat/chat_components";
import {FooterComponent} from "./nav/footer";
import {HandleCreateAndListComponent} from "./tweets/components/global_component";
import {HandleCreateAndFeedComponent} from "./tweets/components/feed_component";
import {HandleCreateAndCommunityComponent} from "./tweets/components/community_component";
import {HandleCreateAndHashTagComponent} from "./tweets/components/hashtag_component";

const appEl = document.getElementById("root");
if (appEl) {
    ReactDOM.render(
        <React.StrictMode>
            <CommentComponent />
        </React.StrictMode>,
        document.getElementById('root')
    );
}
const e = React.createElement;

const tweetCommunityListEl = document.getElementById("tweetme-2-community-list");
if (tweetCommunityListEl) {
    ReactDOM.render(e(HandleCreateAndCommunityComponent, tweetCommunityListEl.dataset), tweetCommunityListEl);
}

const tweetHashTagSearchListEl = document.getElementById("tweetme-2-hashtag-list");
if (tweetHashTagSearchListEl) {
    ReactDOM.render(e(HandleCreateAndHashTagComponent, tweetHashTagSearchListEl.dataset), tweetHashTagSearchListEl);
}


const tweetEl = document.getElementById("tweetme-2");
if (tweetEl) {
    ReactDOM.render(e(TweetComponent, tweetEl.dataset), tweetEl);
}

const trendEl = document.getElementById("tweetme-2-toptrend");
if (trendEl) {
    ReactDOM.render(e(TrendComponent, trendEl.dataset), trendEl);
}

const chatEl = document.getElementById("tweetme-2-chat");
if (chatEl) {
    ReactDOM.render(e(ChatComponents, chatEl.dataset), chatEl);
}

const registerEl = document.getElementById("tweetme-2-register");
if (registerEl) {
    ReactDOM.render(e(RegisterComponent, registerEl.dataset), registerEl);
}

const loginEl = document.getElementById("tweetme-2-login");
if (loginEl) {
    ReactDOM.render(e(LoginComponent, loginEl.dataset), loginEl);
}

const editEl = document.getElementById("tweetme-2-edit");
if (editEl) {
    ReactDOM.render(e(EditComponent, editEl.dataset), editEl);
}

const logoutEl = document.getElementById("tweetme-2-logout");
if (logoutEl) {
    ReactDOM.render(e(LogoutComponent, logoutEl.dataset), logoutEl);
}



const tweetFeedEl = document.getElementById("tweetme-2-feed");
if (tweetFeedEl) {
    ReactDOM.render(e(FeedComponent, tweetFeedEl.dataset), tweetFeedEl);
}

const tweetListEl = document.getElementById("tweetme-2-list");
if (tweetListEl) {
    ReactDOM.render(e(HandleCreateAndListComponent, tweetListEl.dataset), tweetListEl);
}

const tweetFeedListEl = document.getElementById("tweetme-2-feed-list");
if (tweetFeedListEl) {
    ReactDOM.render(e(HandleCreateAndFeedComponent, tweetFeedListEl.dataset), tweetFeedListEl);
}

const tweetFollowingEl = document.getElementById("tweetme-2-following");
if (tweetFollowingEl) {
    ReactDOM.render(e(ProfileList, tweetFollowingEl.dataset), tweetFollowingEl);
}

const tweetFollowerEl = document.getElementById("tweetme-2-follower");
if (tweetFollowerEl) {
    ReactDOM.render(e(ProfileListFollower, tweetFollowerEl.dataset), tweetFollowerEl);
}


const tweetChatFollowingEl = document.getElementById("tweetme-2-chat-following");
if (tweetChatFollowingEl) {
    ReactDOM.render(e(ProfileMessageList, tweetChatFollowingEl.dataset), tweetChatFollowingEl);
}



const tweetBookmarkEl = document.getElementById("tweetme-2-bookmark");
if (tweetBookmarkEl) {
    ReactDOM.render(e(BookmarkComponent, tweetBookmarkEl.dataset), tweetBookmarkEl);
}

const tweetHashTagEl = document.getElementById("tweetme-2-hashtag");
if (tweetHashTagEl) {
    ReactDOM.render(e(HashTagComponent, tweetHashTagEl.dataset), tweetHashTagEl);
}

const tweetReGlobalEl = document.getElementById("tweetme-2-recommend-global");
if (tweetReGlobalEl) {
    ReactDOM.render(e(RecommendGlobalComponent, tweetReGlobalEl.dataset), tweetReGlobalEl);
}

const tweetReFeedEl = document.getElementById("tweetme-2-recommend-feed");
if (tweetReFeedEl) {
    ReactDOM.render(e(RecommendFeedComponent, tweetReFeedEl.dataset), tweetReFeedEl);
}

const tweetReProfileEl = document.getElementById("tweetme-2-recommend-profile");
if (tweetReProfileEl) {
    ReactDOM.render(e(RecommendProfileComponent, tweetReProfileEl.dataset), tweetReProfileEl);
}



const tweetCommunityFeedEl = document.getElementById("tweetme-2-community");
if (tweetCommunityFeedEl) {
    ReactDOM.render(e(CommunityComponent, tweetCommunityFeedEl.dataset), tweetCommunityFeedEl);
}

const tweetDetailElements = document.querySelectorAll(".tweetme-2-detail");
tweetDetailElements.forEach(container =>{
    ReactDOM.render(e(TweetDetailComponent, container.dataset), container);
});


const userProfileBadgeElements = document.querySelectorAll(".tweetme-2-profile-badge");
userProfileBadgeElements.forEach(container =>{
    ReactDOM.render(e(ProfileBadgeComponent, container.dataset), container);
});


const userCommentElements = document.querySelectorAll(".tweetme-2-comment");
userCommentElements.forEach(container =>{
    ReactDOM.render(e(CommentComponent, container.dataset), container);
});


const leftNavEl = document.getElementById("tweetme-2-left-nav");
if (leftNavEl) {
    ReactDOM.render(e(SideBarComponents, leftNavEl.dataset), leftNavEl);
}

const footerNavEl = document.getElementById("tweetme-2-footer");
if (footerNavEl) {
    ReactDOM.render(e(FooterComponent, footerNavEl.dataset), footerNavEl);
}

const navEl = document.getElementById("tweetme-2-nav");
if (navEl) {
    ReactDOM.render(e(NavBar, navEl.dataset), navEl);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
