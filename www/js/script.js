// JavaScript Document

//GLOBALS
var canvasProperties={},
	allNotes=[],
	documentPages=[];
	canvasStorage=[];


//END GLOBALS

//////////////////////////////////
//TOOLBAR SETUP
function toolbarSetup(){
	//PENCIL
	var pencil=$("#pencil");
	pencil.off("touch click");
	pencil.on("touch click",function(){
		canvasProperties.currentUtensil="pencil";
		canvasProperties.width=1;
		$('.s-wrapper-active').removeClass('s-wrapper-active');
		$("#stroke-1").parent().addClass('s-wrapper-active');
		$(".selectedTool").removeClass("selectedTool");
		pencil.addClass("selectedTool");
		canvasProperties.canvas.off("touchstart touchmove touchend touchleave")
		canvasSetup();
		pencil.off("touch click");
		pencil.on("touch click",function(){
			canvasProperties.canvas.off("touchstart touchmove touchend touchleave");
			pencil.removeClass("selectedTool");
			toolbarSetup();
		});
	});
	
	//MARKER
	var marker=$("#marker");
	marker.off("touch click");
	marker.on("touch click",function(){
		canvasProperties.currentUtensil="marker";
		canvasProperties.width=5;
		$('.s-wrapper-active').removeClass('s-wrapper-active');
		$("#stroke-5").parent().addClass('s-wrapper-active');
		$(".selectedTool").removeClass("selectedTool");
		marker.addClass("selectedTool");
		canvasProperties.canvas.off("touchstart touchmove touchend touchleave")
		canvasSetup();
		marker.off("touch click");
		marker.on("touch click",function(){
			canvasProperties.canvas.off("touchstart touchmove touchend touchleave");
			marker.removeClass("selectedTool");
			toolbarSetup();
		});
	});
	
	//ERASER
	var eraser=$('#eraser');
	eraser.off("touch click");
	eraser.on("touch click",function(){
		canvasProperties.currentUtensil="eraser";
		$(".selectedTool").removeClass("selectedTool");
		eraser.addClass("selectedTool");
		canvasProperties.canvas.off("touchstart touchmove touchend touchleave")
		canvasSetup();
		eraser.off("touch click");
		eraser.on("touch click",function(){
			canvasProperties.canvas.off("touchstart touchmove touchend touchleave");
			eraser.removeClass("selectedTool");
			toolbarSetup();
		});
	});
	
	//TRASH
	var trash=$('#trash');
	trash.off("touch click");
	trash.on("touch click",function(){
		if(confirm("Warning: The page will be cleared of all markings. Proceed?")){
			canvasProperties.canvas.off("touchstart touchmove touchend touchleave")
			canvasProperties.clickX=[];
			canvasProperties.clickY=[];
			canvasProperties.clickDrag=[];
			canvasProperties.clickUtensil=[];
			canvasProperties.lineColor=[];
			allNotes=[];
			$("[class^='note-']").remove();
			canvasSetup();
		}
		canvasProperties.canvas.off("touchstart touchmove touchend touchleave");
		$(".selectedTool").removeClass("selectedTool");
	});
	
	//NOTE
	var note=$('#sticky');
	note.off("click");
	note.click(function(){
		canvasProperties.canvas.off("touchstart touchmove touchend touchleave");
		$(".selectedTool").removeClass("selectedTool");
		note.addClass("selectedTool");
		addNote();
		note.click(function(){
			canvasProperties.canvas.off("touchstart touchmove touchend touchleave");
			$(".selectedTool").removeClass("selectedTool");
			toolbarSetup();
		})
	})
	
	//STROKE WEIGHT
	var weight=$("#weight");
	weight.off("click");
	weight.click(function(){
		$("#s-select").show();
		weight.off("click");
		weight.click(function(){
			$("#s-select").hide();
			toolbarSetup();
		})
	});
	
	var strokeWeights=$("div[id^='stroke-']");
	strokeWeights.click(function(e){
		e.stopPropagation();
		$('.s-wrapper-active').removeClass('s-wrapper-active');
		$(this).parent().addClass('s-wrapper-active');
		canvasProperties.width=$(this).attr("data-stroke-weight");
	});
	
	//VISIBILITY
	var visibility=$("#visibility");
	visibility.off('click');
	visibility.click(function(){
		$("[class^='note']").hide();
		$("#canvas").hide();
		visibility.css({"background-image":"url(img/button_toolbar_hidden.png)"});
		visibility.off('click');
		visibility.click(function(){
			$("[class^='note']").show();
			$("#canvas").show();
			visibility.css({"background-image":"url(img/button_toolbar_show.png)"});
			toolbarSetup();
		});
	});
}

function addNote(){
	canvasProperties.canvas.on("touchstart",function(e){
		canvasProperties.canvas.unbind("touchstart touchmove touchend touchleave");
		$(".selectedTool").removeClass("selectedTool");
		var x=e.touches[0].clientX-16;
		var y=e.touches[0].clientY-16;
		allNotes.push('<div class="note-'+(allNotes.length+1)+'"><div class="noteBox-'+(allNotes.length+1)+'"><textarea class="noteInput-'+(allNotes.length+1)+'"></textarea><p class="theText-'+(allNotes.length+1)+'"></p></div></div>');
		$("#canvas-wrapper").append(allNotes[allNotes.length-1]);
		var currNote=".note-"+(allNotes.length);
		var noteText=".noteBox-"+(allNotes.length);
		$(currNote).on("touchstart",function(e){
			if(e.target !== e.currentTarget) return;
			$(noteText).css("display")=="none"?$(noteText).css({"display":"block"}):$(noteText).css({"display":"none"});
		});
		$(".note-"+(allNotes.length)).offset({top:y,left:x});
 		var currTextBox=$(".theText-"+(allNotes.length));
		var currTextArea=$(".noteInput-"+(allNotes.length));
		var noteBoxHeight=$(noteText).height();
		var topOffset=(noteBoxHeight*-1)-32;
		$(noteText).css({"top":topOffset});
		var noteOffset=$(noteText).offset().top;
		if(noteOffset<0){
			topOffset=topOffset-noteOffset;
			$(currNote).css({"top":noteBoxHeight+10})
		}
	$(noteText).css({"top":topOffset});
		currTextArea.blur(function(){
			updateNoteText(currTextBox,currTextArea,noteText,currNote);
		});
		currTextArea.keydown(function(e){
			if ( e.which == 13 ) {
				 currTextArea.blur()
			}		
		});
	});
}
function updateNoteText(currTextBox,currTextArea,noteText,currNote){
	var text=currTextArea.val();
	currTextArea.css({"display":"none"});
	currTextBox.html(text);
	currTextBox.css({"display":"block"});
	currTextBox.click(function(){
		currTextArea.css({"display":"block"});
		currTextArea.focus();
		currTextBox.css({"display":"none"});
	});
	if(text===""){
		currTextBox.click();
	}
	var noteBoxHeight=$(noteText).height();
	var topOffset=(noteBoxHeight*-1)-32;
	$(noteText).css({"top":topOffset});
	var noteOffset=$(noteText).offset().top;
	if(noteOffset<0){
		topOffset=topOffset-noteOffset;
	}
	$(noteText).css({"top":topOffset});
}
function openButton(){
	var ocButton=$("#open-close-button");
	var arrow=$("#open-close-button i");
	ocButton.off("click");
	ocButton.click(function(){
		$("#toolbar").animate({"left":0});
		arrow.removeClass("fa-arrow-right");
		arrow.addClass("fa-arrow-left");
		closeButton();
	});
}
function closeButton(){
	var ocButton=$("#open-close-button");
	var arrow=$("#open-close-button i");
	ocButton.off("click");
	ocButton.click(function(){
		$("#toolbar").animate({"left":-248});
		arrow.removeClass("fa-arrow-left");
		arrow.addClass("fa-arrow-right");
		ocButton.off("click");
		$("#s-select").hide();
		openButton();
	});
}


//END TOOLBAR SETUP
/////////////////////////////////
//CANVAS SETUP
function canvasSetup(){
	var canvas=canvasProperties.canvas;
	canvas.on("touchstart",function(e){
		disableScroll();
		addClick((e.touches[0].clientX-90),e.touches[0].clientY,false,canvasProperties.currentUtensil);
		canvasDraw();
	});
	canvas.on("touchmove",function(e){
		addClick((e.touches[0].clientX-90),e.touches[0].clientY,true,canvasProperties.currentUtensil);
		canvasDraw();
	});
	canvas.on("touchend",function(e){
		canvasProperties.paint=false;
		enableScroll();
	});
	canvas.on("touchleave",function(e){
		canvasProperties.paint=false;
		enableScroll();
	});
	canvasDraw();
}
function addClick(x,y,dragging,utensil){
	canvasProperties.clickX.push(x);
	canvasProperties.clickY.push(y);
	canvasProperties.clickDrag.push(dragging);
	canvasProperties.lineColor.push(canvasProperties.color);
	canvasProperties.lineWidth.push(canvasProperties.width);
	canvasProperties.clickUtensil.push(utensil);
}
function canvasDraw(){
	var canvas=canvasProperties.canvas;
	var context=canvasProperties.ctx;
	var clickX=canvasProperties.clickX;
	var clickY=canvasProperties.clickY;
	var clickDrag=canvasProperties.clickDrag;
	var clickUtensil=canvasProperties.clickUtensil;
	var lineColor=canvasProperties.lineColor;
	var lineWidth=canvasProperties.lineWidth;
	
	//clear canvas
	context.clearRect(0,0,canvas.width(),canvas.height());
	
	//Lines
	var eraserIndex=[];
	var lineIndex=[];
	var pointsToRemove=[];
	for(var i=0;i<clickX.length;i++){
		canvasProperties.ctx.beginPath();
////////////////////////////////
		if(clickUtensil[i]==="eraser"){
			eraserIndex.push(i);
		}
		else if(clickUtensil[i]==="pencil"||clickUtensil[i]==="marker"){
			lineIndex.push(i);
		}
		for(var q=0;q<eraserIndex.length;q++){
			for(var k=0;k<lineIndex.length;k++){
				if(Math.abs(clickX[eraserIndex[q]]-clickX[lineIndex[k]])<=7.5&&Math.abs(clickY[eraserIndex[q]]-clickY[lineIndex[k]])<=7.5){
					pointsToRemove.push(lineIndex[k]);
					clickDrag[lineIndex[k]+1]=false;
					//clickDrag[lineIndex[k]-1]=false;
				}
			}
			pointsToRemove.push(eraserIndex[q]);
		}
		for(var g=0;g<pointsToRemove.length;g++){
			clickX.splice(pointsToRemove[g],1)
			clickY.splice(pointsToRemove[g],1)
			clickDrag.splice(pointsToRemove[g],1)
			clickUtensil.splice(pointsToRemove[g],1)
			lineColor.splice(pointsToRemove[g],1)
			lineWidth.splice(pointsToRemove[g],1)
		}
		if(clickDrag[i]&&Math.abs(clickX[i-1]-clickX[i])<=50&&Math.abs(clickY[i-1]-clickY[i])<=50){
			context.moveTo(clickX[i-1],clickY[i-1]);
		}else{
			context.moveTo(clickX[i]-1,clickY[i]);
		}
		if(clickUtensil[i]==="marker"){
			var strokeColor=lineColor[i];
			strokeColor=[strokeColor.slice(0,3),"a",strokeColor.slice(3,strokeColor.length-1),",0.4)"].join("");
			context.strokeStyle=strokeColor;
			context.lineJoin="miter";
			context.lineWidth=lineWidth[i];
			context.lineTo(canvasProperties.clickX[i],canvasProperties.clickY[i]);
			context.stroke();
			context.closePath();
		}
		if(clickUtensil[i]==="pencil"){
			context.strokeStyle=lineColor[i];
			context.lineJoin="miter";
			context.lineWidth=lineWidth[i];
			context.lineTo(canvasProperties.clickX[i],canvasProperties.clickY[i]);
			context.stroke();
			context.closePath();
		}
///////////////////////////////
	}
	/*
	for(var i=0;i<clickX.length;i++){
		canvasProperties.ctx.beginPath();
		
		
		if(clickDrag[i]&&Math.abs(clickX[i-1]-clickX[i])<=50&&Math.abs(clickY[i-1]-clickY[i])<=50){
			context.moveTo(clickX[i-1],clickY[i-1]);
		}else{
			context.moveTo(clickX[i]-1,clickY[i]);
		}
			context.strokeStyle=canvasProperties.lineColor[i];
			context.lineJoin="miter";
			context.lineWidth=1;
			context.lineTo(canvasProperties.clickX[i],canvasProperties.clickY[i]);
			context.stroke();
			context.closePath();
	}
	*/

}
/*
function getCurrentPage(){
	var theImages={
		bgCurrent:new Image(),
		textCurrent:new Image()	
	};
	theImages.bgCurrent.src="img/spread/bg_spread1.jpg"
	theImages.textCurrent.src="img/spread/spread1.png"
	return theImages;
}
*/

//Prevent Scrolling (Can probably remove at end once document is correct size)
function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
}
//PS()

//END CANVAS SETUP

function nextPage(){
	$('#bc-next-page').on("click",function(){
		var nextPage=getCurrentSpread()+1;
		storeCanvas();
		arrowCheck(nextPage);
		if(nextPage<=documentPages.length){
			$('#new-page-v').css({
				"visibility":"visible",
				"background-image":"url(img/spread/bg_spread"+nextPage+".jpg)"
			});
			$('#new-page-r').css({
				"visibility":"visible",
				"background-image":"url(img/spread/bg_spread"+nextPage+".jpg)"
			});
			$('#new-page-v').animate({
				width:200,
				left:95
			},250,"swing");
			$('#new-page-r').animate({
				width:200,
				left:295
			},250,"swing",resetNextPage);
		}
	});
}
function resetNextPage(){
	var nextPage=getCurrentSpread()+1;
	$("#spread-container").css({"background-image":"url(img/spread/bg_spread"+nextPage+".jpg)"});
	$('#new-page-v').css({
		"visibility":"hidden",
		"width":10,
		"left":474
	});
	$('#new-page-r').css({
		"visibility":"hidden",
		"width":10,
		"left":484
	});
	loadCanvas();
}
function previousPage(){
	$('#bc-previous-page').on("click",function(){
		var oldPage=getCurrentSpread()-1;
		storeCanvas();
		arrowCheck(oldPage);
		if(oldPage>0){
			$('#old-page-v').css({
				"visibility":"visible",
				"background-image":"url(img/spread/bg_spread"+oldPage+".jpg)"
			});
			$('#old-page-r').css({
				"visibility":"visible",
				"background-image":"url(img/spread/bg_spread"+oldPage+".jpg)"
			});
			$('#old-page-v').animate({
				width:200,
				left:95
			},250,"swing");
			$('#old-page-r').animate({
				width:200,
				left:295
			},250,"swing",resetPreviousPage);
		}
	});
}
function resetPreviousPage(){
	var oldPage=getCurrentSpread()-1;
	$("#spread-container").css({"background-image":"url(img/spread/bg_spread"+oldPage+".jpg)"});
	$('#old-page-v').css({
		"visibility":"hidden",
		"width":10,
		"left":95
	});
	$('#old-page-r').css({
		"visibility":"hidden",
		"width":10,
		"left":105
	});
	loadCanvas();
}
function arrowCheck(currentPage){
	$('#bc-next-page').css({"color":"#000"});
	$('#bc-previous-page').css({"color":"#000"});
	if(currentPage<=1){
		$('#bc-previous-page').css({"color":"#eee"});
	}else if(currentPage>=documentPages.length){
		$('#bc-next-page').css({"color":"#eee"});
	}
}
function getCurrentSpread(){
	var spread = $("#spread-container").css('background-image');
	var cleanup = /\"|\'|\)/g;
	spread=spread.split('/').pop().replace(cleanup, '');
	spread=spread.replace("bg_spread",'');
	spread=spread.replace(".jpg",'');
	spread=parseInt(spread);
	return spread;
}
function storeCanvas(){
	var currentPage=getCurrentSpread()-1;
	canvasStorage[currentPage]=(JSON.parse(JSON.stringify(canvasProperties)));//CLONE OBJECT http://heyjavascript.com/4-creative-ways-to-clone-objects/
	canvasStorage[currentPage].canvas=$("#canvas");
	canvasStorage[currentPage].ctx=$("#canvas")[0].getContext("2d");
	
	/////Reset canvasProperties
	canvas=$("#canvas");
	ctx=$("#canvas")[0].getContext("2d");
	canvasProperties.clickX=[];
	canvasProperties.clickY=[];
	canvasProperties.clickDrag=[];
	canvasProperties.clickUtensil=[];
	canvasProperties.lineWidth=[];
	canvasProperties.lineColor=[];
	canvasDraw();
}
function loadCanvas(){
	var currentPage=getCurrentSpread()-1;
	if(canvasStorage[currentPage]!=null){
		canvasProperties=canvasStorage[currentPage];
	}
	canvasDraw();
}
/////////////////////////////////
$(document).ready(function(){
	canvasProperties={
		canvas:$("#canvas"),
		ctx:$("#canvas")[0].getContext("2d"),
		clickX:[],
		clickY:[],
		clickDrag:[],
		clickUtensil:[],
		paint:false,
		color:"rgb(0,0,0)",
		currentUtensil:"",
		width:1,
		lineWidth:[],
		lineColor:[]
	}
	for(var i=0;i<2/*<---NUMBER OF SPREADS*/;i++){
		documentPages.push(i+1);
	}
	toolbarSetup();
	openButton();
	nextPage();
	previousPage();
	arrowCheck(1);
	$("#colorPicker").spectrum({
		color:"#000",
		change:function(color){
			canvasProperties.color=$("#colorPicker").spectrum("get").toRgbString();
		}
	});
});
	
