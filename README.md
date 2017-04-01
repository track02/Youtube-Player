# Youtube-Skipper
Firefox extension to automatically skip Youtube videos by a specified amount

## To Do

- Write JS file to manage skipping
  - Event handler for enable/disable buttons to set some persistent flag 
  - Store time to skip when enable is selected (overwriting previous value)
  - Generate timecode string, update url and refresh (check youtube api, may be better way to do this without reloading page)
  
-Simplest method, extract current URL, if it's youtube then modify it with timecode and reload
-If a timecode is already present or it's not a youtube link then do nothing.

## Other

- Icon from https://material.io/icons/
