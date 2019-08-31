// var map = L.map('map').setView([51.505, -0.09], 13);
// params:
// starting location of map - paste in lat/long if desired
// dropdown of data to map
// normalized police data
// maybe later, map overlay?
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

const map = L.map('mapid').setView(L.latLng(42.305552, -71.094972), 12);

//const map = L.map('mapid').setView(L.latLng(42.268075, -71.098007), 16);

var Title = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWR1Z2dhbiIsImEiOiJjanpuM3B3OXYwMDNpM21vOW4wMWZxcG04In0.jseO-HANjySuMXvauu3Fng', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.streets'
})
Title.addTo(map);

var layerGroup = L.layerGroup().addTo(map);

const controlLayers = L.control.layers().addTo(map);

var legend = L.control({position: 'topright'});

var mapper = {
  "libraries": {
    label: "Branch",
    fieldName: "BRANCH"
  },
  "zipcodes": {
    label: "Zip Code",
    fieldName: "ZIP5"
  },
  "police_districts": {
    label: "District",
    fieldName: "DISTRICT"
  },
  "public_schools": {
    label: "School",
    fieldName: "SCH_NAME"
  },
  "neighborhoods": {
    label: "Neighborhood",
    fieldName: "NAME"
  },
  "hydrants": {
    label: "Enabled",
    fieldName: "ENABLED"
  },
  "trees": {
    label: "Type",
    fieldName: "TYPE"
  },
  "open_space": {
    label: "Name",
    fieldName: "SITE_NAME"
  },
  "landmarks": {
    label: "Landmark",
    fieldName: "Name_of_Pr"
  }
}

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var options = "<select id=\"map_menu\">"
    $.each(mapper, function(idx, val) {
      options+="<option id=\""+idx+"\">"+idx+"</option>"
    })
    options += "</select>"
    div.innerHTML = options;
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend.addTo(map);


$('#map_menu').change(function() {
  var optionSelected = $("option:selected", this);
  var valueSelected = this.value;
  url = "http://127.0.0.1:4741/map/"+valueSelected
  $.getJSON(url, function(data) {
    // map valueSelected/api endpoint to something describing
    // the label the popup should have as well as the fieldname it should display
    // soon, with other data, we'll need to iterate through and give multiple 
    // fields if needed - may want handlebars for this
    map.removeLayer(layerGroup)
    layerGroup = L.layerGroup().addTo(map);
    mapperEntry = mapper[valueSelected]
    label = mapperEntry['label']
    fieldName = mapperEntry['fieldName']
    currentLayer = L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        var popup = L.popup()
        var holder = feature['properties']
        popup.setContent(
          "<p>"+label+": "+holder[fieldName]+"</p>"
          )
        layer.bindPopup(popup);
      }
    })
    //var featureLayer = L.mapbox.featureLayer().addTo(layerGroup);
    currentLayer.addTo(layerGroup)
  })
    // determine which type of data we got back
    // maybe with some metadata to tell us what fields to use for labels?
    // add it to the map
    // remove the other data/lasyers
})

// $.getJSON("Public_Libraries.geojson", function(data) {
//   L.geoJson(data).addTo(map)
//   console.log(data)
//   var openspaceJson = L.geoJson(data, {
//     onEachFeature: function (feature, layer) {
//       var popup = L.popup()
//       popup.setContent(
//         "<p>Branch: "+feature.properties.BRANCH+"</p>"
//         )
//       layer.bindPopup(popup);
//     }
//   }).addTo(map)
// });

// $.getJSON("http://127.0.0.1:4741/map/zipcodes", function(data) {
//   console.log(data)
//   currentLayer = L.geoJson(data, {
//     onEachFeature: function (feature, layer) {
//       var popup = L.popup()
//       popup.setContent(
//         "<p>District: "+feature.properties.DISTRICT+"</p>"
//         )
//       layer.bindPopup(popup);
//     }
//   })
//   currentLayer.addTo(map)
// });

// $.getJSON("http://127.0.0.1:4741/map/libraries", function(data) {
//   console.log(data)
//   L.geoJson(data).addTo(map)
//   var openspaceJson = L.geoJson(data, {
//     onEachFeature: function (feature, layer) {
//       var popup = L.popup()
//       popup.setContent(
//         "<p>Branch: "+feature.properties.BRANCH+"</p>"
//         )
//       layer.bindPopup(popup);
//     }
//   }).addTo(map)
// });



// $.getJSON("e18_2018_q34.geojson", function(data) {
//   L.geoJson(data).addTo(map)
//   console.log(data)
//   var openspaceJson = L.geoJson(data, {
//     onEachFeature: function (feature, layer) {
//       var popup = L.popup()
//       popup.setContent(
//         "<p>Offense Name: "+feature.properties.OFFENSE_DESCRIPTION+"</p>"
//         +"<p>Offense Date: "+feature.properties.OCCURRED_ON_DATE+"</p>"
//         +"<p>Day of week: "+feature.properties.DAY_OF_WEEK+"</p>"
//         +"<p>Street: "+feature.properties.STREET+"</p>"
//       )
//       layer.bindPopup(popup);
//     }
//   }).addTo(map)
// });