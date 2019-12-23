// store.js
import Vue from 'vue';
import Vuex from 'vuex';
//import axios from 'axios'
// import VueSession from 'vue-session';

Vue.use(Vuex);
// Vue.use(VueSession);
export const store = new Vuex.Store({
         // 상태
         state: {
           isPanelOpen: false,
           isGuestPanelOpen: false,
           warningStatus: window.sessionStorage.getItem("warningStatus") || 0,
           loginStatus:"YES", //window.sessionStorage.getItem('loginStatus')|| null,
           userNick: "공주",//window.sessionStorage.getItem("userNick") || "",
           userID: window.sessionStorage.getItem("userID") || "",
           userGroup: window.sessionStorage.getItem("userGroup") || "",
           messages: {
             nick: [""],
             msg: [""],
             time:[""]
           },
           typings: [],
           members: [],
           calendarEvents: [],
           clickedAddress:"",
           festivals: [],
           festivalPast: 0,
           festivalIndex: 0
         },
         // Getter
         getters: {
           getPanelIs(state) {
             return state.isPanelOpen;
           },
           getGuestPanelIs(state) {
             return state.isGuestPanelOpen;
           },
           getLoginStatus(state) {
             return state.loginStatus;
           },
           getUserNick(state) {
             return state.userNick;
           },
           getMembers(state) {
             return state.members;
           },
           getTypings(state) {
             return state.typings;
           },
           getFestivalPast(state) {
             return state.festivalPast;
           },
           getFestivalIndex(state){
               return state.festivalIndex;
           },
           getFestivals(state){
             return state.festivals;
           },
           getEventsLength(state){
             return state.calendarEvents.length;
           }
         },
         // Method
         mutations: {
           setPast(state, now) {
             state.festivalPast += now;
             console.log("past:");
             console.log(state.festivalPast);
           },
           setIndex(state,now){
            state.festivalIndex = now;
            console.log("index");
            console.log(state.festivalIndex);
           },
           togglePanel(state) {
             state.isPanelOpen = !state.isPanelOpen;
           },
           toggleGuestPanel(state) {
             state.isGuestPanelOpen = !state.isGuestPanelOpen;
           },

           setLoginStatus(state, payload) {
             console.log(payload);
             if (payload.loginStatus == "YES") {
               // this.$session.start()
               // this.$session.set('jwt', response.payload.id)
               //localStorage.setItem("token",payload.id);
               state.loginStatus = payload.loginStatus;
               state.userNick = payload.Nick;
               state.userID = payload.id;
               state.warningStatus = payload.Warning;
               state.userGroup = payload.Group;
             }
           },
           setMembers(state, payload) {
             state.members = payload;
             console.log(JSON.stringify(state.members));
           }
         },
         // Actions
         actions: {
           login(context, data) {
             console.log(data);
             // console.log(response);
             // //context({token});
             this.commit("setLoginStatus", {
               loginStatus: data.status,
               Nick: data.nick,
               id: data.id,
               Warning: data.warning,
               Group: data.group
             });
             window.sessionStorage.setItem("userID", this.state.userID);
             window.sessionStorage.setItem("userNick", this.state.userNick);
             window.sessionStorage.setItem(
               "loginStatus",
               this.state.loginStatus
             );
             window.sessionStorage.setItem(
               "warningStatus",
               this.state.warningStatus
             );
             window.sessionStorage.setItem("userGroup", this.state.userGroup);
           },
           logout() {
             //console.log("들어왔다!");
             window.sessionStorage.removeItem("userID");
             window.sessionStorage.removeItem("userNick");
             window.sessionStorage.removeItem("loginStatus");
             window.sessionStorage.removeItem("warningStatus");
             window.sessionStorage.removeItem("userGroup");
           },
           addWarning(context, data) {
             this.state.warningStatus = data.warningStatus;
             window.sessionStorage.setItem(
               "warningStatus",
               this.state.warningStatus
             );
           }
         }
       });