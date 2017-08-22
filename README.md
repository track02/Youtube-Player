# Youtube-Skipper
Firefox extension to automatically skip Youtube videos by a specified amount of time.

Also provides player control functionality from addon dropdown allowing a youtube video to be paused/played from any tab.

Enter Min/Sec in the box and press enable, videos will automatically be skipped by the set amount.

Disable the addon by hitting the disable button.

## To Do

- Investigate Youtube player control access (Done for HTML5 Video, look into Youtube API)
- Implement PageListener functionality, player controls, message parsing, request responses (video name, next video, etc)
- Consider moving timestamp / skip functionality into page listener and have tabmonitor send a request on tab change.

## Other

- Icon from https://material.io/icons/
- Bootstrap CSS https://v4-alpha.getbootstrap.com/
- Font Awesome http://fontawesome.io/icons/
