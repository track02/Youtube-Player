
	mins = document.getElementById("min");
	secs = document.getElementById("sec");
	disable = document.getElementById("Disable");
	enable = document.getElementById("Enable");
	play = document.getElementById("play");
	pause = document.getElementById("pause");
	next = document.getElementById("next");
	prev = document.getElementById("prev");
	volUp = document.getElementById("volume_up");
	volDn = document.getElementById("volume_down");


	function enableHandler(event){

				
		//Write to storage - Active_State = True
		browser.storage.local.set({activeState: true, 
								   minutes: mins.value, 
								   seconds: secs.value});
		
		//Toggle button visibilty
		toggleButtons();					
	}

	function disableHandler(event){		
		
		//Write to storage - Active_State = False
		browser.storage.local.set({activeState: false,
								   minutes: mins.value, 
								   seconds: secs.value});
		
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
								   seconds: secs.value});
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
	}


	function sendCommand(cmd){

		function msgTabs(tabs) {
			for (let tab of tabs) {

				if(tab.url.indexOf("youtube") != -1 && tab.url.indexOf("watch?") != -1){
					console.log("sending message to " + tab.url);
					browser.tabs.sendMessage(tab.id, {command: cmd});
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
	enable.onclick = enableHandler;
	disable.onclick = disableHandler;
	play.onclick = function(e) {sendCommand("play")};
	pause.onclick = function(e) {sendCommand("pause")};
	next.onclick = function(e) {sendCommand("next video")};
	prev.onclick = function(e) {sendCommand("prev video")};
	volUp.onclick = function(e) {sendCommand("volume up")};
	volDn.onclick = function(e) {sendCommand("volume down")};





