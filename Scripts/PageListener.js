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
		//Hook into player controls
		playpause = document.getElementsByClassName("ytp-play-button")[0];
		prev = document.getElementsByClassName("ytp-prev-button")[0];
		next = document.getElementsByClassName("ytp-next-button")[0];
		//Html5 video element
		video = document.getElementsByTagName("video")[0];

		console.log("parsing command " + cmd);
		console.log(request.parameter);

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
			return Promise.resolve({value: "Video title"});
			//Send a response
		}
		else if (cmd === "next video title"){
			return Promise.resolve({value: "Next Video"});
			//Send a response
		}
		else if(cmd === "time skip f"){
			video.currentTime += parseInt(request.parameter);
		}
		else if(cmd === "time skip b"){
			video.currentTime -= parseInt(request.parameter);
		}
		else{
			console.log("invalid command");
		}
	
});