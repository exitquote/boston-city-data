A quick-and-dirty mapping solution using Leaflet.js for Analyze Boston data.

The repo includes some cleaned-up crime data from Analyze Boston's police incident report data set.  These data
are available only in CSV format from the City's website, so I've taken a few chunks of it, cleaned it of any
entries that did not have location data (for some data sets, this was sizeable enough to note - e.g. ~250 of
5500 entries have been expunged), and converted to GeoJSON for use with Leaflet.  This is not 100% of the 
available data, but it is a nice way to get an idea of incident reports in particular areas of the city.
