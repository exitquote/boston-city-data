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

// TODO: (1) Better labeling, (2) Default to map of the full city

const mapper = {
  "libraries": {
    displayFields: [
        {"field": "BRANCH"},
        {"label": "Address:", "field": "ST_ADDRESS"}
      ],
    dropdown: "Library Branches"
  },
  "zipcodes": {
    displayFields: [
      {"field": "ZIP5"},
    ],
    dropdown: "Zip Codes"
  },
  "police_districts": {
    displayFields: [
      {"label": "District", "field": "DISTRICT"}
    ],
    dropdown: "Police Districts"
  },
  "police_stations": {
    displayFields: [
      {"field": "NAME"}
    ],
    dropdown: "Police Stations"
  },
  "public_schools": {
    label: "School",
    displayFields: [
      {"field": "SCH_NAME"},
      {"label": "Address:", "field": "ADDRESS"}
    ],
    dropdown: "Boston Public Schools"
  },
  "neighborhoods": {
    displayFields: [
      {"field": "Name"}
    ],
    dropdown: "Neighborhoods"
  },
  // "hydrants": {
  //   label: "Enabled",
  //   fieldName: "ENABLED"
  // },
  "fire_stations": {
    displayFields: [
      {"label": "Companies:", "field": "LOCNAME"}
    ],
    dropdown: "Fire Stations"
  },
  "fire_districts": {
    displayFields: [
      {"label": "District", "field": "DISTRICT"}
    ],
    dropdown: "Fire Districts"
  },
  "city_council_districts": {
    displayFields: [
      {"label": "District", "field": "DISTRICT"},
      {"label": "Councilor:", "field": "Councilor"},
      {"field": "Bio", "link": true},
      {"field": "Image", "image": true}
    ],
    dropdown: "City Council Districts"
  },
  "wards": {
    label: "Ward",
    displayFields: [
        {"label": "Ward", "field": "WARD"}
    ],
    fieldName: "WARD",
    dropdown: "Wards"
  },
  "openspaces": {
    displayFields: [
      {"field": "SITE_NAME"},
      {"field": "OWNERSHIP", "label": "Owner:"}
      // this one can have managing agency with links, etc.
    ],
    dropdown: "Open Spaces"
  },
  "landmarks": {
    displayFields: [
      {"field": "Name_of_Pr"}
    ],
    dropdown: "Landmarks"
  },
  "trash": {
    // change this to full day name
    displayFields: [
      {"field": "trashDayLong"}
    ],
    dropdown: "Trash Collection Days"
  },
  "precincts": {
    displayFields: [
      {"field": "PRECINCT", "label": "Precinct"}
    ],
    dropdown: "Precincts"
  },
  "fire_alarm_boxes": {
    displayFields: [
      {"field": "LOCATION2"}
    ],
    dropdown: "Fire Alarm Boxes"
  },
  "polling_locations": {
    // does this possibly have the wards/precincts who vote here?
    displayFields: [
      {"field": "Location2"}
    ],
    dropdown: "Polling Locations"
  },
  "snow_emergency_routes": {
    displayFields: [
      {"field": "FULL_NAME"}
    ],
    dropdown: "Snow Emergency Routes"
  }
  // "trees": {
  //   label: "Type",
  //   fieldName: "TYPE"
  // },
   // "crimes": {
  //   label: "???",
  //   fieldName: "???"
  // },
}

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var options = "<select id=\"map_menu\">"

    $.each(mapper, function(idx, val) {
      options+="<option label=\""+val.dropdown+"\" id=\""+idx+"\">"+idx+"</option>"
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
  url = apiURL+"/map/"+valueSelected
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
    currentLayer = L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        var popup = L.popup()
        var holder = feature['properties']
        popupContent = ""
        mapperEntry['displayFields'].forEach(function(item) {
          if (!item['image'] && !item['link']) {
            if (item['label'] != undefined) {
              label = item['label']+" "
              popupContent += "<div class=\"popup-line\"><span class=\"popup-title\">"+label+"</span>"+holder[item['field']]+"</div>"
            } else {
                label = ""
                popupContent += "<div class=\"popup-line\"><span class=\"popup-title\">"+holder[item['field']]+"</span></div>"
            }
            
          }
          if (item['image']) {
            img = holder[item['field']]
            popupContent += "<div class=\"popup-line\"><img class=\"popup-image\" src=\""+img+"\"></div>"
          }
          if (item['link']) {
            link = holder[item['field']]
            popupContent += "<div class=\"popup-line\"><a class=\"popup-link\" href=\""+link+"\" target=\"_blank\">"+link+"</a></div>"
          }

        })
        popup.setContent(popupContent)
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

$('#map_menu').trigger('change')

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