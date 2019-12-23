<template>
  <div id="loginMenu">
    <div id="loginContainer">
      <div class="input_row">
        <label>ID</label>
        <input type="text" class="inputArea" id="id" v-model="userInfo.id" required=""/>
      </div>
      <div class="input_row">
        <label>PW</label>
        <input type="password" class="inputArea" id="password" v-model="userInfo.password" required=""/>
      </div>
      <router-link to="/join" tag="button" class="btns" id="btns">sign up</router-link>
      <button @click="onLogin_server" class="btns" id="btns">sign in</button>
      <KakaoLogin
        image="kakao_account_login_btn_medium_narrow"
        api-key="e65e5725ffa0d30c21cb99a9f863cdd4"
        :on-success=onSuccess
        :on-failure=onFailure
      />
    </div>
    
  </div>
</template>

<script src="//developers.kakao.com/sdk/js/kakao.min.js"/>
<script>
import { mapActions, mapMutations } from "vuex";
import KakaoLogin from 'vue-kakao-login'
//  e65e5725ffa0d30c21cb99a9f863cdd4  js-key
//  https://developers.kakao.com
// npm install --save vue-kakao-login

export default {
  components: {
   KakaoLogin
  },
  data: function() {
    return {
      userInfo: {
        id: "",
        password: ""
      }
    };
  },

  methods: {
    ...mapMutations({
      setMembers : 'setMembers'
    }),
    onLogin_server(){
      console.log("들어왔음");
      if(this.userInfo.id!=""&&this.userInfo.password!=""){
        
        this.$socket.emit("login_user",{
          id:this.userInfo.id,
          password: this.userInfo.password,
          group:"nomal"

        })
        
      }
      else{
        alert("회원정보를 입력해주세요!");
      }
    },
    KakaoLoginRequest(data){
        let json = JSON.stringify(data);
        this.$socket.emit("kakaoLoginRequest",{
          id: data.id,
          group: "kakao"
        });
    },
    onFailure(data){
      console.log(data)
      console.log("failure")
    },
    onSuccess(data){
      console.log(data)
      console.log("success")
      this.$socket.emit("setToken",data);
      Kakao.API.request({
      url: '/v2/user/me',
      success: this.KakaoLoginRequest,
      fail: function(error) {
        alert(JSON.stringify(error))
        }
      });
      
    },
    
  }
};
</script>

<style>
#loginMenu {
  display: table;
  margin: auto;
  margin-top: 100px;
  margin-bottom: 100px;
  height: 70%;
}

#loginContainer {
  display: table-cell;
  vertical-align: middle;
}

#btns {
  margin: 20px;
  width: 150px;
  height: 50px;
  font-size: 23px;
}
@media (max-width: 500px) {
  #btns {
    width: 29vw;
    height: 5vh;
    font-size: 4vw;
  }
  #loginMenu {
    margin-top:10vh;
    margin-bottom: 0px;
  }
}
</style>