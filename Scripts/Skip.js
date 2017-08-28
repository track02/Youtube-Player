
	mins = document.getElementById("min");
	secs = document.getElementById("sec");
	skip = document.getElementById("skp");
	disable = document.getElementById("Disable");
	enable = document.getElementById("Enable");
	play = document.getElementById("play");
	pause = document.getElementById("pause");
	next = document.getElementById("next");
	prev = document.getElementById("prev");
	volUp = document.getElementById("volume_up");
	volDn = document.getElementById("volume_down");
	timSkpF = document.getElementById("time_skip_fwd");
	timSkpB = document.getElementById("time_skip_back");

	function enableHandler(event){

				
		//Write to storage - Active_State = True
		browser.storage.local.set({activeState: true, 
								   minutes: mins.value, 
								   seconds: secs.value,
								   skip: skip.value});
		
		//Toggle button visibilty
		toggleButtons();					
	}

	function disableHandler(event){		
		
		//Write to storage - Active_State = False
		browser.storage.local.set({activeState: false,
								   minutes: mins.value, 
								   seconds: secs.value,
								   skip: skip.value});
		
		//Toggle button visibility
		toggleButtons();		
	}

	function toggleButtons()
	{
		enable.classList.toggle("Hidden");
		disable.classList.toggle("Hidden");
	}
	
	function onInputHandler(event){
		browser.storage.local.set({activeState: true,
								   minutes: mins.value, 
								   seconds: secs.value,
								   skip: skip.value});
	}
	

	function initialiseValues(data){

		activeState = (data.activeState);
			
		if(activeState == true){
			disable.classList.toggle("Hidden");
		}
		else{
			enable.classList.toggle("Hidden");
		}

		mins.value = data.minutes;
		secs.value = data.seconds;
		skip.value = data.skip;
	}


	function sendCommand(cmd, param){

		function msgTabs(tabs) {
			for (let tab of tabs) {

				if(tab.url.indexOf("youtube") != -1 && tab.url.indexOf("watch?") != -1){
					console.log("sending message to " + tab.url);
					browser.tabs.sendMessage(tab.id, {command: cmd, parameter: param});
				}  	
			}
		}

		function onError(error) {
			console.log(`Error: ${error}`);
		}

		var querying = browser.tabs.query({}); //Create a query to fetch all tags
		querying.then(msgTabs, onError); //If successful send a message to each tag
	}


	browser.storage.local.get().then(initialiseValues);	

	mins.oninput = onInputHandler;
	secs.oninput = onInputHandler;
	skp.oninput = onInputHandler;
	enable.onclick = enableHandler;
	disable.onclick = disableHandler;
	play.onclick = function(e) {sendCommand("play")};
	pause.onclick = function(e) {sendCommand("pause")};
	next.onclick = function(e) {sendCommand("next video")};
	prev.onclick = function(e) {sendCommand("prev video")};
	volUp.onclick = function(e) {sendCommand("volume up")};
	volDn.onclick = function(e) {sendCommand("volume down")};
	timSkpF.onclick = function(e) {sendCommand("time skip f", skip.value)};
	timSkpB.onclick = function(e) {sendCommand("time skip b", skip.value)};




