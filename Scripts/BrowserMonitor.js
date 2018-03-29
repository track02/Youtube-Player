// Default values for hotkey commands 
var volumeVal = 5;
var timeVal = 5;
var currentTabId = -1;
var firstTabId = -1;

startupTabCheck();

// Initial tab search 

function startupTabCheck()
{
	// Run once on startup 	
	// Iterate over all browser tabs 
	console.log("Beginning Startup Check");
	
	var tabquery = browser.tabs.query({});
	
	// If valid URL 
	tabquery.then((tabs) =>
	{
		for(let tab of tabs){
			
			console.log(`Checking Tab - ${tab.url}`);
					
			if (checkUrl(tab.url)){
				
				console.log(`Valid Tab found ${tab.url} / ${tab.id}`);
				
				if (firstTabId == -1)
				{
					firstTabId = tab.id;
				}				
				
				// Request play status 				
				browser.tabs.sendMessage(tab.id, {command: "pause status"}).then( (response) => {
					
					// If false (tab is playing) -> this tab becomes current tab (first playing YT Video)
					if (!response.value){
						console.log(`Current Tab ID Updated - ${tab.id} `);
						currentTabId = tab.id;
					}					
				});
			}			
		}
		
		// If no playing videos are found default to first found YT video 
		if (currentTabId == -1)
		{
			console.log(`No Playing video found - falling back to first found ${firstTabId}`);
			currentTabId = firstTabId;
		}		
	});
}

function checkUrl(url){
	return ((url.indexOf("youtube") !== -1) && (url.indexOf("watch?") !== -1))
}	


//On Youtube page & video playing without timestamp
function tabUpdated(tabId, changeInfo, tabInfo){

	//Check if a video is being watched
	if (changeInfo.url && checkUrl(changeInfo.url) )
	{
		Console.log(`Tab update detected - ${changeInfo.url}`);
		
		//Update current TabId for hotkeys for use a fallback
		currentTabId = tabId;
		
		//Send update requests - ToDo > Should only send if popup is active otherwise no receiving end to connection
		browser.runtime.sendMessage({command: "update headings", id: tabId, newtitle: changeInfo.title});		
	}
}

//Listen for tab updates using above func 
browser.tabs.onUpdated.addListener(tabUpdated);

//Listen for requests from key listener
browser.runtime.onMessage.addListener(keyMessageListener);

function sendCommand(cmd)
{
	// Load stored browser data 
	browser.storage.local.get().then(data =>
	{		
		// Set time and volume values 
		volumeVal = (data.vslider == undefined) ? volumeVal : data.vslider;
		timeVal = (data.tslider == undefined) ? timeVal : data.tslider;
		
		// If no current tab is stored yet, attempt to use last changed YT Tab if possible
		if (data.currentT == undefined)
		{
			sendTabMessage(cmd);
			console.log("No stored tab - trying local");
		}
		// If there is a tab stored in the browser storage 
		else
		{
			// Attempt to request it 
			var tabReq = browser.tabs.get(data.currentT);
			tabReq.then(
			(validTab) => { // Success - is it still a valid tab, check if it's a YT Tab and update currentTabId 
				currentTabId = (checkUrl(validTab.url)) ? validTab.id : currentTabId;
				sendTabMessage(cmd); // Send messsage 
				console.log("Stored tab present - valid");
			}, 
			(noTab) =>  // Invalid, tab no longer available 
			{
				sendTabMessage(cmd); // Attempt to use last currentTab 
				console.log("stored tab present - invalid");
			});
		}	
	});	
}

function sendTabMessage(cmd)
{
	if (currentTabId != -1)
	{
		browser.tabs.sendMessage(currentTabId, {command: cmd, parameter: timeVal}); 
		console.log("local current valid");
	}
	else
	{
		console.log("local current invalid - not sending message");		
	}
}


// Listen for message from hotkey listener 
// and route to correct tab 
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