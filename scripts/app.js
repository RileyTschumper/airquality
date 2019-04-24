var app;
var timeout = null;

function Init() {
  app = new Vue({
    el: "#app",
    data: {
      map1: {
        index: 1,
        map: null,
        tileLayer: null,
        latitude: 44.94,
        longitude: -93.18,
        zoom: 11,
        markers: [],
        aqData: undefined,
        dateFrom: '',
        dateTo: '',
        heatmap: false,
        heatmapLayer: null,
        nominatimLocation: undefined,
        searchParticles: [
          {
            particle: "pm25",
            checked: true,
            value: undefined
          },
          {
            particle: "pm10",
            checked: true,
            value: undefined
          },
          {
            particle: "co",
            checked: true,
            value: undefined
          },
          {
            particle: "so2",
            checked: true,
            value: undefined
          },
          {
            particle: "no2",
            checked: true,
            value: undefined
          },
          {
            particle: "o3",
            checked: true,
            value: undefined
          },
          {
            particle: "bc",
            checked: true,
            value: undefined
          }
        ],
        bannerData:[]
      },
      map2: {
        index: 2,
        map: null,
        titleLayer: null,
        latitude: 39.9,
        longitude: 116.41,
        zoom: 11,
        markers: [],
        aqData: undefined,
        dateFrom: '',
        dateTo: '',
        heatmap: false,
        heatmapLayer: null,
        nominatimLocation: undefined,
        searchParticles: [
          {
            particle: "pm25",
            checked: true,
            value: undefined
          },
          {
            particle: "pm10",
            checked: true,
            value: undefined
          },
          {
            particle: "co",
            checked: true,
            value: undefined
          },
          {
            particle: "so2",
            checked: true,
            value: undefined
          },
          {
            particle: "no2",
            checked: true,
            value: undefined
          },
          {
            particle: "o3",
            checked: true,
            value: undefined
          },
          {
            particle: "bc",
            checked: true,
            value: undefined
          }
        ],
        bannerData:[]
      }
    },
    mounted() {
      /* Code to run when app is mounted */
      this.initMap();
      //this.mapListener();
    },
    methods: {
      /* Any app-specific functions go here */
      initMap() {
        //Initializing First Map
        this.map1.map = L.map("map1", { minZoom: 9, maxZoom: 16 }).setView(
          [this.map1.latitude, this.map1.longitude],
          this.map1.zoom
        );
        this.map1.tileLayer = L.tileLayer(
          "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
          {
            maxZoom: 18,
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
          }
        );
        this.map1.tileLayer.addTo(this.map1.map);
        updateMarkers(this.map1);
        getDataNominatimCoords(this.map1);

        this.map1.map.on("move", () => {
          updateCenterMap(this.map1);
        });

        this.map1.map.on("moveend", () => {
          if (timeout != null) {
            clearTimeout(timeout);
          }
          timeout = setTimeout(() => {
            updateMarkers(this.map1);
            getDataNominatimCoords(this.map1);
            timeout = null;
          }, 2000);
        });
        this.map1.map.on("zoomend", () => {
          if (timeout != null) {
            clearTimeout(timeout);
          }
          timeout = setTimeout(() => {
            updateMarkers(this.map1);
            getDataNominatimCoords(this.map1);
            timeout = null;
          }, 2000);
        });

        //Initializing Second map
        this.map2.map = L.map("map2", { minZoom: 9, maxZoom: 16 }).setView(
          [this.map2.latitude, this.map2.longitude],
          this.map2.zoom
        );
        this.map2.tileLayer = L.tileLayer(
          "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png",
          {
            maxZoom: 18,
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
          }
        );
        this.map2.tileLayer.addTo(this.map2.map);
        updateMarkers(this.map2);
        getDataNominatimCoords(this.map2);

        this.map2.map.on("move", () => {
          updateCenterMap(this.map2);
        });

        this.map2.map.on("moveend", () => {
          if (timeout != null) {
            clearTimeout(timeout);
          }
          timeout = setTimeout(() => {
            updateMarkers(this.map2);
            timeout = null;
          }, 2000);
        });
        this.map2.map.on("zoomend", () => {
          if (timeout != null) {
            clearTimeout(timeout);
          }
          timeout = setTimeout(() => {
            updateMarkers(this.map2);
            timeout = null;
          }, 2000);
        });
      },
      updateMap1() {
        this.map1.map.setView(
          [this.map1.latitude, this.map1.longitude],
          this.map1.zoom
        );
      },
      updateMap2() {
        this.map2.map.setView(
          [this.map2.latitude, this.map2.longitute],
          this.map2.zoom
        );
      }
    } //methods,
  }); //VUE app
} //Init()

function fetchSelectedParticles(mapNumber) {
  var view;
  if (mapNumber == "map1") {
    view = app.map1;
  } else {
    view = app.map2;
  }
  updateMarkers(view);
}

function updateMap(view) {
  view.map.setView([view.latitude, view.longitude], view.zoom);
}

function findLocation(id, map) {
  var x = document.getElementById(id).value;
  var resultString = "";
  var view = "";
  if (map == "map1") {
    view = app.map1;
  } else {
    view = app.map2;
  }

  resultString = x.split(" ").join("%20");
  getDataNominatim(resultString, view);
}

function centerMap(data, view) {
  //if Nominatim can't find data for the search, return
  if (data.length == 0) {
    return;
  }

  view.latitude = data[0].lat;
  view.longitude = data[0].lon;
  updateMap(view);
  updateMarkers(view);
}

function updateCenterMap(view) {
  view.latitude = view.map.getCenter().lat;
  view.longitude = view.map.getCenter().lng;
}

function updateMarkers(view) {
  //gets the date 30 prior to today
  var dateObj = new Date(new Date().setDate(new Date().getDate() - 30));
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  var date = year + "-" + month + "-" + day;

  //gets the radius based on the current map view
  var radius = calculateRadius(view.map);

  //gets the lat and lng at center of the map
  var latitude = view.map.getCenter().lat;
  var longitude = view.map.getCenter().lng;

  getData(latitude, longitude, radius, date, view);
}

//Calculates radius of current map
function calculateRadius(map) {
  var northEast = map.getBounds().getNorthEast();
  var southWest = map.getBounds().getSouthWest();
  radius = southWest.distanceTo(northEast) / 2.0;

  return radius;
}

function removeHeatMap(view){
  view.map.removeLayer(view.heatmapLayer);
}

function removeMarkers(view) {
  if (view.markers.length == 0) {
    return;
  }
  for (i = 0; i < view.markers.length; i++) {
    view.map.removeLayer(view.markers[i]);
  }
  view.markers = [];
}

//Adding markers to the map.
function addMarkers(data, map, view) {
  
  console.log("JSON data recieved");
  var results = data.results;
  console.log(results);

  //removes old markers from the map
  removeMarkers(view);

  //if no results for the area.
  if (results.length == 0) {
    return;
  }
  var heatmapArray = [];
  var markerString = "";
  var currTotal = unitConvert(results[0],results[0].value);
  var numReadings = 1;
  //Loops through all readings
  for (var i = 1; i < results.length; i++) {
    //if location and parameter match, keep a running total to calculate an average
    //This works because we fetched data in order by location and parameter
    if (
      results[i].location == results[i - 1].location &&
      results[i].parameter == results[i - 1].parameter
    ) {
      currTotal = currTotal + unitConvert(results[i],results[i].value);
      numReadings = numReadings + 1;
    }
    //if parameter are no longer the same, calculate average
    else if (results[i].location == results[i - 1].location) {
      //var startavg = currTotal/numReadings;
      var average = currTotal/numReadings;//unitConvert(results[i - 1],startavg);
      markerString =
        markerString +
        "<br />" +
        results[i - 1].parameter +
        " (" +
        correctUnits(results[i - 1].parameter) +
        ")" +
        ": " +
        average;
        addBannerData(results[i-1],average,view);
        //RESET AVERAGE HERE
        numReadings = 1;
        currTotal = unitConvert(results[i],results[i].value);
        markerString = "";
    }
    //if location are no longer the same, calculate average and place down marker
    else {
      //var startavg = currTotal/numReadings;
      var average = currTotal/numReadings;//unitConvert(results[i - 1],startavg);
      markerString =
        markerString +
        "<br />" +
        results[i - 1].parameter +
        " (" +
        correctUnits(results[i - 1].parameter) +
        ")" +
        ": " +
        average;
      addBannerData(results[i-1],average,view);
      var lat = results[i - 1].coordinates.latitude;
      var lng = results[i - 1].coordinates.longitude;
      var newMarker = new L.marker([lat, lng])
        .addTo(map)
        .bindPopup(
          "<p> Location: " + results[i - 1].location + markerString + "<p>"
        );
      view.markers.push(newMarker);
      var lessThanOne = average * 0.1;
      heatmapArray.push([lat, lng, lessThanOne]);
      numReadings = 1;
      currTotal = unitConvert(results[i],results[i].value);
      markerString = "";
    }
  }
  if(view.bannerData.length > 0){
    addBannertoView(view);
  }
  else{

  }
  if (view.heatmap == true) {
    var heat = L.heatLayer(heatmapArray, {
      radius: 100,
      minOpacity: .5,
      gradient: { .1: "green", .3: "yellow", .7: "red" },
      blur: 10
    }).addTo(view.map);

    view.heatmapLayer = heat;
  }
}

function updateTable(data, view) {
  var results = data.results;
  var tableID = "data-table-body" + view.index;

  //clear table
  document.getElementById(tableID).innerHTML = "";

  var table = document.getElementById(tableID);
  var tr;
  var td;
  for (var i = 0; i < results.length; i++) {
    var units = correctUnits(results[i].parameter);
    var quantity = unitConvert(results[i], results[i].value);
    var color = getColor(results[i], quantity);
    tr = document.createElement("tr");

    td = document.createElement("td");
    td.innerHTML = results[i].date.local;
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerHTML = results[i].location;
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerHTML = results[i].parameter;
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerHTML = quantity.toPrecision(3);
    td.classList.add(color);
    td.style.color = "black";
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerHTML = units;
    tr.appendChild(td);

    table.appendChild(tr);
  }
}

//Need to check units
function getColor(data, quantity) {
  if (data.parameter == "pm25") {
    if (quantity <= 12.0) return "green";
    if (quantity <= 35.4) return "yellow";
    if (quantity <= 55.4) return "orange";
    if (quantity <= 150.4) return "red";
    if (quantity <= 250.4) return "purple";
    else return "maroon";
  } else if (data.parameter == "pm10") {
    if (quantity <= 54.0) return "green";
    if (quantity <= 154.0) return "yellow";
    if (quantity <= 254.0) return "orange";
    if (quantity <= 354.0) return "red";
    if (quantity <= 424.0) return "purple";
    else return "maroon";
  } else if (data.parameter == "co") {
    if (quantity <= 4.4) return "green";
    if (quantity <= 9.4) return "yellow";
    if (quantity <= 12.4) return "orange";
    if (quantity <= 15.4) return "red";
    if (quantity <= 30.4) return "purple";
    else return "maroon";
  } else if (data.parameter == "so2") {
    if (quantity <= 35.0) return "green";
    if (quantity <= 75.0) return "yellow";
    if (quantity <= 185.0) return "orange";
    if (quantity <= 304.0) return "red";
    if (quantity <= 604.0) return "purple";
    else return "maroon";
  } else if (data.parameter == "no2") {
    if (quantity <= 53.0) return "green";
    if (quantity <= 100.0) return "yellow";
    if (quantity <= 360.0) return "orange";
    if (quantity <= 649.0) return "red";
    if (quantity <= 1249.0) return "purple";
    else return "maroon";
  } else if (data.parameter == "o3") {
    if (quantity <= 0.054) return "green";
    if (quantity <= 0.07) return "yellow";
    if (quantity <= 0.085) return "orange";
    if (quantity <= 0.105) return "red";
    if (quantity <= 0.2) return "purple";
    else return "maroon";
  }
}
//Check if there needs to be a unit conversion
function unitConvert(data, value) {
  var par = data.parameter;
  var units = data.unit;
  var quantity = value;
  if (par == "pm25" && units != "µg/m³") {
    quantity = convert(par, quantity, units);
  } else if (par == "pm10" && units != "µg/m³") {
    quantity = convert(par, quantity, units);
  } else if (par == "co" && units != "ppm") {
    quantity = convert(par, quantity, units);
  } else if (par == "so2" && units != "ppb") {
    quantity = convert(par, quantity, units);
  } else if (par == "no2" && units != "ppb") {
    quantity = convert(par, quantity, units);
  } else if (par == "o3" && units != "ppm") {
    quantity = convert(par, quantity, units);
  }
  return quantity;
}

//Converts the value if need
function convert(par, value, from) {
  var factor = [1.96, 1.88, 1150, 2.62];
  /*
      o3 1ppb = 1.96 µg/m³ => want ppm
      no2 1 ppb = 1.88 µg/m³ => want ppb
      co 1 ppm = 1150 µg/m³ => want ppm
      so2 1ppb = 2.62 µg/m³ => want ppb
*/

  if (par == "o3") {
    if (from == "µg/m³") {
      value = value / (1000 * 1.96);
    } else {
      console.log("Unchecked parameter unit pair" + par + " " + from);
    }
  } else if (par == "no2") {
    if (from == "µg/m³") {
      value = value / 1.88;
    } else if (from == "ppm") {
      value = value * 1000;
    } else {
      console.log("Unchecked parameter unit pair" + par + " " + from);
    }
  } else if (par == "co") {
    if (from == "µg/m³") {
      value = value / 1150;
    } else {
      console.log("Unchecked parameter unit pair" + par + " " + from);
    }
  } else if (par == "so2") {
    if (from == "µg/m³") {
      value = value / 2.62;
    } else if (from == "ppm") {
      value = value * 1000;
    } else {
      console.log("Unchecked parameter unit pair" + par + " " + from);
    }
  } else {
    console.log("Unknown parameter unit pair" + par + " " + from);
  }
  return value;
}

function correctUnits(parameter) {
  if (parameter == "pm25" || parameter == "pm10") return "µg/m³";
  else if (parameter == "co" || parameter == "o3") return "ppm";
  else if (parameter == "so2" || parameter == "no2") return "ppb";
  else {
    console.log("unknown parameter: " + parameter);
    return "µg/m³";
  }
}
//HTTP Request to Nominatim API
var getDataNominatim = function(requestString, view) {
  var req = new XMLHttpRequest();

  req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200) {
      //call the addMarkers function with JSON data
      //addMarkers(JSON.parse(req.response),view.map, view);
      //updateTable(JSON.parse(req.response),view);
      centerMap(JSON.parse(req.response), view);
    }
  };

  var url =
    "https://nominatim.openstreetmap.org/search/" +
    requestString +
    "?format=json&limit=1";
  req.open("GET", url, true);
  req.send();
};

var getDataNominatimCoords = function(view) {
  var req = new XMLHttpRequest();

  req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200) {
      //call the addMarkers function with JSON data
      //addMarkers(JSON.parse(req.response),view.map, view);
      //updateTable(JSON.parse(req.response),view);
      getNominatimDisplay(JSON.parse(req.response), view);
    }
  };

  var url =
    "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
    view.latitude +
    "&lon=" +
    view.longitude +
    "&zoom=11";
  req.open("GET", url, true);
  req.send();
};

function getNominatimDisplay(data, view) {
  view.nominatimLocation = data.display_name;
}

//HTTP Request to Open AQ API
var getData = function(latitude, longitude, radius, date, view) {

  document.getElementById('map'+view.index+'-banner').innerHTML = '';
  view.bannerData = [];

  var req = new XMLHttpRequest();

  req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200) {
      //call the addMarkers function with JSON data
      if(numberSelected != 0){
        view.aqData = JSON.parse(req.response);
        addMarkers(JSON.parse(req.response), view.map, view);
        updateTable(JSON.parse(req.response), view);
      }
      else{
        removeMarkers(view);

      }
    }
  };

  if(view.heatmapLayer != null){
    view.map.removeLayer(view.heatmapLayer);
  }
  var numberSelected = 0;
  var parameterString = "";

  for (var i = 0; i < 7; i++) {
    if (view.searchParticles[i].checked == true) {
      numberSelected++;
      if (parameterString.length != 0) {
        parameterString = parameterString + "&";
      }
      parameterString =
        parameterString + "parameter[]=" + view.searchParticles[i].particle;
    }
  }

  if (numberSelected == 1) {
    view.heatmap = true;
  } else {
    view.heatmap = false;
    if(view.heatmapLayer != null){
      view.map.removeLayer(view.heatmapLayer);
    }
  }

  //Orders data by location and parameter, this makes it easier to average the values
  var order = "&order_by[]=location&order_by[]=parameter";
  //Fetch data for all parameters
  //var parameterString = "parameter[]=pm25&parameter[]=pm10&parameter[]=so2&parameter[]=no2&parameter[]=o3&parameter[]=co&parameter[]=bc";

  var dateString = "&date_from=" + date;
  if(view.dateFrom == '' && view.dateTo == ''){

  }
  else if(view.dateFrom == ''){
    dateString = dateString + "&date_to="  + view.dateTo;
  }
  else if(view.dateTo == ''){
    dateString = "&date_from=" + view.dateFrom;
  }
  else{
    dateString = "&date_from=" + view.dateFrom + "&date_to=" + view.dateTo;
  }

  var url =
    "https://api.openaq.org/v1/measurements?" +
    parameterString +
    "&coordinates=" +
    latitude +
    "," +
    longitude +
    "&radius=" +
    radius +
    dateString +
    order +
    "&limit=10000";
  req.open("GET", url, true);
  req.send();
};

function toggleFullscreen(id) {
  //var element = document.getElementById(id);
  var words = id.split("-");
  var map = "#" + words[0];
  var idname = "#" + id;
  var other = "";
  if (map.indexOf("1") == -1) {
    other = idname.replace("2", "1");
  } else {
    other = idname.replace("1", "2");
  }

  $(idname).toggleClass("fullscreen");
  $(map).toggleClass("map-fullwidth");

  $(idname.replace("map", "table")).toggleClass("hidden");//associated table
  $(other.replace("map", "table")).toggleClass("hidden");//other table
  $(other).toggleClass("hidden");//other container

}

function addBannerData(data,average,view){
  var color = getColor(data,average);
  var val = colorIndex(color);
  var obj = {
    parameter: data.parameter,
    color: color,
    index: val,
    location: data.location
    };
  if(color == 'orange'||color == 'red'||color == 'purple'||color == 'maroon')
  {
    view.bannerData.push(obj);
  }
}
function colorIndex(color)
{
  if (color == "orange") return 0;
  if (color == "red") return 1;
  if (color == "purple") return 2;
  if (color == "maroon") return 3;
  else return -1;
}

function addBannertoView(view){
  document.getElementById('map'+view.index+'-banner').innerHTML = '';
  var colors =['orange','red','purple','maroon'];
  var descripts = ['Unhealthy for Sensitive Groups','Unhealthy','Very Unhealthy','Hazardous'];
  var banner = view.bannerData.sort(compare);
  var value = banner[0].index;
  var table = document.getElementById('map'+view.index+'-banner');
  var tr;
  for(var i = 1; i < banner.length; i++){
    if(banner[i-1].parameter == banner[i].parameter)
    {
      value = Math.max(banner[i-1].index,banner[i].index);
    }
    else{
      tr = document.createElement("tr");
      tr.classList.add(colors[value]);
      tr.innerHTML = "Levels of "+banner[i-1].parameter+" is: "+descripts[value];
      table.appendChild(tr);

      value = banner[i].index;
    }
  }
  tr = document.createElement("tr");
  tr.classList.add(colors[value]);
  tr.innerHTML = "Levels of "+banner[i-1].parameter+" is: "+descripts[value];
  table.appendChild(tr);
}
function compare( a, b ) {
  if ( a.parameter < b.parameter ){
    return -1;
  }
  if ( a.parameter > b.parameter ){
    return 1;
  }
  return 0;
}
