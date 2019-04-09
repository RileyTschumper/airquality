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
          zoom: 11
        },
        map2:{
          map: null,
          titleLayer:null,
          latitude: 39.90,
          longitude: 116.41,
          zoom: 11
        }
    },
    mounted() { /* Code to run when app is mounted */
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
    },
  });

  function updateCenterMap1(){
      app.map1.latitude = app.map1.map.getCenter().lat;
      app.map1.longitude = app.map1.map.getCenter().lng;
  }
  function updateCenterMap2(){
    app.map2.latitude = app.map2.map.getCenter().lat;
    app.map2.longitude = app.map2.map.getCenter().lng;
  }
}
