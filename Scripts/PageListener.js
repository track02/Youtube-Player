/*
*
* Listens for requests to access player settings
* 					TO DO				
*
*/

console.log("Page listener loaded");
//console.log(video);


/*browser.runtime.onMessage.addListener(request => {

	console.log("Message Received");
	console.log(request.command);
	
});*/

browser.runtime.onMessage.addListener(request => {

	console.log("Received");	

		cmd = request.command;
		playpause = document.getElementsByClassName("ytp-play-button")[0];
		prev = document.getElementsByClassName("ytp-prev-button")[0];
		next = document.getElementsByClassName("ytp-next-button")[0];
		video = document.getElementsByTagName("video")[0];
		vol = document.getElementsByClassName("ytp-volume-panel")[0];
		volume = vol.getAttribute("aria-valuenow");

		console.log("parsing command " + cmd);
		

		if (cmd === "play"){
			playpause.click();
		}
		else if (cmd === "pause"){
			playpause.click();
		}
		else if (cmd === "volume down" && video){
			video.volume -= 0.01;
		}
		else if (cmd === "volume up" && video){
			video.volume += 0.01;
		}
		else if (cmd === "next video"){
			next.click();
		}
		else if (cmd === "prev video"){
			prev.click()	
		}
		else if (cmd === "video title"){
			//Send a response
		}
		else if (cmd === "next video"){
			//Send a response
		}
		else{
			console.log("invalid command");
		}
	
});