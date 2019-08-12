// var map = L.map('map').setView([51.505, -0.09], 13);

// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox.mapbox-streets-v8',
//     accessToken: 'sk.eyJ1IjoibWR1Z2dhbiIsImEiOiJjandvYmRlcXowdGd3NDRyMm03enFzdWR6In0.OBC3XbRUpWdJlNJ9GtjnNA'
// }).addTo(map);

// L.marker([51.5, -0.09]).addTo(map)
//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//     .openPopup();

// var mymap = L.map('map').setView([51.505, -0.09], 13);

// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
//   maxZoom: 18,
//   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
//     '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
//     'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//   id: 'mapbox.streets'
// }).addTo(mymap);

const map = L.map('mapid').setView(L.latLng(42.268075, -71.098007), 16);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=sk.eyJ1IjoibWR1Z2dhbiIsImEiOiJjandvYmRlcXowdGd3NDRyMm03enFzdWR6In0.OBC3XbRUpWdJlNJ9GtjnNA', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(map);

const controlLayers = L.control.layers().addTo(map);

// $.getJSON("Police_Districts.geojson", function(data) {
//   L.geoJson(data).addTo(map)
//   console.log(data)
//   var openspaceJson = L.geoJson(data, {
//     onEachFeature: function (feature, layer) {
//       var popup = L.popup()
//       popup.setContent(
//         "<p>District: "+feature.properties.DISTRICT+"</p>"
//         )
//       layer.bindPopup(popup);
//     }
//   }).addTo(map)
// });

$.getJSON("e18_2018_q34.geojson", function(data) {
  L.geoJson(data).addTo(map)
  console.log(data)
  var openspaceJson = L.geoJson(data, {
    onEachFeature: function (feature, layer) {
      var popup = L.popup()
      popup.setContent(
        "<p>Offense Name: "+feature.properties.OFFENSE_DESCRIPTION+"</p>"
        +"<p>Offense Date: "+feature.properties.OCCURRED_ON_DATE+"</p>"
        +"<p>Day of week: "+feature.properties.DAY_OF_WEEK+"</p>"
        +"<p>Street: "+feature.properties.STREET+"</p>"
      )
      layer.bindPopup(popup);
    }
  }).addTo(map)
});