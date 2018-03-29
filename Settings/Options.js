
console.log("Loaded!");

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
	replaykey: document.getElementById("replaykey").value	
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.getElementById("mod1").value = result.mod1 || "ctrl";
	document.getElementById("mod2").value = result.mod2 || "alt";
	document.getElementById("mod3").value = result.mod3 || "none";
	
	document.getElementById("playkey").value = result.playkey || " ";
	document.getElementById("fwdkey").value = result.fwdkey || "f";
	document.getElementById("backkey").value = result.backkey || "b";
	document.getElementById("nextkey").value = result.nextkey || "n";
	document.getElementById("replaykey").value = result.replaykey || "r";	
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get();
  getting.then(setCurrentChoice, onError);
}

restoreOptions();
document.getElementById("keyform").addEventListener("submit", saveOptions)