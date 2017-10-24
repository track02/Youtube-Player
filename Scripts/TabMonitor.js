//On Youtube page & video playing without timestamp

function tabUpdated(tabId, changeInfo, tabInfo){
	
	function checkUrl(){
		return ((changeInfo.url.indexOf("youtube") !== -1) && (changeInfo.url.indexOf("watch?") !== -1))
	}

	
	
	//Check if a video is being watched
	if (changeInfo.url && checkUrl() )
	{

		//Send update requests
		browser.runtime.sendMessage({
			command: "update headings", parameter: tabId, videoTitle: changeInfo.title
			});	
			
		
		
	}
}
	
browser.tabs.onUpdated.addListener(tabUpdated);


