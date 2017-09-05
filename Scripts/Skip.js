
	mins = document.getElementById("min");
	secs = document.getElementById("sec");
	enabled = document.getElementById("enabled");
	play = document.getElementById("play");
	pause = document.getElementById("pause");
	next = document.getElementById("next");
	prev = document.getElementById("prev");
	volUp = document.getElementById("volume_up");
	volDn = document.getElementById("volume_down");
	timSkpF = document.getElementById("time_skip_fwd");
	timSkpB = document.getElementById("time_skip_back");
	skip = document.getElementById("skip_sec");
	volumeSlider = document.getElementById("volume_slider");

	function enableHandler(event){

		//Write to storage - Active_State = True
		browser.storage.local.set({activeState: enabled.checked, 
								   minutes: mins.value, 
								   seconds: secs.value,
								   skip: skip.value});
				
	}


	
	function onInputHandler(event){
		browser.storage.local.set({activeState: true,
								   minutes: mins.value, 
								   seconds: secs.value,
								   skip: skip.value});
	}
	

	function onChangeHandler(event){
		browser.storage.local.set({vslider: volumeSlider.value});
		sendCommand("adjust volume", volumeSlider.value);
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
		skip.value = data.skip;
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

												if (cmd == "next video title"){
													document.getElementById("up_next").innerHTML = response.value;
												}
											});
				}  	
			}
		}

		var querying = browser.tabs.query({}); //Create a query to fetch all tags
		querying.then(msgTabs); //If successful send a message to each tag
	}


	browser.storage.local.get().then(initialiseValues);	

	mins.oninput = onInputHandler;
	secs.oninput = onInputHandler;
	skip.oninput = onInputHandler
	enabled.onclick = enableHandler;

	
	play.onclick = function(e) {sendCommand("play")};
	pause.onclick = function(e) {sendCommand("pause")};
	next.onclick = function(e) {sendCommand("next video")};
	prev.onclick = function(e) {sendCommand("prev video")};
	volUp.onclick = function(e) {sendCommand("volume up")};
	volDn.onclick = function(e) {sendCommand("volume down")};
	timSkpF.onclick = function(e) {sendCommand("time skip f", skip.value)};
	timSkpB.onclick = function(e) {sendCommand("time skip b", skip.value)};
	volumeSlider.onchange = onChangeHandler;

	
	
	sendCommand("video title");
	sendCommand("next video title");

	browser.runtime.onMessage.addListener(request => {

		cmd = request.command;


		console.log("Received Message: " + cmd);

		if (cmd === "update headings"){
			sendCommand("video title");
			sendCommand("next video title");
		}
	});