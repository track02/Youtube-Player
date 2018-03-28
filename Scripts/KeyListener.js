// Default values for hotkey commands 
var playPauseKey = " "; //Space
var playNextKey = "h";
var playResetKey = "j";
var timeFwdKey = "k";
var timeBckKey = "l";

console.log("Loaded listener!");

document.addEventListener('keypress', (event) => {
  const keyName = event.key;

  if (event.altKey && event.ctrlKey) {	  
  
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
});

function sendMessage(cmd)
{	
	browser.runtime.sendMessage({"hotKeyCommand": cmd}) // Alerts extension to hotkey press (Browser Monitor)	
}


