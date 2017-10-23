//On Youtube page & video playing without timestamp
function checkUrl(url){
	return ((url.indexOf("youtube") !== -1) && (url.indexOf("watch?") !== -1))
}

function tabUpdated(tabId, changeInfo, tabInfo){
			
	//Check if a video is being watched
	if (changeInfo.url && (checkUrl(changeInfo.url)) && changeInfo.status == "complete")
	{

		//Send update requests
		browser.runtime.sendMessage({
			command: "update headings"
			});	
		
		browser.runtime.sendMessage({
			command: "change volume"
			});	
		
		browser.runtime.sendMessage({
			command: "update play/pause"
			});	
	}
}
	
//browser.tabs.onUpdated.addListener(tabUpdated);


