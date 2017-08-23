/*
*
* Listens for requests to access player settings
* 					TO DO				
*
*/



function play(){
	console.log("play");
}

function pause(){
	console.log("pause");
}

function volumeUp(){
	console.log("vup");
}

function volumeDown(){
	console.log("vdn");
}

function nextVideo(){
	console.log("next");
}

function previousVideo(){
	console.log("prev");
}

function videoOk(){
	return (typeof video != 'undefined' && video)
}

console.log("Page listener loaded");
//console.log(video);


/*browser.runtime.onMessage.addListener(request => {

	console.log("Message Received");
	console.log(request.command);
	
});*/

browser.runtime.onMessage.addListener(request => {

	console.log("Received");

	video = document.getElementsByTagName("video")[0];

	if (videoOk){

		console.log("parsing command");
		cmd = request.command;

		if (cmd == "play")
			play();
		if (cmd == "pause")
			pause();
		if (cmd == "volume down")
			volumeDown();
		if (cmd == "volume up")
			volumeUp();
		if (cmd == "next video")
			nextVideo();
		if (cmd == "prev video")
			previousVideo();	

	}
	
});