
	mins = document.getElementById("min");
	secs = document.getElementById("sec");
	enabled = document.getElementById("enabled");
	playPause = document.getElementById("play_pause");
	pause = document.getElementById("pause");
	next = document.getElementById("next");
	prev = document.getElementById("prev");
	timSkpF = document.getElementById("time_skip_fwd");
	timSkpB = document.getElementById("time_skip_back");
	volumeSlider = document.getElementById("volume_slider");
	timeSlider = document.getElementById("time_slider");
	volumeMute = document.getElementById("volume_mute");

	pause = true;
	mute = true;
	
	play_html = "<i class=\"fa fa-play\"></i>";
	pause_html = "<i class=\"fa fa-pause\"></i>";
	mute_html = "<i class=\"fa fa-volume-up\"></i>";
	unmute_html =  "<i class=\"fa fa-volume-off\"></i>";
	
	function enableHandler(event){

		//Write to storage - Active_State = True
		browser.storage.local.set({activeState: enabled.checked, 
								   minutes: mins.value, 
								   seconds: secs.value,
								   });				
	}
	
	function onInputHandler(event){
		browser.storage.local.set({activeState: true,
								   minutes: mins.value, 
								   seconds: secs.value,
								   });
	}	

	function onChangeHandler(event){
		browser.storage.local.set({vslider: volumeSlider.value});
		sendCommand("adjust volume", volumeSlider.value);
	}		

	function playPauseHandler()	{
		sendCommand("play");
		sendCommand("pause status");

	}	
	
	function muteHandler(){
		sendCommand("mute");
		sendCommand("mute status");
	}

	function initialiseValues(data){

		activeState = (data.activeState);
			
		if(activeState == true){
			enabled.checked = true;
		}
		else{
			enabled.checked = false;
		}

		volumeSlider.value = data.vslider;
		mins.value = data.minutes;
		secs.value = data.seconds;
	}
	
	function nextVideo(){
		sendCommand("next video");
		sendCommand("adjust volume", volumeSlider.value);
		sendCommand("pause status");
		console.log(volumeSlider.value);


	}


	function sendCommand(cmd, param){

		function msgTabs(tabs) {
			for (let tab of tabs) {

				if(tab.url.indexOf("youtube") != -1 && tab.url.indexOf("watch?") != -1){

					browser.tabs.sendMessage(tab.id, {command: cmd, parameter: param})
											.then(response => {

												if (cmd === "video title"){
													document.getElementById("now_playing").innerHTML = response.value;
												}

												if (cmd === "next video title"){
													document.getElementById("up_next").innerHTML = response.value;
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
													console.log(mute);
													
													if (mute == false){			
														volumeMute.innerHTML = mute_html;
													}else if (mute == true){
														volumeMute.innerHTML = unmute_html;
													}

												}
											});
				}  	
			}
		}

		var querying = browser.tabs.query({}); //Create a query to fetch all tabs
		querying.then(msgTabs); //If successful send a message to each tag
	}

	browser.runtime.onMessage.addListener(request => {

		cmd = request.command;
		param = request.parameter;

		console.log("Received Message: " + cmd);
		


		if (cmd === "update headings"){
			sendCommand("video title");
			sendCommand("next video title");
		}
		
		if(cmd === "change volume"){
		sendCommand("adjust volume", volumeSlider.value);
		console.log("Hello");
		}

		if(cmd === "update play/pause"){
		sendCommand("pause status");
		console.log("Hello");
		}    		

	});

	//Initialisation
	browser.storage.local.get().then(initialiseValues);	

	mins.oninput = onInputHandler;
	secs.oninput = onInputHandler;
	enabled.onclick = enableHandler;
	
	playPause.onclick = playPauseHandler;
	volumeMute.onclick = muteHandler;
	next.onclick = nextVideo;
	prev.onclick = function(e) {sendCommand("prev video")};
	timSkpF.onclick = function(e) {sendCommand("time skip f", timeSlider.value)};
	timSkpB.onclick = function(e) {sendCommand("time skip b", timeSlider.value)};
	volumeSlider.onchange = onChangeHandler;	
	volumeSlider.onclick = onChangeHandler;	
	
	//Request video details on page load
	sendCommand("video title");
	sendCommand("next video title");

	//Request video pause status on page load
	sendCommand("pause status");
	sendCommand("mute status");
	
