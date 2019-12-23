<template>
<div id="Calendar">
    <div id="CalendarContainer">
      <div id="fullSpace">
        <div id="calendarSpace">
          <div class='demo-app'>
            <!--<div class='demo-app-top'>
              <button @click="toggleWeekends">toggle weekends</button>
              <button @click="gotoPast">go to a date in the past</button>
              (also, click a date/time to add an event)
            </div>-->
            <FullCalendar
              class='demo-app-calendar'
              ref="fullCalendar"
              defaultView="dayGridMonth"
              :header="{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
              }"
              :plugins="calendarPlugins"
              :weekends="calendarWeekends"
              :events="calendarEvents"
              @dateClick="handleDateClick"
              />
          </div>
          <div id="sliderView" v-if="getEventsLength!=0">
            <Flickity class="flickity" ref="flickity" :options="flickityOptions">
              <div v-for="item in calendarEvents" :key="item.id" class="carousel-cell">
                <div id="sliderText"><span >식별번호 : </span>{{item.id}}</div>
                <div id="sliderText"><span>축제명 : </span>{{item.title}}</div>
                <button class="btns" id="sliderBtn" @click="goMap(item.address)">{{item.address}}</button>
              </div>
            </Flickity>
          </div>
        </div>
      </div>
    </div>
    <!-- <table style="dispaly:block">
      <tr>
        <th>식별번호<th>
        <th>축제명</th>
        <th>장소</th>
      </tr>
      <tr v-for="item in calendarEvents" :key="item.id">
        <td>{{item.id}}</td>
        <td>{{item.title}}</td>
        <td ><button class="btns" id="change_btn" @click="goMap(item.address)">{{item.address}}</button></td>
      </tr>
    </table> -->
</div>

</template>

<script>
// npm install node-sass style-loader css-loader sass-loader --save-dev
// npm install --save @fullcalendar/vue @fullcalendar/core @fullcalendar/daygrid
// npm install --save @fullcalendar/interaction @fullcalendar/timegrid
//npm install vue-flickity
import Flickity from 'vue-flickity'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { mapGetters } from "vuex";

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available,
    Flickity,
  },
  data() {
    return {
      calendarPlugins: [ // plugins must be defined in the JS
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin // needed for dateClick
      ],
      calendarWeekends: true,
      calendarEvents: this.$store.state.calendarEvents, // initial event data
      flickityOptions: {
        initialIndex: 0,
        prevNextButtons: true,
        pageDots: true,
        wrapAround: true,
        freeScroll: true
        // any options from Flickity can be used
      }  
    }
  },
  computed:{
    ...mapGetters({
      getEventsLength : "getEventsLength"
    })
  },
  methods: {
    toggleWeekends() {
      this.calendarWeekends = !this.calendarWeekends // update a property
    },
    gotoPast() {
      let calendarApi = this.$refs.fullCalendar.getApi() // from the ref="..."
      calendarApi.gotoDate('2000-01-01') // call a method on the Calendar object
    },
    handleDateClick(arg) {
      if (confirm(arg.dateStr + ' 에 일정을 추가할꺼늬?')) {
        this.calendarEvents.push({ // add new event data
          title: 'New Event',
          start: arg.date,
          allDay: arg.allDay,
          end:""
        })
      }
    },
    goMap(address){
     this.$store.state.clickedAddress = address;
     this.$router.push("/map");
    }
  }
}
</script>

<style lang='scss'>
// you must include each plugins' css
// paths prefixed with ~ signify node_modules
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';
.demo-app {
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 1.3vw;
}
.fc-event{
  background-color: rgba(242, 243, 166, 0.87);
  border: transparent;
}
// .demo-app-top {
//   margin: 0 0 3em;
// }
.demo-app-calendar {
  margin: 0 auto;
  width: 70vw;
}
.fc-unthemed td.fc-today{
  background-color: rgba(211, 65, 240, 0.226);
}
.fc-sun .fc-day-number{
  color:red;
}
.fc-sat .fc-day-number{
  color:blue;
}
#Calendar {
  display: table;
  margin: auto;
}

#CalendarContainer {
  display: table-cell;
  vertical-align: middle;
}
.fc-day-grid-container{
  height: 60vh !important;
}
.fc-day-grid{
  height: 100%;
}
.fc-dayGrid-view .fc-body .fc-row{
  font-size: 2.5vh;
}

#fullSpace{
  height:100vh;
  padding-top:90px;
  width:100vw;
}
#calendarSpace{
  height:100%; 
  overflow-y:auto;
}

#sliderView{
  margin: auto;
  margin-top: 20px;
  width: 70vw;
}
#sliderText{
  font-size: 20px;
}
#sliderBtn{
  padding-left:20px;
  padding-right: 20px;
  padding-top: 2px;
  padding-bottom: 2px;
}
.carousel-cell {
  width: 100%;
  height: 100px;
  margin-right: 30vw;
  overflow: auto;
}
@media screen and ( min-width: 768px ) {
  /* half-width cells for larger devices */
  .carousel-cell { width: 50%; }
}
@media(max-width:500px){
   .demo-app { 
     font-size: 1.8vw;
   }
   .demo-app-calendar {
     width: 90vw;
   }
   #fullSpace{
    padding-top:9vh;
  }
  #sliderView{
    margin-top: 10px;
    width: 100vw;
  }
  #sliderText{
    font-size: 15px;
  }
  #sliderBtn{
    padding-left:15px;
    padding-right: 15px;
    padding-top: 1px;
    padding-bottom: 1px;
  }
  .carousel-cell {
  
  height: 80px;
  }
}
</style>