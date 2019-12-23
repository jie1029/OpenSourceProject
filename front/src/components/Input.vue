<template>
  <div>
    <div v-if="this.uploadBtn" id="upload">
        <VueUploadcare :url.sync="photoUrl"></VueUploadcare>
    </div>
    <div class="frame" id="chatBar">
      <!-- <button type="button" @click="rec()">클릭해보셈</button>
      <button type="button" @click="stop()">종료하셈</button> -->
      <!-- Prevent default event for submit, execute send method instead-->
      <i id="uploadBtn" class="fas fa-upload" @click="clickUploadBtn()"></i>
      <div id="inputsText">
        <form id="inputContainer" @submit.prevent="emit_msg">
          <input type="text" id="textArea" placeholder="입력하세요." v-model="newMessage"/>
          <!-- binding with newMessage variable v-model="newMessage"-->
        </form>
        <i id="voiceOver" class="fas fa-microphone" @click="voiceSwitch()"></i>
      </div>
      
      <form id="inputsSend" @submit.prevent="emit_msg">
        <button class="btns" id="sendBtn">Send</button>
      </form>
    </div>
  </div>
</template>


<script>
import VueUploadcare from 'vue-uploadcare'
//npm install vue-uploadcare

export default {
  data: function() {
    return {
      newMessage:"",
      photoUrl:'',
      uploadBtn:false,
      recognition :'',
      voiceOver:false,
      finalTranscript:'',
    };
  },
  components:{
    VueUploadcare
  },
  updated(){
    if(this.photoUrl!=''){
      this.newMessage="<img width=60% height=width src='"+this.photoUrl+"'/>";
      this.photoUrl='';
      this.emit_msg();
      this.clickUploadBtn();
    }
  },
  methods:{
    emit_msg(){
      this.$emit('send',this.newMessage);
      this.newMessage="";
      this.finalTranscript="";
    },

    clickUploadBtn(){
      this.uploadBtn = !this.uploadBtn;
    },

    rec(){
      window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      this.recognition= new window.SpeechRecognition();
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 10;
      this.recognition.continuous = true;
      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
          let transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            this.finalTranscript += transcript;
          }
          else {
            interimTranscript += transcript;
          }
        }
      this.newMessage = this.finalTranscript;
      }
      this.recognition.start();
    },

    stop(){
      this.recognition.stop();
    },

    voiceSwitch(){
      var el = document.getElementById("voiceOver");
      if(this.voiceOver){
        el.style.color = 'black';
        this.voiceOver = false;
        this.stop();
      }
      else{
        el.style.color = 'rgb(248, 105, 105)';
        this.voiceOver = true;
        this.rec();
      }
    }
  },
  watch: {
    newMessage: function() {
      if (this.newMessage == "") {
        this.$socket.emit("isTyping", {
          typing: "noting",
          nick: this.$store.state.userNick
        });
      } else {
        //console.log("들어왔다!");

        this.$socket.emit("isTyping", {
          typing: "doing",
          nick: this.$store.state.userNick
        });
      }
    }
  },
};
</script>

<style>
#inputContainer{
  display:inline;
}
#uploadBtn{
  cursor: pointer;
  font-size: 170%; 
  display: table-cell;
  vertical-align: middle;
}
#voiceOver{
  cursor: pointer;
  font-size: 170%;
  position: relative;
  top: 5px;
  right: 35px;
  color: black;
}
#upload{
  position:fixed;
  bottom:70px;
  left: 1%;
}
.uploadcare-widget-button-open{
  width: 10vw;
  min-width: 130px;
  background-color: rgba(148, 10, 167, 0.733);
}
#inputsSend {
  position: relative;
  display: table-cell;
  vertical-align: middle;
  width: 10%;
  right: 3%;
}
#inputsText{
  text-align: left;
  display: table-cell;
  vertical-align: middle;
  width: 80%;
}
#chatBar {
  width: 100vw;
  height: 80px;
  display: table;
  position: fixed;
  bottom: 0px;
}
#textArea {
  width: 90%;
  height: 55%;
  padding-right: 40px;
}
#sendBtn {
  width: 100%;
  height: 55%;
}
@media (max-width: 500px) {
  #upload{
    bottom:55px;
  }
  #chatBar {
    height: 60px;
  }
  #sendBtn {
    height: 60%;
  }
  #textArea {
    height: 60%;
    padding-right: 35px;
  }
  #voiceOver{
    right: 30px;
  }
  #inputsSend{
    width: 15%;
  }
  #inputsText{
    width:70%;
  }
}
</style>