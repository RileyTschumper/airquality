# Air Quality

## Todo List
- Update search box location to location name when panning the map (Riley)
- Implement heatmap visualization overlay
- If levels of one or more particle are "Unhealthy for Sensitive Groups" (orange) or higher, add a banner with the AQI descriptor
- Include a legend for the colors

## Changelog
April 22, 2019 8:26pm
+ New
  + Full screen added to both maps, done through toggling css classes (see toggleFullscreen())
  + Fix unit conversion issue
+ Not working
  + FullScreen does not have map fill full window.

April 18, 2019 12:12pm
+ New
  + Convert values to proper units based on https://uk-air.defra.gov.uk/assets/documents/reports/cat06/0502160851_Conversion_Factors_Between_ppb_and.pdf
  + Display correct units for each pollutant in table
  + Display correct values in table and in markers
  + Add button for full screen uses requestFullscreen()
+ Not working
  + Unit conversion of o3 is disastrously wrong.
  + Full screen snaps back to original formatting (probably bootstrap fighting js call)
April 17, 2019 8:09pm
+ New
  + Added Nominatim functionality to both maps
+ Not working
  + Search box does not update when panning (I haven't added it to the model yet)

April 17, 2019 2:17pm
+ New
  + Fixed marker bugs
  + Added timeouts to limit API requests

April 16, 2019 10:52pm
+ New
  + If multiple markers are in one spot, add all data to it
  + First set of markers is added when map is loaded
  + Old markers get removed when new data is fetched
  + Fixed the no results in radius error
  + Added safety coloring to our table (link below)
  + https://www3.epa.gov/airnow/aqi-technical-assistance-document-sept2018.pdf
+ Not working
  + Need to add units for coloring...some particles come in with different units
  + Adding all data to one marker is still buggy

April 16, 2019 8:57pm
+ New
  + Added second table
  + Added markers to second map
  + Generalize functions with parameter view = map1 or map2 and map = (map1/map2).map
+ Not working
  + Webpage freezes while waiting for retrieve data.

April 14, 2019 12:54am
+ New
  + Table was added using Bootstrap
  + Table is automatically updated when new data is received (it takes a couple seconds)
  + Table has a scroll bar as well!
+ Not working
  + It only works for Map 1

April 14, 2019 12:12am
+ New
  + Bootstrap was added
  + Added styling
  + Added min/max zoom as a map parameter to limit request size

April 13, 2019 3:17pm
+ New
  + Created a new Open AQ request function (Used standard HTTP request, no jquery/ajax stuff)
  + On moveend, markers will be added to the map
  + Average measurements of the same particle taken at the same location (I can explain this to you next time I see you)
+ Not working
  + Radius isn't very accurate. I think it is too large because I don't know how to use Haversine formula.
  + Only map1 is working as of right now. Can easily add the functionality to map2 though.
  + Error when no results are in radius.

April 11, 2019 at 10:45pm
+ New
  + Create second independent map
  + Create getAQ() to access OpenAQ API to get markers
  + Create simple table placeholders for each map
+ Not working
  + Markers are not added to table

April 9, 2019 at 4:03pm
+ New
  + Input boxes now update when panned

April 9, 2019 at 2:55pm
+ New
  + Currently there is one functioning map.
  + Uses mounted() to initialize map when app is loaded
  + Input boxes show the starting location. Each of them is bound to a piece of data in the Vue model using v-model
  + Any updates to the input boxes, update the map using the @change directive
+ Not working
  + Input boxes don't update when new location is panned
