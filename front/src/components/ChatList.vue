<template>
  <div id="chatSpace">
    <ul class="list-group list-group-flush" id="chatList">
      <!-- Message loop -->

      <li id="list-item" v-for="index in messages['msg'].length" :key="index.id">
        <span
          v-if="messages['nick'][index] != messages['nick'][index-1]"
          v-show="check_nick(messages['nick'][index])">
          <span class="align_guest">{{messages['nick'][index]}}</span>
          <br />
        </span>

        <span v-if="messages['nick'][index] == 'festival'" id="speech_bubble" class="align_festival">
          <flickity  class="flickity" ref="flickity" :options="flickityOptions">
            <div v-for="idx in getFestivals.slice(messages['msg'][index][0], messages['msg'][index][1])" :key="idx.festivalIndex" 
            class="carousel-cell" v-html="idx">
              {{ idx }}
            </div>
          </flickity>
        </span>

        <span v-else id="speech_bubble" :class="{align_guest:messages['nick'][index] !='시저리',
          align_me:messages['nick'][index] == getUserNick, align_siserie:messages['nick'][index] =='시저리'}"
          v-html="messages['msg'][index]">
          {{ messages['msg'][index] }}
        </span>

        <span 
          v-if="((messages['time'][index] != messages['time'][index+1]) && 
          (now_nick != '시저리') && (now_nick != 'festival')) || (messages['nick'][index] !=messages['nick'][index+1])"
          id="time" :class="{alignText_me:messages['nick'][index] == getUserNick,
          alignText_guest:messages['nick'][index]!=getUserNick}">
        <span>{{ messages['time'][index] }}</span>
        </span>
      </li>

      <span id="speech_bubble" v-if="this.getTypings.length < 3 && this.getTypings.length>0">
        <span v-for="typing in typings" :key="typing.id">"{{typing}}"</span>
        <span>님이 입력중입니다!</span>
      </span>

      <span
        id="speech_bubble"
        v-if="this.getTypings.length >= 3"
      >{{this.getTypings.length}} 명이 입력중입니다!</span>
    </ul>
  </div>
</template>

<script>
//npm install vue-flickity
import Flickity from 'vue-flickity'
import { mapGetters } from "vuex";

export default {
  components: {
    Flickity
  },
  data() {
    return {
      messages: this.$store.state.messages,
      typings: this.$store.state.typings,
      festivals:this.$store.state.festivals,
      flickityOptions: {
        initialIndex: 0,
        prevNextButtons: true,
        pageDots: true,
        wrapAround: true,
        freeScroll: true,
        // any options from Flickity can be used
      },
    };
  },
  computed: {
    ...mapGetters({
      getUserNick: "getUserNick",
      getTypings: "getTypings",
      getFestivalPast : "getFestivalPast",
      getFestivals : "getFestivals"
    })
  },
  methods: {
    check_nick(now_nick) {
      return now_nick != this.getUserNick && now_nick != "시저리" && now_nick != "festival";
    }
  },
  updated() {
    var container = this.$el.querySelector("#chatList");
    container.scrollTop = container.scrollHeight;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#time{
  font-size: 20px;
}
.alignText_guest{
  padding-left: 10px;
  float:left;
}
.alignText_me{
  float:right;
}
#chatSpace {
  height: 100vh;
  padding-bottom: 80px;
  padding-top: 70px;
}

ul {
  max-height: 100%;
  overflow-y: auto;
}

#list-item {
  border: none;
  background-color: transparent;
  font-size: 25px;
  padding-bottom: 2px;
  padding-top: 5px;
}
#speech_bubble {
  position: relative;
  background-color: rgba(255, 255, 255, 0.411);
  padding-right: 10px;
  padding-left: 10px;
  word-break: break-all;
  border-radius: 12px;
  display: inline-block;
}
#user_id {
  padding-left: 10px;
  padding-right: 10px;
}
.align_siserie {
  width: 100%;
}
.align_guest {
  float: left;
  margin-left: 10px;
  max-width: 58vw;
}
.align_me {
  margin-right: 10px;
  float: right;
  max-width: 58vw;
}
.align_festival{
  width: 60vw;
}
.carousel-cell {
  width: 100%;
  height: 35vh;
  margin-right: 30vw;
  overflow: auto;
}

@media screen and ( min-width: 768px ) {
  /* half-width cells for larger devices */
  .carousel-cell { width: 70%; }
}
@media (max-width: 500px) {
  #chatSpace {
    padding-top: 8vh;
    padding-bottom: 10vh;
  }
  .align_me {
    max-width: 45vw;
  }
  .align_guest {
    max-width: 45vw;
  }
  #time{
    font-size: 4vw;
  }
  #list-item {
    font-size: 5vw;
  }

  .align_festival{
    width: 100%;
  }
  .carousel-cell {
    width: 100%;
    height: 45vh;
    margin-right: 50%;
    overflow: auto;
  }
}
</style>
