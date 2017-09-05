activeState = false;
minutes = 0;
seconds = 0;

function isEmpty(obj){
	return (Object.getOwnPropertyNames(obj).length === 0);
}

function initialiseValues(data){

	storedState= (data.activeState);
	
	if(isEmpty(data)){
		browser.storage.local.set({activeState: false, minutes: 0, seconds: 0, skip: 0});
	}
	else
	{
		activeState = storedState;
		minutes = data.minutes;
		seconds = data.seconds;
	}
}

//On Youtube page & video playing without timestamp
function checkUrl(url)
{
	return ((url.indexOf("youtube") !== -1) && (url.indexOf("#t=") == -1) && (url.indexOf("watch?") !== -1))
}

function insertTimestamp(tabId, changeInfo, tabInfo){

	browser.storage.local.get().then(

		function(data){
			
			activeState = (data.activeState);
			minutes = data.minutes;
			seconds = data.seconds;			
			
			//Check if url is available first
			if (changeInfo.url && activeState && (checkUrl(changeInfo.url)) && (minutes > 0 || seconds > 0))
			{
				browser.tabs.update(tabId, {url: (changeInfo.url + "#t=" + minutes + "m" + seconds + "s")});
				browser.storage.local.set({activeState: true, minutes: minutes, seconds: seconds});
			}

			browser.runtime.sendMessage({
    			command: "update headings"
  			});
	
		}
	);
}

browser.storage.local.get().then(initialiseValues);
browser.tabs.onUpdated.addListener(insertTimestamp);

