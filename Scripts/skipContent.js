(function() {

console.log("Youtube page - script loaded");

//Read from storage - Active_State
activeState = false;

minutes = 0;
seconds = 0;


browser.storage.local.get().then(
function(data){
	console.log(data);
	activeState = (data.activeState);
	minutes = data.minutes;
	seconds = data.seconds;
	
	console.log(minutes);
	console.log(seconds);
	window.location.href = (window.location.href + "#t=" + minutes + "m");


});


//console.log(activeState);

//If Active_State

	//Determine if Timestamp present - Timestamp_Present

	//If ! Timestamp_Present

	//Read from storage - Minutes
	//Read from storage - Seconds
	
	//Build Timestamp
	
	//Set Timestamp

	//End_If
	
//End_if
})();
