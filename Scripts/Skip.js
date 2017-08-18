
		mins = document.getElementById("min");
		secs = document.getElementById("sec");
		disable = document.getElementById("Disable");
		enable = document.getElementById("Enable");

	function enableHandler(event){

		console.log("Clicked Enable");
		console.log(mins.value);
		console.log(secs.value);
				
		//Write to storage - Active_State = True
		browser.storage.local.set({activeState: true, minutes: mins.value, seconds: secs.value});
		
		//Toggle button visibilty
		toggleButtons();					
	}

	function disableHandler(event){
		
		console.log("Clicked Disable");
		
		//Write to storage - Active_State = False
		browser.storage.local.set({activeState: false, minutes: mins.value, seconds: secs.value});
		
		//Toggle button visibility
		toggleButtons();		
	}

	function toggleButtons()
	{
		enable.classList.toggle("Hidden");
		disable.classList.toggle("Hidden");
	}
	
	function onInputHandler(event){
		browser.storage.local.set({activeState: true, minutes: mins.value, seconds: secs.value});
	}
	
	function isEmpty(obj){
		return (Object.getOwnPropertyNames(obj).length === 0);
	}
	
	function onTabChange(tabId, changeInfo, tabInfo)
	{		
		console.log("Tab: " + tabId + " changed");
	}
	
	mins.oninput = onInputHandler;
	secs.oninput = onInputHandler;
	enable.onclick = enableHandler;
	disable.onclick = disableHandler;
	

	browser.storage.local.get().then(	
		function(data){	
	
			activeState = (data.activeState);
			
			if(activeState == true){
				toggleButtons();
			}			

			if(isEmpty(data)){
				mins.value = 0;
				secs.value = 0;				
				browser.storage.local.set({activeState: false, minutes: mins.value, seconds: secs.value});
				console.log("This should trigger when the data is empty");
			}
			else
			{
				mins.value = data.minutes;
				secs.value = data.seconds;
			}
		}
	);
	
	console.log("Loaded!");	
