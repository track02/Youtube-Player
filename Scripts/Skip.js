(function(){
	
		mins = document.getElementById("min");
		secs = document.getElementById("sec");
		disable = document.getElementById("Disable");
		enable = document.getElementById("Enable");

	function enableHandler(event){
		mins = document.getElementById("min");
		secs = document.getElementById("sec");

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
		browser.storage.local.set({data: {activeState: false}});
		
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
	
	mins.oninput = onInputHandler;
	secs.oninput = onInputHandler;
	enable.onclick = enableHandler;
	disable.onclick = disableHandler;
	
	
	function isEmpty(obj){
		return (Object.getOwnPropertyNames(obj).length === 0);
}



	browser.storage.local.get().then(
	
function(data){
	console.log(data.length);
	
	
	activeState = (data.activeState);
	if(activeState == true){
		toggleButtons();
	}
	mins.value = data.minutes;
	secs.value = data.seconds;

	if(isEmpty(data)){
		mins.value = 0;
		secs.value = 0;
		
		
		browser.storage.local.set({activeState: false, minutes: mins.value, seconds: secs.value});
		console.log("This should trigger when the data is empty");
	}
	
	
	
	
	});

	
	console.log("Loaded!");	
})();