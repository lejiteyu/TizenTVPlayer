
/*********************************************** Player *************************************************/
document.write('<script src="main.js"></script>');
var player ;
var HideTime;
//開啟網頁執行 類似 main()
function player(){
	console.log("player() init()");
   var url = "http://act1.video.friday.tw/horigin/apptest/manifest.mpd";//"https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd";//http://act1.video.friday.tw/horigin/apptest/manifest.mpd
   player = dashjs.MediaPlayer().create();
   player.initialize(document.querySelector("#videoPlayer"), url, true);
   HideTime = window.setTimeout(HideBtnfunction,5000);
   var rowLen = buttonbarTabIndexArray.length;
	for(var i=0;i<rowLen;i++){
		var obj = buttonbarTabIndexArray[i];
		var v= obj[0];
		rowArray.push(v);
		console.log("rowArray obj:"+v);
		
	}
	for(var r in rowArray){
		console.log("rowArray:"+rowArray[r]);
	}
};

function play(){
	console.log("play btn onclick");
	if(player.isReady()){
   	if(player.isPaused()){
   		console.log("video play");
   		player.play();
   		document.getElementById("img_play").src="img/player/icon_pause.svg";
   	}
   	else{
   		console.log("video pause");
   		player.pause();
   		document.getElementById("img_play").src="img/player/icon_play.svg";
   	}
   }
}