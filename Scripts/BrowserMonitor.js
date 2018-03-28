// Default values for hotkey commands 
var volumeVal = 5;
var timeVal = 5;
var currentTabId = -1;

// Initial tab search 

function checkUrl(url){
	return ((url.indexOf("youtube") !== -1) && (url.indexOf("watch?") !== -1))
}	


//On Youtube page & video playing without timestamp
function tabUpdated(tabId, changeInfo, tabInfo){

	//Check if a video is being watched
	if (changeInfo.url && checkUrl(changeInfo.url) )
	{
		//Update current TabId for hotkeys for use a fallback
		currentTabId = tabId;
		console.log(currentTabId);
		
		//Send update requests - ToDo > Should only send if popup is active otherwise no receiving end to connection
		browser.runtime.sendMessage({command: "update headings", id: tabId, newtitle: changeInfo.title});		
	}
}

//Listen for tab updates using above func 
browser.tabs.onUpdated.addListener(tabUpdated);

//Listen for requests from key listener
browser.runtime.onMessage.addListener(keyMessageListener);

function initialiseValues(data){

	// Read in stored tab - if it's valid then use it otherwise stick with default 
	if (data.currentT != undefined){
		var tabReq = browser.tabs.get(data.currentT);
		tabReq.then((validTab) => {currentTabId = (checkUrl(validTab.url)) ? validTab.id : currentTabId});
	}
	volumeVal = (data.vslider == undefined) ? volumeVal : data.vslider;
	timeVal = (data.tslider == undefined) ? timeVal : data.tslider;
}

function sendCommand(cmd)
{
	browser.storage.local.get().then(data =>
	{
		initialiseValues(data);		
		if (currentTabId != -1 && currentTabId != undefined){
			console.log(timeVal);
			browser.tabs.sendMessage(currentTabId, {command: cmd, parameter: timeVal});	
		}
	});
}

function keyMessageListener(message)
{	
	var command = message.hotKeyCommand	
	
	if (command == "play-pause-hotkey") {
		console.log("receive play hk");
		sendCommand("play");
	}
	if (command == "play-next-hotkey"){
		console.log("receive Next hk");
		sendCommand("next video");
	}
	if (command == "replay-hotkey"){
		console.log("receive Replay hk");
		sendCommand("restart");
	}
	if (command == "skip-fwd-hotkey"){
		console.log("receive fwd hk");
		sendCommand("time skip f");
	}
	if (command == "skip-back-hotkey"){
		console.log("receive back hk");
		sendCommand("time skip b");
	}
}