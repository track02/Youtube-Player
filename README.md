# Youtube-Skipper
Firefox extension to automatically skip Youtube videos by a specified amount of time.

Also provides player control functionality from addon dropdown allowing a youtube video to be paused/played from any tab.

Enter Min/Sec in the box and press enable, videos will automatically be skipped by the set amount.

Disable the addon by hitting the disable button.

## To Do

- Write function to store input time value and enable flag into local storage [X]
- skipContent.js is executed whenever a youtube page loads, if flag is found then add the timestamp to the url and reload [X]
- skipContent.js needs to check if current url already contains a timestamp, if so don't change anything [X]
- Investigate ability to access tab content.  [TODO]
- Listen to Youtube tabs - and run script on video changes. [TODO]
- Investigate Youtube player control access [TODO]

## Other

- Icon from https://material.io/icons/
