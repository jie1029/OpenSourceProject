<template>
  <div id="mypage">
    <div id="mypage_container">
      <li id="nickname">닉네임 : {{this.$store.state.userNick}}</li>
      <button class="btns" id="change_btn" @click="change_nick">{{change_btn_text}}</button>
      <div id="nickname_container" v-show="nickname">
        <li id="newnameLine">
          <label id="newname">새로운 닉네임을 입력하세요 :</label>
          <input type="text" v-model="newNick" id="newname" />
        </li>
        <button class="btns" id="change_btn" @click="confirm(newNick)">변경하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      nickname: false,
      newNick: "",
      change_btn_text: "닉네임 변경하기"
    };
  },
  computed: {
    ...mapGetters({
      getLoginStatus: "getLoginStatus"
    })
  },
  methods: {
    change_nick() {
      this.nickname = !this.nickname;
      if (this.nickname) {
        this.change_btn_text = "취소하기";
      } else {
        this.change_btn_text = "닉네임 변경하기";
      }
    },
    confirm(newNick){
      if (this.$store.state.loginStatus == "YES") {
      
        if(newNick != "")
          this.$socket.emit("changeNick",{
            originNick:this.$store.state.userNick,
            id: this.$store.state.userID,
            newNick: newNick,
            group: this.$store.state.userGroup
        });
        else 
          alert("제대로 입력해주세요!");
      }
    },

  }
};
</script>

<style>
#mypage {
  display: table;
  margin: auto;
  height: 100%;
}
#mypage_container {
  display: table-cell;
  vertical-align: middle;
}
#nickname {
  font-size: 50px;
  font-weight: bold;
  padding-bottom: 40px;
}
#change_btn {
  padding-right: 30px;
  padding-left: 30px;
  font-size: 28px;
}
#newname {
  font-size: 30px;
  margin: 5px;
  font-weight: bold;
}

#newnameLine {
  padding-top: 40px;
  padding-bottom: 40px;
}
@media (max-width: 500px) {
  #nickname {
    font-size: 10vw;
    padding-bottom: 6vh;
  }
  #change_btn {
    font-size: 7vw;
  }
  #newname {
    font-size: 7vw;
  }
  #newnameLine {
    padding-top: 6vh;
    padding-bottom: 6vh;
  }
}
</style>