# Air Quality

## Todo List:
- Add a second independent map
- Input box text should update with new location (lat/long coordinates) when map is panned

## Changelog
April 9, 2019 at 2:55pm
+ New
  + Currently there is one functioning map.
  + Uses mounted() to initialize map when app is loaded
  + Input boxes show the starting location. Each of them is bound to a piece of data in the Vue model using v-model
  + Any updates to the input boxes, update the map using the @change directive
+ Not working
  +Input boxes don't update when new location is panned
