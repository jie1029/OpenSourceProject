<template>
  <div id="app">
    <Menu></Menu>
    <Header></Header>
    <transition name="slide-fade">
      <router-view />
    </transition>
  </div>
</template>
<script src= "http://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script>
import Menu from "@/components/SlideMenu";
import Header from "@/components/Header";
import { mapGetters, mapMutations,mapActions } from 'vuex';

export default {
  name: "app",
  components: {
    Menu,
    Header,
  },
  data() {
    return {
      messages: this.$store.state.messages,
      typings: this.$store.state.typings,
      festivals: this.$store.state.festivals,
      fes_things: [],
      noti_check:[],
    };
  },
  computed:{
    ...mapGetters({
      getFestivalIndex : "getFestivalIndex",
      getFestivalPast : "getFestivalPast"
    })
  },
  created() {
    // created callback of vue instance
    this.$socket.emit("reqCalendar",data=>{});

    this.$socket.on("festivalList",data=>{
      this.setPast(this.getFestivalIndex)
      for(var i = 0; i<data.length; i++){
        this.fes_things.push(data[i]);
        this.festivals.push(
          "id: "+ data[i].id+ 
          "<br>name: "+ data[i].name+
          "<br>location: "+ data[i].location+
          "<br>start: "+ data[i].start+
          "<br>end: "+ data[i].end+
          "<br>content: "+ data[i].content+
          "<br>organiser: "+ data[i].organiser+
          "<br>tell: "+ data[i].tell+
          "<br>site: "+ data[i].site+
          "<br>hashTag: "+ data[i].hashTag+
          "<br>roadAddress: "+ data[i].roadAddress+
          "<br>landAddress: "+ data[i].landAddress
        );
      }
      this.setIndex(data.length)
      this.messages["msg"].push([this.getFestivalPast, this.getFestivalIndex+this.getFestivalPast]);
      this.messages["nick"].push("festival");
      this.messages["time"].push("");
    });
    
    this.$socket.on("chat-message", data => {
      // when "chat-message" comes from the server
      console.log("msg received from server");
      //console.log(data);
      this.messages["msg"].push(data.message);
      this.messages["nick"].push(data.nick);
      this.messages["time"].push(data.time);
      console.log(data.time);
      //console.log(this.messages["msg"][0]);
      //console.log(this.messages["msg"].length);

     
    });

    this.$socket.on("warning", data=>{
      console.log(data.nick+"님이 욕설 했다!");

      this.addWarning(data);
       this.messages["msg"].push(data.message);
      this.messages["nick"].push("시저리");
      this.messages["time"].push("");
    });

    // 챗봇에게 이름물어볼때
    this.$socket.on("chat-name", data => {
      console.log(data);
      this.messages["msg"].push(data);
      this.messages["nick"].push("시저리");
      this.messages["time"].push("");
    });

    //입장했을때
    this.$socket.on("new-user", data => {
      console.log(data.message);
      this.messages["msg"].push(data.message);
      this.messages["nick"].push("시저리");
      this.messages["time"].push("");
    });

 //퇴장했을때
    this.$socket.on("logout", data => {
      console.log(data.message);
      this.messages["msg"].push(data.message);
      this.messages["nick"].push("시저리");
      this.messages["time"].push("");

    });

    //타이핑 치고있을때
    this.$socket.on("isTyping", data => {
      var check = 1;
      console.log("typing received from server");
      //console.log(this.typings);
      //console.log(data);
      if (data.typing != "noting") {
        for (var i = 0; i < this.typings.length; i++) {
          if (this.typings[i] == data.nick) check = 0;
        }
    
        if (check) {
          this.typings.push(data.nick)
          check = 0;
        };
      } 
      else{
          console.log("타이핑 들어옴!");
          //console.log(this.typings.indexOf(data.nick));
          this.typings.splice(this.typings.indexOf(data.nick), 1);
        
      }
    });
    //닉네임변경했을때 알림
    this.$socket.on("changeNick", data => {
      this.$store.state.userNick = data.newNick;
      alert("닉네임이 변경되었습니다!");
      this.$router.push("/message");

    });
    this.$socket.on("changeNickFail",data=>{
      if(data == "SAMENICK")
        alert("중복된 닉네임 입니다!");
      else
        alert("닉네임을 변경할 수 없습니다!");
    });
  //멤버 리스트 구성
    this.$socket.on("setMembers",data =>{
      this.setMembers(data);
    });
    //챗봇에게 현재 접속인원 물어볼때
  this.$socket.on("chat-member", data=>{
      this.messages["msg"].push(data);
      this.messages["nick"].push("시저리");
      this.messages["time"].push("");
    });
  this.$socket.on("login_success",data=>{
    console.log("로그인성공");
    this.Login_success(data);
  });
  this.$socket.on("login_fail",data=>{
    console.log(data);
    if(data.message == "fail")
      alert("회원정보를 잘 입력해주세요!");
    else if(data.message == "warning")
      alert("과도한 욕설 사용으로 제한되셨습니다!");
  });
  this.$socket.on("kakaoNewUser",data=>{
    console.log("새로운 카카오 유저!");
    //여기부터 다시
    //this.$store.state.loginStatus = "YES";
    this.$store.state.userID = data.id
    //this.$store.state.warningStatus = data.warning
    this.$router.push("/kakaonick");
    //this.Login_success(data);
  });
  this.$socket.on("KaKaoNewUserNick",data=>{

    this.Login_success(data);
  });
  this.$socket.on("join_fail",joinStatus=>{
    console.log(joinStatus);
    if(joinStatus == "password")
      alert("패스워드를 다시 입력해주세요!")
    
    else if(joinStatus == "sameNick")
      alert("중복된 닉네임 입니다!");
    
    else
      alert("중복된 아이디 입니다!");
  });
  this.$socket.on("join_success",data=>{
    alert("회원가입 성공!");
    this.$router.push("/");
  });
  this.$socket.on("showCalendar",data=>{
    this.$store.state.calendarEvents.splice(0);
    console.log(data);
    if(data == null) console.log("축제가 없음");
    else
    for(var i = 0; i<data.length; i++){
      console.log(data[i]);
      //data[i].end = Date.parse(data[i].end)+1;
      let temp ={}
      temp.id = data[i].id
      temp.title = data[i].title;
      temp.address = data[i].address;
      temp.start = data[i].start;
      temp.end = Date.parse(data[i].end)+1;

      this.noti_check.push(temp);
      this.$store.state.calendarEvents.push(temp);
    }
  });
   this.$socket.on("fes_search",data =>{
       console.log("검색해랑");
      for(var i=0;i<this.fes_things.length;i++){
        console.log(this.fes_things[i].id);
        if(this.fes_things[i].id==data){
          window.open(this.fes_things[i].site,"Siseries","");
        }
      }
    });
    
    this.$socket.on("noti",data=>{
      console.log("할룽");
      console.log("좀떠라 " + this.noti_check.length);

       for(var i=0;i<this.noti_check.length;i++)
        {
          console.log("좀떠라 " + String(this.noti_check[i].start))
          var today=new Date('2019-12-02');
                var str=this.noti_check[i].start.split('-');
                console.log(today.getFullYear()+" "+(today.getMonth()+1)+" "+today.getDate()+" "+str[0]+" "+str[1]+" "+str[2]);
                if(String(today.getFullYear())==str[0]){
                  if(String(today.getMonth()+1)==str[1]){
                    if(str[2]-String(today.getDate())<4){
                      Notification.requestPermission(function(result) {
            if (result === 'granted') {
                var notification = new Notification('Siseries', {
                body: "날짜를 확인하세용",
                icon: "/siserie_icon.png"
                });
                notification.onclick = function(event) {
                event.preventDefault(); // prevent the browser from focusing the Notification's tab
                window.open('https://7883c753.ngrok.io', '_blank');
                }
            }
        })
                    }
                  }
                }
              }
  });
  },


  methods:{
    ...mapMutations({
      setMembers : "setMembers",
      toggleGuestPanel : "toggleGuestPanel",
      setPast : "setPast",
      setIndex : "setIndex"
    }),
    //경고추가
    ...mapActions(["addWarning"]),
    addWarning(data)
    {
      console.log("욕설들어옴!")
      this.$store
        .dispatch("addWarning", data)
        .then(() => {
          
        })
        .catch(response => {
          console.log(response);
        });

    },
    ...mapActions(["login"]),
    Login_success(data)
    {
      console.log("함수까지 들어옴");
      this.$store
        .dispatch("login", data)
        .then(() => {
          if (this.$store.state.loginStatus == "YES") {
              // 입장
              this.$store.state.messages['nick']=[""];
              this.$store.state.messages['msg']=[""];
              this.$store.state.messages['time']=[""];

              this.$socket.emit("new-user", {
                nick: this.$store.state.userNick,
                message: ""
              });
              alert("안녕하세요! 저는 시저리에요!");
              //this.setMembers({member:this.$store.state.userNick, log:"+"});
              this.$router.push("/message");
               this.$socket.emit("calendar_check", "");
            } 
        })
        .catch(response => {})

    },
    

  }
};
</script>

<style>
@font-face {
  font-family: webisfree;
  src: url("./fonts/NanumSquare_acB.ttf");
}

* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "webisfree", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(to top, #d9afd9 0%, #97d9e1 100%);
  overflow: auto;
}
.frame {
  background-color: transparent;
  box-shadow: 1.3px 1.3px 1.3px 1.3px rgba(68, 68, 68, 0.103);
}

.btns {
  background-color: rgba(148, 10, 167, 0.733);
  border-radius: 5px;
  color: rgb(238, 236, 236);
  font-weight: bold;
  border: 1px solid transparent;
}

.input_row {
  font-size: 30px;
  font-weight: bold;
  margin: 20px;
  text-align: left;
}

.input_row > label {
  width: 180px;
}

.inputArea {
  width: 230px;
}

input[type="text"],
[type="password"] {
  border: 1px solid transparent;
  border-radius: 5px;
  font-weight: bold;
  padding-left: 10px;
  padding-right: 10px;
}

li {
  list-style: none;
}
@media (max-width: 500px) {
  .input_row {
    font-size: 5vw;
  }
  .input_row > label {
    width: 32vw;
  }
  .inputArea {
    width: 50vw;
  }
}

.slide-fade-enter-active {
  transition: all 0.8s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>