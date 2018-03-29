// Default values for hotkey commands 
var playPauseKey = "Space"; //Space
var playNextKey = "KeyN";
var playResetKey = "KeyR";
var timeFwdKey = "KeyF";
var timeBckKey = "KeyB";
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
	const keyCode = event.code;

	
	console.log(`Key press detected - ${keyCode}`);
	console.log(`Modifer ${mod1} Pressed - ${readModifier(mod1, event)}`);
	console.log(`Modifer ${mod2} Pressed - ${readModifier(mod2, event)}`);
	console.log(`Modifer ${mod3} Pressed - ${readModifier(mod3, event)}`);

	if (readModifier(mod1, event) && readModifier(mod2, event) && readModifier(mod3, event)) {	  

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