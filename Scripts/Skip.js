(function(){
	function enableHandler(event){
		
		console.log("Clicked Enable");
		mins = document.getElementById("min");
		console.log(mins.value);
		secs = document.getElementById("sec");
		console.log(secs.value);
				
		//Write to storage - Active_State = True
		browser.storage.local.set({activeState: true, minutes: mins.value, seconds: secs.value});
		
		//Toggle button visibilty
		toggleButtons();			
	}

	function disableHandler(event){
		
		console.log("Clicked Disable");
		
		//Write to storage - Active_State = False
		browser.storage.local.set({data: {activeState: false}});
		
		//Toggle button visibility
		toggleButtons();		
	}

	function toggleButtons()
	{
		disable = document.getElementById("Disable");
		enable = document.getElementById("Enable");
		enable.classList.toggle("Hidden");
		disable.classList.toggle("Hidden");
	}

	enable_button = document.getElementById("Enable");
	enable_button.onclick = enableHandler;
	disable_button = document.getElementById("Disable");
	disable_button.onclick = disableHandler;
	
	
	

	console.log("Loaded!");	
})();