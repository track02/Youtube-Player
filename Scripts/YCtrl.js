	playPause = document.getElementById("play_pause");
	pause = document.getElementById("pause");
	next = document.getElementById("next");
	prev = document.getElementById("prev");
	timSkpF = document.getElementById("time_skip_fwd");
	timSkpB = document.getElementById("time_skip_back");
	volumeSlider = document.getElementById("volume_slider");
	timeSlider = document.getElementById("time_slider");
	timeLabel = document.getElementById("time_value");
	volumeMute = document.getElementById("volume_mute");
	cTime = document.getElementById("current_time");
	totalTime = 1;
	dropdown = document.getElementById("dropdown_menu");
	pause = true;
	mute = true;
	
	var currentTabId = -1;
	currentTabFound = false;
	tabArray = [];
	
	play_html = "<i class=\"fa fa-play\"></i>";
	pause_html = "<i class=\"fa fa-pause\"></i>";
	mute_html = "<i class=\"fa fa-volume-up\"></i>";
	unmute_html =  "<i class=\"fa fa-volume-off\"></i>";

	poll_status = false;
	prev_response = "";

	function updateTimerLabel(){
		timeLabel.value = "±" + timeSlider.value + "s";
	}

	function onVolumeChange(event){
		browser.storage.local.set({vslider: volumeSlider.value});
		sendCommand("adjust volume", volumeSlider.value);
	}		

	function playPauseHandler()	{
		sendCommand("play");
		sendCommand("pause status");
		console.log("sending play pause");
	}	
	
	function muteHandler(){
		sendCommand("mute");
		sendCommand("mute status");
	}

	function initialiseValues(data){

		volumeSlider.value = data.vslider;
		timeSlider.value = data.tslider;
		updateTimerLabel();
		currentTabId = data.currentT;
	}
	
	function nextVideo(){
		sendCommand("next video");
		sendCommand("adjust volume", volumeSlider.value);
		sendCommand("pause status");
		console.log(volumeSlider.value);
	}
	
	function updateTimeslider(){
		browser.storage.local.set({tslider: timeSlider.value});
		updateTimerLabel();
	}

	function parseTime(timeInput){

		if(isNaN(timeInput)){
			return "--:--";
		}

		minutes = Math.floor(timeInput / 60);
		seconds = timeInput % 60;
		
		result = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);				
		return result;
		
	}
	
	function statusUpdate(){
		if (currentTabId != -1){
			sendCommand("time total");
			sendCommand("time current");

			if(poll_status){
				console.log("polling");
				sendCommand("video title");
				sendCommand("next video title");
				sendCommand("adjust volume", volumeSlider.value);
				sendCommand("pause status");
			}			
		}
	}

	function sendCommand(cmd, param){
					
					browser.tabs.sendMessage(currentTabId, {command: cmd, parameter: param})
											.then(response => {

												if (cmd == "next video"){
													poll_status = true;
												}

												if (cmd === "video title"){
													if(response.value == undefined){
														document.getElementById("now_playing").innerHTML = "---";
													}
													else{
														document.getElementById("now_playing").innerHTML = response.value;					
													}


													//Check if change in received info - stop polling
													if (prev_response != response.value){														
														prev_response = response.value;
														poll_status = false;
														dropdown.options[dropdown.selectedIndex].text = response.value;
													}
												}

												if (cmd === "next video title"){
													if(response.value == undefined){
														document.getElementById("up_next").innerHTML = "---";
													}
													else{
														document.getElementById("up_next").innerHTML = response.value;					
													}
												}

												if(cmd === "pause status"){
													pause = response.value;
													
													if (pause == false){			
														playPause.innerHTML = pause_html;
													}else if (pause == true){
														playPause.innerHTML = play_html;
													}		
												}

												if(cmd === "mute status"){
													mute = response.value;
													
													if (mute == false){			
														volumeMute.innerHTML = mute_html;
													}else if (mute == true){
														volumeMute.innerHTML = unmute_html;
													}

												}
												
												if(cmd == "time total"){
													timeTotal= parseTime(parseInt(response.value));
												}
												if(cmd === "time current"){
													timeCurrent = parseInt(response.value);
													cTime.innerHTML = parseTime(timeCurrent) + " / " + timeTotal;				
												}
											});
	}

	browser.runtime.onMessage.addListener(request => {

		cmd = request.command;
		param = request.parameter;

		if (cmd === "update headings"){
			sendCommand("video title");
			sendCommand("next video title");
		}
		
		if(cmd === "change volume"){
			sendCommand("adjust volume", volumeSlider.value);
		}

		if(cmd === "update play/pause"){
			sendCommand("pause status");
		}
	});
	
	function createDropdown(tabs){

		dropdown.innerHTML = "";
		
		for (let tab of tabs) {

			if(tab.url.indexOf("youtube") != -1 && tab.url.indexOf("watch?") != -1){

				dropdown.options[dropdown.options.length] = new Option(tab.title, tab.id);			

				if (currentTabId == -1){
					currentTabId = tab.id;
					videoSelectHandler();
				}
				
				if(tab.id == currentTabId){
					dropdown.options[dropdown.options.length -1].selected = true;
					currentTabFound = true;
				}						
			}  	
		}
		
		if(currentTabFound == false && dropdown.options.length != 0){
			currentTabId = parseInt(dropdown.options[dropdown.selectedIndex].value);
			browser.storage.local.set({currentT: currentTabId});
		}

		if (dropdown.options.length == 0){
			dropdown.options[0] = new Option("No Active Videos", null);	
			currentTabId = -1;
		}
		else {
		
			//Request video details on page load
			sendCommand("video title");
			sendCommand("next video title");

			//Request video pause status on page load
			sendCommand("pause status");
			sendCommand("mute status");
		}
	}
	
	function videoSelectHandler(){
		console.log(dropdown.selectedIndex);
		currentTabId = parseInt(dropdown.options[dropdown.selectedIndex].value);
		browser.storage.local.set({currentT: currentTabId});
		console.log(currentTabId);
		poll_status = true;
		statusUpdate();
		poll_status = false;
	}	
	
	//Initialisation
	browser.storage.local.get().then(initialiseValues);	
	
	var querying = browser.tabs.query({}); //Create a query to fetch all tabs
	querying.then(createDropdown); //If successful build a dropdown of all video tabs
	
	dropdown.onchange = videoSelectHandler;
	
	playPause.onclick = playPauseHandler;
	volumeMute.onclick = muteHandler;
	next.onclick = nextVideo;
	prev.onclick = function(e) {sendCommand("prev video")};
	timeSlider.onchange = updateTimeslider;

	timSkpF.onclick = function(e) {sendCommand("time skip f", timeSlider.value)};
	timSkpB.onclick = function(e) {sendCommand("time skip b", timeSlider.value)};
	volumeSlider.onchange = onVolumeChange;	
	volumeSlider.onclick = onVolumeChange;	
	
 	setInterval(statusUpdate, 250);	