//On Youtube page & video playing without timestamp

var volumeVal = 0;
var timeVal = 0;
var currentTabId = -1;



function tabUpdated(tabId, changeInfo, tabInfo){
	
	function checkUrl(){
		return ((changeInfo.url.indexOf("youtube") !== -1) && (changeInfo.url.indexOf("watch?") !== -1))
	}	
	
	//Check if a video is being watched
	if (changeInfo.url && checkUrl() )
	{
		//Send update requests
		browser.runtime.sendMessage({
			command: "update headings", id: tabId, newtitle: changeInfo.title
			});			
	}
}
	
browser.tabs.onUpdated.addListener(tabUpdated);


function initialiseValues(data){

	volumeVal = data.vslider;
	timeVal = data.tslider;
	currentTabId = data.currentT;
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
