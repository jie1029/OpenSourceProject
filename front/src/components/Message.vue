<template>
  <div>
    <ChatList></ChatList>

    <Input @send="send($event)" />
  </div>
</template>

<script>
import ChatList from "@/components/ChatList.vue";
import Input from "@/components/Input.vue";

export default {
  name: "app",
  components: {
    ChatList,
    Input
  },
  data: function() {
    // data
    return {
      messages: this.$store.state.messages
      //socket: this.$io("localhost:3000") // socket connection to server
    };
  },

  methods: {
    send(data) {
      // implementation of send method for vue instance
      
      if(this.$store.state.warningStatus < 8){
        if (data != "") {
          
          var d = new Date();
          var hour = d.getHours();
          var minute = d.getMinutes();
          var time = "";
          if(hour > 12){
            time +="오후 ";
            hour -=12;
          }
          else if(hour == 12) time +="오후 ";
          else time +="오전 ";

          time += hour+":"+minute;

          var userNick = this.$store.state.userNick;
          this.messages["msg"].push(data);
          this.messages["nick"].push(userNick);
          this.messages["time"].push(time);
          console.log(time);

          
            this.$socket.emit("chat-message", {
              nick: this.$store.state.userNick,
              warningStatus:this.$store.state.warningStatus,
              message: data,
              group:this.$store.state.userGroup,
              time:time
              // emitting "chat-message" to the server
            });
          
        }
      }
      else if(this.$store.state.warningStatus == 8)
      {
        var temp = this.$store.state.userNick+"님께서 벤당하셨습니다.";
        this.messages["msg"].push(temp); 
        this.messages["nick"].push("시저리");
      }
      else{
        alert("과다한 욕설사용으로 채팅에서 벤당하셨습니다!!!");
      }
    }
  }
};
</script>

<style>
</style>