//On message received
browser.runtime.onMessage.addListener(request => {

	cmd = request.command;

	//Hook into player controls
	playpause = document.getElementsByClassName("ytp-play-button")[0];
	prev = document.getElementsByClassName("ytp-prev-button")[0];
	next = document.getElementsByClassName("ytp-next-button")[0];

	//Html5 video element
	video = document.getElementsByTagName("video")[0];	

	/*
	 * Command Parsing
	 */
	if (cmd === "play"){
		playpause.click();
	}
	else if(cmd === "pause status"){
			browser.runtime.sendMessage({
					command: "return pause",
					parameter: video.paused
			});	
	}
	else if (cmd === "adjust volume" && video){
			video.volume = parseFloat(request.parameter);
	}
	else if (cmd === "next video"){
		next.click();
	}
	else if (cmd === "prev video"){
		prev.click()	
	}
	else if (cmd === "video title"){
		title = (document.getElementsByTagName("title")[0]).innerHTML;
		return Promise.resolve({value: title}); //Sends response
	}
	else if (cmd === "next video title"){
		nextVideo = (document.getElementsByClassName("ytp-next-button")[0]).dataset.tooltipText;			
		return Promise.resolve({value: nextVideo});	//Sends response
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