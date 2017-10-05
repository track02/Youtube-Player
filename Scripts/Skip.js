
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
	timeLabel = document.getElementById("time_value");
	volumeMute = document.getElementById("volume_mute");
	cTime = document.getElementById("current_time");
	totalTime = 1;
	
	
	dropdown = document.getElementById("dropdown_menu");
	pause = true;
	mute = true;
	
	var currentTab = -1;
	currentTabPosition = 0;
	currentTabFound = false;
	tabArray = new Array();
	tabVideoNames = new Array();	
	
	play_html = "<i class=\"fa fa-play\"></i>";
	pause_html = "<i class=\"fa fa-pause\"></i>";
	mute_html = "<i class=\"fa fa-volume-up\"></i>";
	unmute_html =  "<i class=\"fa fa-volume-off\"></i>";

	function updateTimerLabel(){

		timeLabel.value = "±" + timeSlider.value + "s";

	}


	
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
		timeSlider.value = data.tslider;
		updateTimerLabel();
		mins.value = data.minutes;
		secs.value = data.seconds;
		currentTab = data.currentT
	}
	
	function nextVideo(){
		sendCommand("next video");
		sendCommand("adjust volume", volumeSlider.value);
		sendCommand("pause status");


	}
	
	function updateTimeslider(){
		browser.storage.local.set({tslider: timeSlider.value});
		updateTimerLabel();
	}

	function parseTime(timeInput){
		minutes = Math.floor(timeInput / 60);
		seconds = timeInput % 60;
		
		result = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);		
		
		return result;
	}
	
	function timeTimerHandler(){
		sendCommand("time total");
		sendCommand("time current");

	}

	function sendCommand(cmd, param){
					
					browser.tabs.sendMessage(currentTab.id, {command: cmd, parameter: param})
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

		console.log("Received Message: " + cmd);

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
	
	function createTabArray(tabs){
		
		tabArray = [];
		
		dropdown.innerHTML = "";
		var video_found = 0;
		//currentTab = -1;
		
		for (let tab of tabs) {

			if(tab.url.indexOf("youtube") != -1 && tab.url.indexOf("watch?") != -1){
				
				video_found = 1;
				
				tabArray.push(tab);
				browser.tabs.sendMessage(tab.id, {command: "video title"})
					.then(response => {
						dropdown.options[dropdown.options.length] = new Option(response.value);
						});
				
				if (currentTab == -1){

					currentTab = tab;
				}
				
				if(tabArray[tabArray.length - 1].url == currentTab.url){
					currentTabPosition = tabArray.length - 1;
					currentTabFound = true;

				}
				
						
			}
			
		}
		
		if(currentTabFound == false){
			currentTab = tabArray[0]; //default to the first tab
		}
		
		if (video_found == 0){
			dropdown.innerHTML = "<option value=\"\">No Active Videos</option>";
		}
		

		
			//Request video details on page load
			sendCommand("video title");
			sendCommand("next video title");

			//Request video pause status on page load
			sendCommand("pause status");
			sendCommand("mute status");
			timeTimerHandler();

	}
	
	function videoSelectHandler(){
		console.log("HERE");
		console.log(dropdown.selectedIndex);
		console.log(tabArray);
		browser.storage.local.set({currentT: tabArray[dropdown.selectedIndex]});

		currentTab = tabArray[dropdown.selectedIndex];
		sendCommand("pause status");
		sendCommand("mute status");
		//Request video details on page load
		sendCommand("video title");
		sendCommand("next video title");

		//Request video pause status on page load
		sendCommand("pause status");
		sendCommand("mute status");
		timeTimerHandler();
	}
	
	
	//Initialisation
	browser.storage.local.get().then(initialiseValues);	
	var querying = browser.tabs.query({}); //Create a query to fetch all tabs
	querying.then(createTabArray); //If successful send a message to each tag
	
	
	dropdown.onchange = videoSelectHandler;
	
	mins.oninput = onInputHandler;
	secs.oninput = onInputHandler;
	enabled.onclick = enableHandler;
	
	playPause.onclick = playPauseHandler;
	volumeMute.onclick = muteHandler;
	next.onclick = nextVideo;
	prev.onclick = function(e) {sendCommand("prev video")};
	timeSlider.onchange = updateTimeslider;

	timSkpF.onclick = function(e) {sendCommand("time skip f", timeSlider.value)};
	timSkpB.onclick = function(e) {sendCommand("time skip b", timeSlider.value)};
	volumeSlider.onchange = onChangeHandler;	
	volumeSlider.onclick = onChangeHandler;	
	
	setTimeout(function(e) {dropdown.options[currentTabPosition].selected = true}, 250)

 	setInterval(timeTimerHandler, 250);

	