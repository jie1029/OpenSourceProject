<template>
    <div id="mypage">
        <div id="mypage_container">
        <li id="newnameLine">
          <label id="newname">입장할 닉네임을 입력하세요 :</label>
          <input type="text" v-model="newNick" id="newname" />
        </li>
        <button class="btns" id="change_btn" @click="kakaoNewUserNick(newNick)">확인</button>
      </div>
    </div>
</template>

<script>
    export default {
      data: function() {
        return {
          newNick:""
        };
      },
      methods: {
        kakaoNewUserNick(newNick){
          this.$socket.emit("setNick",{
            id: this.$store.state.userID,
            nick: newNick,
            group: "kakao"
          });
        }
      }
    }
</script>

<style>

</style>