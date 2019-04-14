# Air Quality

## Todo List
- Add markers on load, not just after the first move of the map
- Fix error when no results are in radius
- Map 1 is functioning with markers and a table, do the same for Map 2
- Delete markers that are outside of our radius

## Changelog
April 14, 2019 12:54am
+ New
  + Table was added using Bootstrap
  + Table is automatically updated when new data is recieved (it takes a couple seconds)
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


