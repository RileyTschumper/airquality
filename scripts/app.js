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
      //getAQ(this.map1.latitude,this.map1.longitude,this.map1);
      //getAQ(this.map2.latitude,this.map2.longitude,this.map2);
      this.initMap();
        //this.mapListener();
    },
    methods: { /* Any app-specific functions go here */
        initMap() {
          //Initializing First Map
            this.map1.map = L.map('map', {minZoom: 9, maxZoom: 16}).setView([this.map1.latitude, this.map1.longitude], this.map1.zoom);
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

            this.map1.map.on("moveend", function(e){
              updateMarkers1();
            });

            //Initializing Second map
            this.map2.map = L.map('map2', {minZoom: 9, maxZoom: 16}).setView([this.map2.latitude, this.map2.longitude], this.map2.zoom);
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

}//Init()

function updateCenterMap1(){
  app.map1.latitude = app.map1.map.getCenter().lat;
  app.map1.longitude = app.map1.map.getCenter().lng;
}

function updateCenterMap2(){
app.map2.latitude = app.map2.map.getCenter().lat;
app.map2.longitude = app.map2.map.getCenter().lng;
}

function updateMarkers1(){
  //gets the date 30 prior to today
	var dateObj = new Date(new Date().setDate(new Date().getDate() - 30));
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  var date = year + "-" + month + "-" + day;

  //gets the radius based on the current map view
  var radius = calculateRadius(app.map1.map);

  //gets the lat and lng at center of the map
  var latitude = app.map1.map.getCenter().lat;
  var longitude = app.map1.map.getCenter().lng;

  getData(latitude, longitude, radius, date, app.map1.map);
}

//This isn't proper Haversine, but it works...kinda. Radius is a bit large I think
function calculateRadius(map){
  var centerLat = app.map1.map.getCenter().lat;
  var centerLng = app.map1.map.getCenter().lng;
  var northeastLat = app.map1.map.getBounds().getNorthEast().lat;
  var northeastLng = app.map1.map.getBounds().getNorthEast().lng;

  var y = 111111*Math.abs(northeastLat - centerLat);
  var x = 111111*Math.abs(northeastLng - centerLng);

  radius = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
  console.log("Radius: " + radius);
  return radius;
}

//Adding markers to the map. 
function addMarkers(data, map){
    console.log("JSON data recieved");;
    var results = data.results;
    console.log(results);

    var currTotal = currTotal + results[0].value;;
    var numReadings = 1;
    //Loops through all readings
    for(var i = 1; i < results.length; i++){
      //if location and parameter match, keep a running total to calculate an average
      //This works because we fetched data in order by location and parameter
      if((results[i].location == results[i-1].location) && (results[i].parameter == results[i-1].parameter)){
        currTotal = currTotal + results[i].value;
        numReadings = numReadings + 1;
      }
      //if location or parameter are no longer the same, calculate average and place down marker
      else{
        var lat = results[i-1].coordinates.latitude;
        var lng = results[i-1].coordinates.longitude;
        var average = currTotal/numReadings;
        L.marker([lat,lng]).addTo(map).bindPopup("Location: " + results[i-1].location + results[i-1].parameter + ": " + average);
        numReadings = 0;
        currTotal = 0;
      }
    }
}

//HTTP Request to Open AQ API
var getData = function(latitude, longitude, radius, date, map) {

  console.log("getData lat " + latitude);
  console.log("getData long " + longitude);
  console.log("getData radius " + radius);
  console.log("getData date " + date);

  var req = new XMLHttpRequest();

  req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200) {
      //call the addMarkers function with JSON data
      addMarkers(JSON.parse(req.response),map);
    }
  };

  //Orders data by location and parameter, this makes it easier to average the values
  var order = "&order_by[]=location&order_by[]=parameter";
  //Fetch data for all parameters
  var parameter = "parameter[]=pm25&parameter[]=pm10&parameter[]=so2&parameter[]=no2&parameter[]=o3&parameter[]=co&parameter[]=bc";

  var url = "https://api.openaq.org/v1/measurements?" + parameter + "&coordinates="+latitude+","+longitude+"&radius="+radius+"&date_from="+date+order+"&limit=10000";
  req.open("GET", url, true);
  req.send();
};

/*
function getAQ(latitude,longitude,mapview){

  //gets the date 30 prior to today
	var dateObj = new Date(new Date().setDate(new Date().getDate() - 30));
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  var date = year + "-" + month + "-" + day;

  var parameter = "o3";
  var address = "https://api.openaq.org/v1/measurements?parameter="+parameter+"&coordinates="+latitude+","+longitude+"&radius=10000&data_from="+date+"&limit=10"
  $.ajax({url: address, success: function(response){
    mapview.markers = response.results;
//    console.log(app.map1.markers);
  }
});
}//getAQ
*/
