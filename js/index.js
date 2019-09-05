const map = L.map('mapid').setView(L.latLng(42.305552, -71.094972), 12);

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

let apiURL
const apiURLs = {
  production: 'https://boston-city-data.herokuapp.com',
  development: 'http://localhost:4741'
}

let isNotProd
const prodFlag = {
  production: false,
  development: true
}

if (window.location.hostname === 'localhost') {
  apiURL = apiURLs.development
  isNotProd = prodFlag.development
} else {
  apiURL = apiURLs.production
  isNotProd = prodFlag.production
}

const mapper = {
  "libraries": {
    dropDownLabel: "Libraries",
    popupData: [
      {fieldName: "BRANCH", fieldLabel: "Branch:"},
      {}
    ]
  },
  "zipcodes": {
    dropDownLabel: "Zip Code",
    popupData: [
      {fieldName: "ZIP5", fieldLabel: "Zip: "}
    ]
  },
  // "police_districts": {
  //   label: "District",
  //   fieldName: "DISTRICT"
  // },
  // "public_schools": {
  //   label: "School",
  //   fieldName: "SCH_NAME"
  // },
  // "neighborhoods": {
  //   label: "Neighborhood",
  //   fieldName: "NAME"
  // },
  // "hydrants": {
  //   label: "Enabled",
  //   fieldName: "ENABLED"
  // },
  "fire_stations": {
    dropDownLabel: "Fire Stations",
    popupData: [
      {fieldName: "LOCNAME", fieldLabel: "Station:"},
      {fieldName: "GEOADDRESS", fieldLabel: "Address:"}
    ]
  },
  // "fire_districts": {
  //   label: "District",
  //   fieldName: "DISTRICT"
  // },
  // "trees": {
  //   label: "Type",
  //   fieldName: "TYPE"
  // },
   // "crimes": {
  //   label: "???",
  //   fieldName: "???"
  // },
  // "openspaces": {
  //   label: "Name",
  //   fieldName: "SITE_NAME"
  // },
  // "landmarks": {
  //   label: "Landmark",
  //   fieldName: "Name_of_Pr"
  // }
}

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var options = "<select id=\"map_menu\">"
    $.each(mapper, function(idx, val) {
      options+="<option id=\""+idx+"\" value=\""+idx+"\">"+val.dropDownLabel+"</option>"
    })
    options += "</select>"
    div.innerHTML = options;
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend.addTo(map);

let template = $("#popup-template").html()
console.log(template)
let templateScript = Handlebars.compile(template);

$('#map_menu').change(function() {
  var optionSelected = $("option:selected", this);
  var valueSelected = optionSelected[0].value;
  url = apiURL+"/map/"+valueSelected
  let context = []
  $.getJSON(url, function(data) {
    // map valueSelected/api endpoint to something describing
    // the label the popup should have as well as the fieldname it should display
    // soon, with other data, we'll need to iterate through and give multiple 
    // fields if needed - may want handlebars for this
    map.removeLayer(layerGroup)
    layerGroup = L.layerGroup().addTo(map);
    let featureMappings = mapper[valueSelected].popupData
    currentLayer = L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        context['current'] = feature
        context['features'] = featureMappings
       // console.log(context)
        var popup = L.popup()
        var holder = feature['properties']
        let test = templateScript(context)
        console.log(test)
        popup.setContent(
          
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