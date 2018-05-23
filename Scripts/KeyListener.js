// Default values for hotkey commands 
var playPauseKey = "Enter"; 
var playNextKey = "Period";
var playResetKey = "Comma";
var timeFwdKey = "Equal";
var timeBckKey = "Minus";
var mod1 = "ShiftLeft";
var mod2 = "None";
var mod3 = "None";
var enabled = false;

var keyMap = new Map();
keyMap.set("None", true);

document.addEventListener('keypress', (event) => {	
  interpretCommand(event);  
});

document.addEventListener('keydown', (event) => {	
	keyMap.set(event.code, true);
});

document.addEventListener('keyup', (event) => {	
	keyMap.set(event.code, false);
});

function sendMessage(cmd){	
	browser.runtime.sendMessage({"hotKeyCommand": cmd}) // Alerts extension to hotkey press (Browser Monitor)	
}

function interpretCommand(event)
{	
	var getting = browser.storage.local.get();
	getting.then((result) => 
	{

		console.log(result);
		
		playPauseKey = result.playkey || playPauseKey;
		playNextKey = result.nextkey || playNextKey;
		playResetKey = result.replaykey || playResetKey;
		timeFwdKey = result.fwdkey || timeFwdKey;
		timeBckKey = result.backkey || timeBckKey;
		
		mod1 = result.mod1 || mod1;
		mod2 = result.mod2 || mod2;
		mod3 = result.mod3 || mod3;

		enabled = result.enabled || false;
		
		readKeyEvent(event);		
	});
}

function readKeyEvent(event)
{		
	const keyCode = event.code;
	
	if (keyMap.get(mod1) && keyMap.get(mod2) && keyMap.get(mod3) && enabled) {	  
	
		if (keyCode == playPauseKey) 
			sendMessage("play-pause-hotkey");		
		if (keyCode == playNextKey)
			sendMessage("play-next-hotkey");		
		if (keyCode == playResetKey)
			sendMessage("replay-hotkey");		
		if (keyCode == timeFwdKey)
			sendMessage("skip-fwd-hotkey");		
		if (keyCode == timeBckKey)
			sendMessage("skip-back-hotkey");
		
	}
}