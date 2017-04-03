console.log("Called!");

function enableHandler(event){
	console.log("Clicked");
	mins = document.getElementById("min");
	console.log(mins.value);
	secs = document.getElementById("sec");
	console.log(secs.value);
}

enable_button = document.getElementById("Enable");
enable_button.onclick = enableHandler;
