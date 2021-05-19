
document.write('<script src="kenTizen.js"></script>');
document.write('<script src="player.js"></script>');

var browser = navigator.appName;
var menuindex=-1;
var rowNum = 10;
//建立物件focux tabIndex陣列
var buttonbarTabIndexArray = [
						[-1,-1],//contentTitlebar
						[1,2,3],//playaction
						[-1],//linebar
						[11],//progress-bar
						[21,22,23,24,25]//playaction2
					 ];
//建立目前focus 行位物件
var rowArray = [];					 

var Main = {};
//var AVPlayer = window.AVPlayer;
var tvKey = window.tvKey;
var tizen = window.tizen;
//called when application was loaded
Main.onLoad = function () {
	console.log("Main.onLoad()");
	
	//enabling media keys
	Main.enableMediaKeys();
	
	// setup handler to key events
	Main.handleKeyDownEvents();
	
	// setup video player
	player();
	
}

// called when application has closed
Main.onUnload = function () {
	console.log("Main.onUnload()");
}

// enabling media keys
Main.enableMediaKeys = function () {	
	console.log("Main.enableMediaKeys()");
	
//	tizen.tvinputdevice.registerKey("MediaPlayPause");
//	tizen.tvinputdevice.registerKey("MediaPlay");
//	tizen.tvinputdevice.registerKey("MediaStop");
//	tizen.tvinputdevice.registerKey("MediaPause");
//	tizen.tvinputdevice.registerKey("MediaRewind");
//	tizen.tvinputdevice.registerKey("MediaFastForward");	
}

// handle all keydown events triggered through remote control.
Main.handleKeyDownEvents = function () {

	
	// add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	var focusedElement = document.activeElement //[注意]activeElement该属性IE浏览器不支持
    	var tabIndex = focusedElement.tabIndex;//獲得目前focus物件的index
    	showBtnfunction(); //顯示操作欄buttonbar
    	if(tabIndex==-1){
    		tabIndex=1;
    	}
    	if(menuindex==-1){
    		menuindex = tabIndex;
    	}
    	rowArray[whereRow(tabIndex)]=tabIndex;//儲存目前focus位置
    	console.log("目前focus 物件Id :"+menuindex); 
    	 var tabbables = document.getElementById("buttonbar");
    	 
    	switch(e.keyCode){
    	case tvKey.LEFT: //LEFT arrow
        	console.log("LEFT");
        	//左(會導致輸入時無法使用左右移)
            var col = parseInt(tabIndex/rowNum);//除法取整數 //目前focus的行數
            var finalCol= col;
            for(var i=0;i<finalCol;i++){//判斷有多少物件是不被列入計算的
               var obj = tabbables.children[i].children[0];//如果第一個物件為不能focus (tabIndex===-1) ;判斷該行不需要計算
               if(obj.tabIndex===-1){
               	col++;
               }
            }
            var maxIndex = tabbables.children[col].childElementCount;//目前focus的行數有多少物件
         	 var minIndex = tabbables.children[col].children[0].tabIndex;//最左邊物件的tabIndex
         	 for(var i=0;i<maxIndex;i++){
               	 minIndex = tabbables.children[col].children[i].tabIndex;
               	 if(colMaxIndex!==-1){
               	 	break;
               	 }
               }
            tabIndex--;
            if(tabIndex<minIndex){
           	tabIndex=minIndex;
            }
           focusObject(tabIndex);
           
    		break;
    	case tvKey.UP: //UP arrow
    		console.log("UP");
    		focusUp(tabIndex);
    		break;
    	case tvKey.RIGHT: //RIGHT arrow
    		console.log("RIGHT");
    		//右(會導致輸入時無法使用左右移)
            var col = whereRow(tabIndex);
            var maxIndex = tabbables.children[col].childElementCount;//目前focus的行數有多少物件
            //最右邊物件的tabIndex
            var colMaxIndex=tabbables.children[col].children[maxIndex-1].tabIndex;
            for(var i=maxIndex-1;i>=0;i--){
            	 colMaxIndex = tabbables.children[col].children[i].tabIndex;
            	 if(colMaxIndex!==-1){
            	 	break;
            	 }
            }
            tabIndex++;
	        if(tabIndex>=colMaxIndex){
	        	if(colMaxIndex!==-1)
			       	tabIndex = colMaxIndex;
	        }
       		focusObject(tabIndex);
    		break;
    	case tvKey.DOWN: //DOWN arrow
    		console.log("DOWN");
    		 focusDown(tabIndex);
    		break;
    	case tvKey.ENTER: //OK button
    		console.log("OK");
    		focusedElement.onclick();
    		break;
    	case tvKey.RETURN: //RETURN button
    		console.log("RETURN");
    		tizen.application.getCurrentApplication().exit();
    		break;
    	case tvKey.PLAYPAUSE: // PLAYPAUSE button
    		console.log("PLAYPAUSE");
    				
    		break;
    	case tvKey.PLAY: // PLAY button
    		console.log("PLAY");
    		
    		break;
    	case tvKey.PAUSE: // PAUSE button
    		console.log("PAUSE");
    		
    		break;
    	default:
    		console.log("Key code : " + e.keyCode);
    		break;
    	}
    });
}

/**
 * 應該使用hashMap 作儲存比對 會比較快！
 * Java和JavaScript內的HashMap用法
 * Ref: http://kimdicks.blogspot.com/2016/08/javajavascripthashmap.html
 * 
 *
 * @param {} tabIndex
 * @return {Boolean}
 */
function focusUp(tabIndex){
	if (tabIndex >= 0) {
	 	var rowLen = buttonbarTabIndexArray.length;
	 	for(var i=0;i<rowLen;i++){
	 		var array = buttonbarTabIndexArray[i];
	 		var colLen = array.length;
	 		for(var j=0;j<colLen;j++){
	 			console.log("i:"+i+" j:"+j);
	 			var obj= array[j];
	 			if(obj==tabIndex){
	 				var nextFocus;
			 		var tabbables = document.getElementById("buttonbar");
			 		if(i>0){
			 			var row=i-1;
				 		var childTab = rowArray[row];
				 		if(childTab==-1){
					 		while(childTab==-1){
					 			row=row-1;
					 			if(row<0){
					 				return true;
					 			}else{
					 				childTab = rowArray[row];
					 			}
					 		}
				 		}
				 		rowArray[row] = focusObject(childTab);
				        return true;
			 		}
	 			}
	 		}
	 	}
       return ;
	}
}

function whereRow(tabIndex){
	if (tabIndex >= 0) {
	 	var rowLen = buttonbarTabIndexArray.length;
	 	for(var i=0;i<rowLen;i++){
	 		var array = buttonbarTabIndexArray[i];
	 		var colLen = array.length;
	 		for(var j=0;j<colLen;j++){
	 			console.log("i:"+i+" j:"+j);
	 			var obj= array[j];
	 			if(obj==tabIndex){
	 				return i;
	 			}
	 		}
	 	}
	}			
}
function focusDown(tabIndex){
	if (tabIndex >= 0) {
	 	var rowLen = buttonbarTabIndexArray.length;
	 	for(var i=0;i<rowLen;i++){
	 		var array = buttonbarTabIndexArray[i];
	 		var colLen = array.length;
	 		for(var j=0;j<colLen;j++){
	 			console.log("i:"+i+" j:"+j);
	 			var obj= array[j];
	 			if(obj===tabIndex){
	 				var nextFocus;
			 		var tabbables = document.getElementById("buttonbar");
			 		if(i>0){
			 			var row=i+1;
				 		var childTab = rowArray[row];
				 		
				 		if(childTab==-1){
					 		while(childTab===-1){
					 			row=row+1;
					 			if(row>rowLen){
					 				return true;
					 			}else{
					 				childTab = rowArray[row];
					 			}
				 			}
				 		}
				 		rowArray[row] = focusObject(childTab);
				 		
				        return true;
			 		}
	 			}
	 		}
	 	}
       return ;
	}
}
function focusObject(tabIndex){
	if (tabIndex >= 0) {
	 	var rowLen = buttonbarTabIndexArray.length;
	 	for(var i=0;i<rowLen;i++){
	 		var array = buttonbarTabIndexArray[i];
	 		var colLen = array.length;
	 		for(var j=0;j<colLen;j++){
	 			console.log("i:"+i+" j:"+j);
	 			var obj= array[j];
	 			if(obj===tabIndex){
	 				var nextFocus;
			 		var tabbables = document.getElementById("buttonbar");
			 		var childTab = tabbables.children[i];
			 		nextFocus = childTab.children[j];
			 		nextFocus.focus(); //if it's the one we want, focus it and exit the loop
			        menuindex = obj;
			        return obj;
	 			}
	 		}
	 	}
       return ;
	}
}

// binding some events
window.onload = Main.onLoad;
window.onunload = Main.onUnload;



function HideBtnfunction(){
	//if(document.getElementById("buttonbar").style.display !== "none")
	//	document.getElementById("buttonbar").style.display ="none";
}

function showBtnfunction(){
	clearTimeout(HideTime);//停止HideTime 倒數計時
	//判斷按鈕欄是否顯示
	if(document.getElementById("buttonbar").style.display === "none"){
		document.getElementById("buttonbar").style.display ="block";
		document.getElementById("playBtn").focus();
	}
	HideTime = window.setTimeout(HideBtnfunction,5000);//開始HideTime 倒數計時
}


