var app;

function Init() {

app = new Vue({
    el: '#app',
    data: {
        map: null,
        tileLayer: null,
        latitude: 44.94,
        longitude: -93.18,
        zoom: 11,
    },
    mounted() { /* Code to run when app is mounted */
        this.initMap();
    },
    methods: { /* Any app-specific functions go here */
        initMap() {
            this.map = L.map('map').setView([this.latitude, this.longitude], this.zoom);
            this.tileLayer = L.tileLayer(
                'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
                {
                  maxZoom: 18,
                  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                }
              );
              this.tileLayer.addTo(this.map);
        },
        updateMap(){
            this.map.setView([this.latitude, this.longitude], this.zoom);
        },
    },
  });
}
