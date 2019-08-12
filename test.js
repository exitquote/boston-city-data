  $.getJSON("Open_Space.geojson", function(data) {
    //L.geoJson(data).addTo(map)
    console.log(data)
    var openspaceJson = L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        var popup = L.popup()
        popup.setContent(
          "<p class=\"nametext\">"+feature.properties.SITE_NAME+"</p>"
          +"<p>Ownership: "+feature.properties.OS_Own_Jur+"</p>"
          +"<p>Overseeing agency: "+feature.properties.OS_Own_Jur+"</p>"
          +"<p>District: "+feature.properties.DISTRICT+"</p>"
          +"<p>Land Use Type: "+feature.properties.TypeLong+"</p>"
        )
        // SITE_NAME
        // ACRES
        // AgncyJuris and/or OWNERSHIP
        // DISTRIeCT
        // TypeLong
        layer.bindPopup(popup);

        //layer.popup.setContent("test");
      }
    }).addTo(map)
  });