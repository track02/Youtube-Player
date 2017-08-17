(function() {

console.log("Youtube page - script loaded");

//Read from storage - Active_State
activeState = false;

browser.storage.local.get().then(
function(data){
	console.log(data);
	activeState = (item.activeState);
});


//console.log(activeState);

//If Active_State

	//Determine if Timestamp present - Timestamp_Present

	//If ! Timestamp_Present

	//Read from storage - Minutes
	//Read from storage - Seconds
	
	//Build Timestamp
	
	//Set Timestamp
	window.location.href = (window.location.href + "#t=5m");

	//End_If
	
//End_if
})();
