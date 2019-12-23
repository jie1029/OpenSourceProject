<template>
  <div id="JoinMenu">
    <div id="JoinContainer">
      <div class="input_row">
        <label for="id">아이디</label>
        <input type="text" class="inputArea" id="id" v-model="user.userid" />
      </div>
      <div class="input_row">
        <label for="password">비밀번호</label>
        <input type="password" class="inputArea" id="password" v-model="user.password" />
      </div>
      <div class="input_row">
        <label for="password">비밀번호 확인</label>
        <input type="password" class="inputArea" id="passwordcheck" v-model="user.passwordcheck" />
      </div>
      <div class="input_row">
        <label for="name">닉네임</label>
        <input type="text" class="inputArea" id="name" v-model="user.name" />
      </div>
      <div>
        <button class="btns" id="joinBtn"  @click="onJoin">가입하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data: function() {
    return {
      user: {
        userid: "",
        name: "",
        password: "",
        passwordcheck: ""
      },
      isCheck: false
    };
  },
  methods: {
     onJoin(){
      if(this.user.userid!=""&&this.user.name!=""&&this.user.password!=""&&this.user.passwordcheck!=""){
          this.$socket.emit("join_request",this.user);
      }
      else{
          alert("회원정보를 잘 입력해주세요!");
      }
    },
  }
};
</script>

<style>
#joinBtn{
  margin: 20px;
  width: 300px;
  height: 50px;
  font-size: 23px;
}
#JoinMenu {
  display: table;
  margin: auto;
  height: 70%;
}

#JoinContainer {
  display: table-cell;
  vertical-align: middle;
}

@media (max-width: 500px) {
  
  #joinBtn {
    margin: 3vh;
    width: 50vw;
    height: 6vh;
    font-size: 4vw;
  }
  #JoinMenu{
    margin-top:10vh;
    margin-bottom: 0px;
  }
}
</style>