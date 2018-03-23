// Default values for hotkey commands 
var volumeVal = 5;
var timeVal = 5;
var currentTabId = -1;

//On Youtube page & video playing without timestamp
function tabUpdated(tabId, changeInfo, tabInfo){
	
	function checkUrl(){
		return ((changeInfo.url.indexOf("youtube") !== -1) && (changeInfo.url.indexOf("watch?") !== -1))
	}	
	
	//Check if a video is being watched
	if (changeInfo.url && checkUrl() )
	{
		//Update current TabId for hotkeys for use a fallback
		currentTabId = tabId;
		
		//Send update requests - ToDo > Should only send if popup is active otherwise no receiving end to connection
		browser.runtime.sendMessage({command: "update headings", id: tabId, newtitle: changeInfo.title});		
	}
}

//Listen for tab updates using above func 
browser.tabs.onUpdated.addListener(tabUpdated);

function initialiseValues(data){

	// Read in stored tab - if it's valid then use it otherwise stick with default 
	var tabReq = browser.tabs.get(data.currentT);
	tabReq.then((validTab) => {currentTabId = (checkUrl(validTab.url)) ? validTab.id : currentTabId});
	
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

browser.commands.onCommand.addListener(function(command) {
  if (command == "play-pause-hotkey") {
	console.log("Play hk");
	sendCommand("play");
  }
  if (command == "play-next-hotkey"){
	console.log("Next hk");
	sendCommand("next video");
  }
  if (command == "replay-hotkey"){
	console.log("Replay hk");
	sendCommand("restart");
  }
  if (command == "skip-fwd-hotkey"){
	console.log("fwd hk");
	sendCommand("time skip f");
  }
  if (command == "skip-back-hotkey"){
	console.log("back hk");
	sendCommand("time skip b");
  }
});
