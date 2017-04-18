function enableHandler(event){
	console.log("Clicked Enable");
	mins = document.getElementById("min");
	console.log(mins.value);
	secs = document.getElementById("sec");
	console.log(secs.value);
	
	//Write to storage - Active_State = True
		
}


function disableHandler(event){
	
	console.log("Clicked Disable");
	
	//Write to storage - Active_State = False
	
}

enable_button = document.getElementById("Enable");
enable_button.onclick = enableHandler;

disable_button = document.getElementById("Enable");
disable_button.onclick = disableHandler;
