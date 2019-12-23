<template>
    <div class="slideImage">
        <span class="menuContainer" v-on:click="this.toggle">
            <i class="fas fa-list-ul menubars"></i>
        </span>
        <Sidebar>
            <ul id="Categories">
                <router-link class="link" v-if="this.$store.state.loginStatus == null" to="/"> 
                    <li id="li_btn" @click="this.toggle"> 
                        <i class="fas fa-sign-in-alt"></i> 로그인
                    </li>
                </router-link>
                <router-link class="link" v-else to="/mypage">
                    <li id="li_btn" @click="this.toggle">
                        <i class="fas fa-user-edit"></i>
                         {{this.$store.state.userNick}}님의 정보
                    </li>
                </router-link>
                <router-link class="link" v-if="this.$store.state.loginStatus != null" to="/calendar">
                    <li id="li_btn" @click="this.toggle">
                        <i class="far fa-calendar-check"></i> 일정 보기
                    </li>
                </router-link>
                <router-link class="link" v-if="this.$store.state.loginStatus != null" to="/map">
                    <li id="li_btn" @click="this.toggle">
                        <i class="fas fa-map-marker-alt"></i> 지도 보기
                    </li>
                </router-link>
                <li id="li_btn" class="link" v-if="this.$store.state.loginStatus != null" @click="onLogout">
                    <i class="fas fa-sign-out-alt"></i> 로그아웃
                </li>
            </ul>
        </Sidebar>
        
        <span class="guestInfo" @click="getlist">
            <i class="fas fa-user-friends guestInfoBtn"></i>
        </span>
        <GuestPanel>
            <ul>
                <li id="people">현재 접속 인원</li>
                <li v-for="member in this.getMembers" :key="member.id">
                    {{ member }}
                </li>
            </ul>
        </GuestPanel>
        
    </div>
</template>

<script>
import Sidebar from './Sidebar.vue';
import GuestPanel from './GuestPanel.vue'
import { mapGetters, mapMutations,mapActions } from 'vuex'

export default {
	data() {
		return {
		}
	},
	components: {
		//MenuForm,
        Sidebar,
        GuestPanel,
	},
	computed : {
		...mapGetters({
            getPanelIs : 'getPanelIs',
            getLoginStatus : 'getLoginStatus',
            getGuestPanel : 'getGuestPanelIs',
            getMembers : 'getMembers',
        }),
	},
	methods : { 
		...mapMutations({
            toggle : 'togglePanel',
            toggleGuest : 'toggleGuestPanel',
        }),
        ...mapActions(["logout"]),
        onLogout() {
               this.$store
        .dispatch("logout")
        .then(() => {
          alert("로그아웃 되었습니다!");
            this.toggle();
          var temp = this.$store.state.userNick;
           this.$store.state.userID="";
            this.$store.state.userNick="";
            this.$store.state.loginStatus = null;
            this.$router.push("/");
            

            this.$socket.emit("commit_logout", {
              nick: temp,
              
            });
        })
        .catch(response => {
          console.log(response);
        });
        },
        getlist(){
            this.$socket.emit("setMembers");
            this.toggleGuest(this.$store.state);
        },
      
	}
}
</script>

<style scoped>
    .guestInfo{
        position: fixed;
		top: 20px ;
		right: 20px;
        z-index: 1000;
        cursor: pointer;
    }
    .guestInfoBtn{
        font-size: 2rem;
        color: black;
    }
	.menuContainer {
        position: fixed;
		top: 20px;
		left: 20px;
        z-index: 1000;
        cursor: pointer;
    }
    .menubars {
        font-size: 2rem;
        color : #322F42;
    }
    li, button{
        font-size: 3vw;
        padding: 5px;
        margin-bottom: 2vw;
    }

    #li_btn:hover {
        text-decoration: underline;
        cursor: pointer;
    }
    #Categories{
        text-align: left;
    }
    ul{
        padding-top: 30px;
    }
    .link{
        color: black;
    }
    #people{
        border-bottom: solid; 
    }
    @media(max-width: 500px){
        .menuContainer {
            top: 2vh;
            left: 4vw;
        }
        .guestInfo{
            top: 2vh;
            right: 4vw;
        }
        .guestInfoBtn{
            font-size: 1.5rem;
            color: black;
        }
        .menubars {
            font-size: 1.5rem;
            color : #322F42;
        }
        li{
            font-size: 6vw;
            margin-top: 4vw;
        }
    }
</style>