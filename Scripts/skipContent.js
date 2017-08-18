console.log("Youtube page - script loaded");

//Read from storage - Active_State
activeState = false;
minutes = 0;
seconds = 0;

//Expect no timestamp and a video 
function checkUrl(url)
{
	return ((url.indexOf("#t=") == -1) && (url.indexOf("watch?") !== -1))
}

function insertTimestamp(){

	console.log("URL Change!");

	browser.storage.local.get().then(
		function(data){
			
			console.log(data);
			activeState = (data.activeState);
			minutes = data.minutes;
			seconds = data.seconds;
			
			console.log(minutes);
			console.log(seconds);
			console.log(checkUrl(window.location.href));
					
			if (activeState && (checkUrl(window.location.href)) && (minutes > 0 || seconds > 0))
			{
				console.log("No timestamp adding");
				window.location.href = (window.location.href + "#t=" + minutes + "m" + seconds + "s");
			}
			else{
				console.log("timestamp / not active / no times");
			}		
		}
	);
}

insertTimestamp(); //Call on a youtube page load
