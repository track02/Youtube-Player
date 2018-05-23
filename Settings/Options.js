console.log("Loaded!");

var inputs = document.getElementsByClassName("KeyInput");

console.log(inputs);

for (var i = 0, len = inputs.length; i < len; i++) {
  inputs[i].addEventListener('keypress', (event) => {
	  
	  event.target.value = "";
	  event.target.value = event.code;
	  
  });  
}

function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    mod1: document.getElementById("mod1").value,
	mod2: document.getElementById("mod2").value,
	mod3: document.getElementById("mod3").value,	
	playkey: document.getElementById("playkey").value,
	fwdkey: document.getElementById("fwdkey").value,
	backkey: document.getElementById("backkey").value,
	nextkey: document.getElementById("nextkey").value,
	replaykey: document.getElementById("replaykey").value,
	enabled: document.getElementById("enabled").checked
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    	document.getElementById("mod1").value = result.mod1 || "ShiftLeft";
	document.getElementById("mod2").value = result.mod2 || "None";
	document.getElementById("mod3").value = result.mod3 || "None";	
	document.getElementById("playkey").value = result.playkey || "Enter";
	document.getElementById("fwdkey").value = result.fwdkey || "Equal";
	document.getElementById("backkey").value = result.backkey || "Minus";
	document.getElementById("nextkey").value = result.nextkey || "Period";
	document.getElementById("replaykey").value = result.replaykey || "Comma";
	document.getElementById("enabled").checked = result.enabled || false;	
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get();
  getting.then(setCurrentChoice, onError);
}

restoreOptions();
document.getElementById("keyform").addEventListener("submit", saveOptions)