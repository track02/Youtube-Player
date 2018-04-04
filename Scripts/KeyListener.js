// Default values for hotkey commands 
var playPauseKey = "Space"; //Space
var playNextKey = "KeyN";
var playResetKey = "KeyR";
var timeFwdKey = "KeyF";
var timeBckKey = "KeyB";
var mod1 = "ControlLeft";
var mod2 = "AltLeft";
var mod3 = "None";

var keyMap = new Map();
keyMap.set("None", true);

document.addEventListener('keypress', (event) => {	
  interpretCommand(event);  
});

document.addEventListener('keydown', (event) => {	
	keyMap.set(event.code, true);
	console.log(keyMap);	
});

document.addEventListener('keyup', (event) => {	
	keyMap.set(event.code, false);
	console.log(keyMap);	
});

function sendMessage(cmd){	
	browser.runtime.sendMessage({"hotKeyCommand": cmd}) // Alerts extension to hotkey press (Browser Monitor)	
}

function interpretCommand(event)
{	
	var getting = browser.storage.local.get();
	getting.then((result) => 
	{
		playPauseKey = result.playkey || playPauseKey;
		playNextKey = result.nextkey || playNextKey;
		playResetKey = result.replaykey || playResetKey;
		timeFwdKey = result.fwdkey || timeFwdKey;
		timeBckKey = result.backkey || timeBckKey;
		
		mod1 = result.mod1 || mod1;
		mod2 = result.mod2 || mod2;
		mod3 = result.mod3 || mod3;		
		
		console.log(playPauseKey);
		console.log(playNextKey);
		console.log(playResetKey);
		console.log(timeFwdKey);
		console.log(timeBckKey);
		console.log(mod1);
		console.log(mod2);
		console.log(mod3);
		
		readKeyEvent(event);		
	});
	

}

function readKeyEvent(event)
{		
	const keyCode = event.code;
	
	console.log(`Key press detected - ${keyCode}`);
	console.log(keyMap.get(mod1));
	console.log(keyMap.get(mod2));
	console.log(keyMap.get(mod3));

	
	if (keyMap.get(mod1) && keyMap.get(mod2) && keyMap.get(mod3)) {	  

		console.log("Modifiers Pressed");
	
		if (keyCode == playPauseKey) {
			console.log("Play hk");
			sendMessage("play-pause-hotkey");
		}
		if (keyCode == playNextKey){
			console.log("Next hk");
			sendMessage("play-next-hotkey");
		}
		if (keyCode == playResetKey){
			console.log("Replay hk");
			sendMessage("replay-hotkey");
		}
		if (keyCode == timeFwdKey){
			console.log("fwd hk");
			sendMessage("skip-fwd-hotkey");
		}
		if (keyCode == timeBckKey){
			console.log("back hk");
			sendMessage("skip-back-hotkey");
		}  
	}
}