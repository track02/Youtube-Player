# Youtube-Skipper
Firefox extension to automatically skip Youtube videos by a specified amount of time.

Enter Min/Sec in the box and press enable, videos will automatically be skipped by the set amount.

Disable the addon by hitting the disable button.

## To Do

- Write function to store input time value and enable flag into local storage
- skipContent.js is executed whenever a youtube page loads, if enable flag is found then add the timestamp to the url and reload
- skipContent.js needs to check if current url already contains a timestamp, if so don't change anything

## Other

- Icon from https://material.io/icons/
