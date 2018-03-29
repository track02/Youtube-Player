// Default values for hotkey commands 
var playPauseKey = " "; //Space
var playNextKey = "n";
var playResetKey = "r";
var timeFwdKey = "f";
var timeBckKey = "b";
var mod1 = "ctrl";
var mod2 = "alt";
var mod3 = "none";

document.addEventListener('keypress', (event) => {
	
  interpretCommand(event);  

});

function sendMessage(cmd)
{	
	browser.runtime.sendMessage({"hotKeyCommand": cmd}) // Alerts extension to hotkey press (Browser Monitor)	
}

function readModifier(mod, event)
{
	if (mod == "ctrl" && event.ctrlKey)
	{
		return true;
	}	
	if (mod == "alt" && event.altKey)
	{
		return true;
	}
	if (mod == "shift" && event.shiftKey)
	{
		return true;
	}	
	if (mod == "none")
	{
		return true;	
	}	
	return false;
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
		
		readKeyEvent(event);
		
	});
}

function readKeyEvent(event)
{
	const keyName = event.key;

	if (readModifier(mod1, event) && readModifier(mod2, event) && readModifier(mod3, event)) {	  

		console.log(`ALT + CTRL + ${keyName}`);	 

		if (keyName == playPauseKey) {
			console.log("Play hk");
			sendMessage("play-pause-hotkey");
		}
		if (keyName == playNextKey){
			console.log("Next hk");
			sendMessage("play-next-hotkey");
		}
		if (keyName == playResetKey){
			console.log("Replay hk");
			sendMessage("replay-hotkey");
		}
		if (keyName == timeFwdKey){
			console.log("fwd hk");
			sendMessage("skip-fwd-hotkey");
		}
		if (keyName == timeBckKey){
			console.log("back hk");
			sendMessage("skip-back-hotkey");
		}  
	}
}