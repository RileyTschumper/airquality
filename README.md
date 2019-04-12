# Air Quality

## Todo List:
- Add markers to map
- Fill in marker data to table
- Create scroll bar to table

## Changelog
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

April 11, 2019 at 10:45pm
+ New
  + Create second independent map
  + Create getAQ() to access OpenAQ API to get markers
  + Create simple table placeholders for each map
+ Not working
  + Markers are not added to table
