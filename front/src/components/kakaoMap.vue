<template>
<div id="Maps">
    <div id="MapsContainer">
      <div id="fullSpace">
        <div id="mapSpace">
          <div id="dmap">
            <div id="searchBar">
              <span id="mapTitle">{{msg}}</span>
              <form  @submit.prevent="searchMap">
                <input id="searchText" type="text" placeholder="검색할 위치" v-model="requestMap"/>
                <button id="searchBtn" class="btns">검색</button>
              </form>
            </div>
            <div id="map"></div>
          </div>
        </div>
      </div>
    </div>
</div>

</template>

<script>
  export default {
    data: function(){
    return {
        msg:"Kakako Map",
        requestMap:"",
        map: null
      }
    },
    mounted() {
        
        var container = document.getElementById('map');
        var mapOptions = {
            center: new kakao.maps.LatLng(33.450701, 126.570667),
            level: 4 //지도의 레벨(확대, 축소 정도)
        };
        this.map = new kakao.maps.Map(container, mapOptions);
        // 주소-좌표 변환 객체를 생성합니다
        var geocoder = new kakao.maps.services.Geocoder();
        var map2 = this.map;
        // 주소로 좌표를 검색합니다
        if(this.$store.state.clickedAddress != ""){
            var temp = this.$store.state.clickedAddress;
            geocoder.addressSearch(this.$store.state.clickedAddress, function(result, status) 
            {
                // 정상적으로 검색이 완료됐으면 
                if (status === kakao.maps.services.Status.OK) {

                    var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                    // 결과값으로 받은 위치를 마커로 표시합니다
                    var marker = new kakao.maps.Marker({
                        map: map2,
                        position: coords
                });

                // 인포윈도우로 장소에 대한 설명을 표시합니다
                
                var infowindow = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;">'+temp+'</div>'
                });
                infowindow.open(map2, marker);

                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map2.setCenter(coords);
                
                } 
            });  
            this.$store.state.clickedAddress = "";
        }
    },
    methods:{
      searchMap()
      {
        var map2 = this.map;
        if(this.requestMap != ""){
            var temp = this.requestMap;
            var geocoder = new kakao.maps.services.Geocoder();
            geocoder.addressSearch(temp, function(result, status) 
            {
                // 정상적으로 검색이 완료됐으면 
                if (status === kakao.maps.services.Status.OK) {

                    var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                    // 결과값으로 받은 위치를 마커로 표시합니다
                    var marker = new kakao.maps.Marker({
                        map: map2,
                        position: coords
                });

                // 인포윈도우로 장소에 대한 설명을 표시합니다
                
                var infowindow = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;">'+temp+'</div>'
                });
                infowindow.open(map2, marker);

                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map2.setCenter(coords);
                
                } 
                else{
                  alert("검색결과를 찾을 수 없습니다!");
                }
            });  
            this.$store.state.clickedAddress = "";
        }
      }
    }
  }
</script>


<style>
#searchBtn{
  padding-right: 15px;
  padding-left: 15px;
}
#searchText{
  width: 300px;
  margin-right: 10px;
}
#searchBar{
  position:relative;
  height: 10%;
  margin-bottom: 5%;
  width:100vw;
}
#mapTitle{
  font-size: 30px;
}
#map{
  width:100%;
  height:80%;
  margin: auto;
}

#addBtn{
  background-color: transparent;
  border: none;
  margin-left: 10px;
  min-width: 40px;
  height: 30px;
}
#addContainer{
  width:100%;
}

#Maps {
  display: table;
  margin: auto;
}

#MapsContainer {
  display: table-cell;
  vertical-align: middle;
}
#fullSpace{
  height:100vh;
  padding-top:90px;
  width:100vw;
}
#mapSpace{
  height:100%; 
  overflow-y:auto;
}
#dmap{
  height: 100%;
}
@media(max-width:500px){
  #searchBar{
    height: 7%;
    margin-bottom: 10%;
  }
  #mapTitle{
    font-size: 20px;
  }
  #map{
    height: 67%;
  }
  #searchText{
    width: 200px;
  }
}
</style>