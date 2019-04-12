var app;

function Init() {

app = new Vue({
    el: '#app',
    data: {
        map1:{
          map: null,
          tileLayer: null,
          latitude: 44.94,
          longitude: -93.18,
          zoom: 11,
          markers: []
        },
        map2:{
          map: null,
          titleLayer:null,
          latitude: 39.90,
          longitude: 116.41,
          zoom: 11,
          markers: []
        }
    },
    mounted() { /* Code to run when app is mounted */
      getAQ(this.map1.latitude,this.map1.longitude,this.map1);
      getAQ(this.map2.latitude,this.map2.longitude,this.map2);
      this.initMap();
        //this.mapListener();
    },
    methods: { /* Any app-specific functions go here */
        initMap() {
          //Initializing First Map
            this.map1.map = L.map('map').setView([this.map1.latitude, this.map1.longitude], this.map1.zoom);
            this.map1.tileLayer = L.tileLayer(
                'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
                {
                  maxZoom: 18,
                  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                }
              );
              this.map1.tileLayer.addTo(this.map1.map);

            this.map1.map.on("move", function(e){
                updateCenterMap1();
            });

            //Initializing Second map
            this.map2.map = L.map('map2').setView([this.map2.latitude, this.map2.longitude], this.map2.zoom);
            this.map2.tileLayer = L.tileLayer(
                'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
                {
                  maxZoom: 18,
                  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                }
              );
              this.map2.tileLayer.addTo(this.map2.map);

            this.map2.map.on("move", function(e){
                updateCenterMap2();
            });
        },
        updateMap1(){
            this.map1.map.setView([this.map1.latitude, this.map1.longitude], this.map1.zoom);
        },
        updateMap2(){
            this.map2.map.setView([this.map2.latitude, this.map2.longitute], this.map2.zoom);
        }

    }//methods,
  });//VUE app

  function updateCenterMap1(){
      app.map1.latitude = app.map1.map.getCenter().lat;
      app.map1.longitude = app.map1.map.getCenter().lng;
  }
  function updateCenterMap2(){
    app.map2.latitude = app.map2.map.getCenter().lat;
    app.map2.longitude = app.map2.map.getCenter().lng;
  }
}//Init()

//Adding markers to the map. I don't how to do ajax properly
///*
function addMarkers(event){
    if(app.map1.markers.length > 0){
      for(var i = 0; i < app.map1.markers.length; i++){
        console.log(app.map1.markers[i].coordinates.latitude);
        console.log(app.map1.markers[i].coordinates.longitude);
        L.marker([app.map1.markers[i].coordinates.latitude,app.map1.markers[i].coordinates.longitude]).addTo(app.map1.map);
      }
    }
    else {
      console.log("Markers did not make it in time");
    }
}
          //*/

function getAQ(latitude,longitude,mapview){
  var date = "2019-04-10"
  var parameter = "o3";
  var address = "https://api.openaq.org/v1/measurements?parameter="+parameter+"&coordinates="+latitude+","+longitude+"&radius=10000&data_from="+date+"&limit=10"
  $.ajax({url: address, success: function(response){
    mapview.markers = response.results;
//    console.log(app.map1.markers);
  }
});
}//getAQ
