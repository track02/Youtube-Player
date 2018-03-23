	playPause = document.getElementById("play_pause");
	playPauseIcon = document.getElementById("play_pause_icon");
	pause = document.getElementById("pause");
	next = document.getElementById("next");
	prev = document.getElementById("prev");
	timSkpF = document.getElementById("time_skip_fwd");
	timSkpB = document.getElementById("time_skip_back");
	volumeSlider = document.getElementById("volume_slider");
	timeSlider = document.getElementById("time_slider");
	timeLabel = document.getElementById("time_value");
	volumeMute = document.getElementById("volume_mute");
	volumeMuteIcon = document.getElementById("volume_mute_icon");
	cTime = document.getElementById("current_time");
	dropdown = document.getElementById("dropdown_menu");
	pause = true;
	mute = true;
	
	var currentTabId = -1;
	currentTabFound = false;
	
	const play_class = "fa fa-play";
	const pause_class = "fa fa-pause";
	const mute_class = "fa fa-volume-up";
	const unmute_class =  "fa fa-volume-off";

	prev_response = ""

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
			sendCommand("video title");
			sendCommand("next video title");
			sendCommand("adjust volume", volumeSlider.value);
			sendCommand("pause status");			
		}
	}

	function sendCommand(cmd, param){

		browser.tabs.sendMessage(currentTabId, {command: cmd, parameter: param})
		.then(response => {

			if (cmd === "video title"){
				if(response.value == undefined){
					document.getElementById("now_playing").textContent = "---";
				}
				else{
					document.getElementById("now_playing").textContent = response.value;					
				}

				//Check if change in received info - stop polling
				if (prev_response != response.value){														
					prev_response = response.value;
					dropdown.options[dropdown.selectedIndex].text = response.value;					
				}
			}

			if (cmd === "next video title"){
				if(response.value == undefined){
					document.getElementById("up_next").textContent = "---";
				}
				else{
					document.getElementById("up_next").textContent = response.value;					
				}
			}

			if(cmd === "pause status"){
				pause = response.value;
				
				if (pause == false){			
					playPauseIcon.className = pause_class;
				}else if (pause == true){
					playPauseIcon.className = play_class;
				}		
			}

			if(cmd === "mute status"){
				mute = response.value;
				
				if (mute == false){			
					volumeMuteIcon.className = mute_class;
				}else if (mute == true){
					volumeMuteIcon.className = unmute_class;
				}
			}
			
			if(cmd == "time total"){
				timeTotal= parseTime(parseInt(response.value));
			}
			if(cmd === "time current"){
				timeCurrent = parseInt(response.value);
				cTime.textContent = parseTime(timeCurrent) + " / " + timeTotal;				
			}
		});
	}

	browser.runtime.onMessage.addListener(request => {

		cmd = request.command;
		param = request.parameter;

		if (cmd === "update headings"){
			QueryTabs()
			window.location.reload();
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
			sendCommand("pause status");
			sendCommand("mute status");
		}		
	}
	
	function videoSelectHandler(){
		QueryTabs()
		currentTabId = parseInt(dropdown.options[dropdown.selectedIndex].value);
		browser.storage.local.set({currentT: currentTabId});
	}		
	
	function QueryTabs(){
		console.log("updating dropdown")
		var querying = browser.tabs.query({url: "*://*.youtube.com/*"}); //Create a query to fetch all tabs
		querying.then(createDropdown);
	}	
	
	function getTabs(tabs){
		urlOfTabs = [];
		
		for(let tab of tabs){
			urlOfTabs.push(tab.url);
		}
		return urlOfTabs;
	}	
	
	//Initialisation
	browser.storage.local.get().then(initialiseValues);	
	
	QueryTabs();
	dropdown.onchange = videoSelectHandler;
	
	playPause.onclick = playPauseHandler;
	volumeMute.onclick = muteHandler;
	next.onclick = nextVideo;
	restart.onclick = function(e) {sendCommand("restart")};
	timeSlider.onchange = updateTimeslider;
	timSkpF.onclick = function(e) {sendCommand("time skip f", timeSlider.value)};
	timSkpB.onclick = function(e) {sendCommand("time skip b", timeSlider.value)};
	volumeSlider.onchange = onVolumeChange;	
	volumeSlider.onclick = onVolumeChange;	
	
 	setInterval(statusUpdate, 250);