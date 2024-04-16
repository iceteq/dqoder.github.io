var artPanels = document.querySelectorAll(".art-panel");
var filterButtons = document.querySelectorAll(".filter-button");

highlightAll();


// ---------------------------------------------------------------- FILTER
/*
These functions deal with filtering the content. There are two buttons
that are mutually exclusive. You can either apply the portrait filter, or
the wallpaper filter. The filtering is done based on description content,
not tags or attributes. This means the user will be able to control
what is shown, by writing the right keywords in the description, ie
portrait or wallpaper. The idea is to give the content creator some
control over what is shown when filters are applied. Ideally, the filters
would not be mutually exclusive, and you should be able to turn on and off
as many filters as you want, but that requires further development of this
code, which might be done in the future. 
*/
var visible = false;

var portRaitFiltered = false;
var portraitFilterBtn = document.getElementById("portraitFilter");
portraitFilterBtn.addEventListener("click", function () {
  if (portRaitFiltered) {

    

    // If the filter is active (wallpaper is present in the array), remove it
    strings = strings.filter(function(string) {
        return string !== "Javascript";
    });
    portRaitFiltered = false; // Update state variable
    portraitFilterBtn.style.backgroundColor = "black";
  } else {

    highlightNone();

    strings = [];
      // If the filter is not active (wallpaper is not present in the array), add it
      strings.push("Javascript");
      portRaitFiltered = true; // Update state variable
      portraitFilterBtn.style.backgroundColor = "lime";
      alert(strings);
  }

    
    hideAll();
    showOnly(strings);
  
  // Optionally, you can log the updated strings array for debugging
  
});

var wallpaperFiltered = false;
var wallpaperFilterBtn = document.getElementById("wallpaperFilter");
wallpaperFilterBtn.addEventListener("click", function () {
  if (wallpaperFiltered) {
      // If the filter is active (wallpaper is present in the array), remove it
      

      strings = strings.filter(function(string) {
          return string !== "PHP";
      });
      wallpaperFiltered = false; // Update state variable
      wallpaperFilterBtn.style.backgroundColor = "black";
  } else {

    strings = [];
    highlightNone();
      // If the filter is not active (wallpaper is not present in the array), add it
      strings.push("PHP");
      wallpaperFiltered = true; // Update state variable
      wallpaperFilterBtn.style.backgroundColor = "lime";
  }

  alert(strings);
    hideAll();
    showOnly(strings);
  
  // Optionally, you can log the updated strings array for debugging
  
});



var showAllFilter = document.getElementById("showAll");
showAllFilter.addEventListener("click", function () {
  strings = [];
  showAll();
});



var filterOn = false;
function filterElements(keyword) {
  for (var i = 0; i < artPanels.length; i++) {
    var element = artPanels[i];
    var desc = element.querySelector(".description");
    if (!desc.textContent.includes(keyword)) {
      if (!visible) {
        element.style.display = "none";
      } else {
        element.style.display = "grid";
      }
    }
  }

  turnOffTransitionsDuringFilter(visible);
  visible = !visible;
}


var strings = [];



function showOnly(strings){
  strings.forEach(function(str){

    artPanels.forEach(function(element){
  
        var desc = element.querySelector(".description");
        if (desc.textContent.includes(str)) {
          element.style.display = "grid";
        }
    });
  });
};


function hideAll(){
  showAllFilter.style.backgroundColor = "black";
  artPanels.forEach(function(element){
      element.style.display = "none"; 
});
};

function showAll(){

  wallpaperFiltered = false;
  
  portRaitFiltered = false;

  artPanels.forEach(function(element){
      element.style.display = "grid"; 
  });


  highlightAll();

  alert(strings);

};

function highlightAll(){
    filterButtons.forEach(function(btn){
      btn.style.backgroundColor = "lime";
    });

    
}


function highlightNone(){
  filterButtons.forEach(function(btn){
    btn.style.backgroundColor = "black";
  });
}


/*
The need for this functionality is NOT ideal. Initially, setUpTransitions() was supposed to be called when a filter was applied. 
Unfortunately, this didn't work properly. Instead, removing the transitions will have to do for now. 
*/
function turnOffTransitionsDuringFilter(filterOn) {
  if (!filterOn) removeTransitions();
  else setUpTransitions();
}

// ---------------------------------------------------------------- TRANSITIONS
/*
These functions are responsible for setting up transition origins, which
depend on the amount of images and the current window size. 

For example
a large window size means image number 1, and number 4 are located in
the left and right corner respectively. 

This means that when I scale them up,
I need them not to go outside of the window. 

Image 1 should scale from the upper left corner,
while image 4 should scale from the upper right corner. 

There are two functions
which are very similar that get the job done. 

updateTransitions is meant to be used for when window resizes,
it has some checks in order not to call the function needlessly. 

setUpTransitions,
as the name implies, doesn't run constantly and therefore it doesn't need the same kinds of checks.
*/
$(document).ready(setUpTransitions);
$(window).resize(updateTransitions);

function setUpTransitions() {
  var w = $(window).width();

  if (w >= 769 && w <= 1200) {
    setTransitionForMediumScreens();
  } else if (w >= 1201) {
    setTransitionForLargeScreens();
  }
}

/**
 * This will be passed to window.resize.
 * 
 * window.resize will let us know when the window size changes
 * and it will check if the new size is within a specific range or not
 * to decide which transitions to use.. medium or large screen ones.
 * 
 * see setTransitionForMediumScreens(); & setTransitionForLargeScreens();
 * for more info
 */
var prevWidth = $(window).width();
function updateTransitions() {
  var currentWidth = $(window).width();

  if (currentWidth != prevWidth) {
    prevWidth = currentWidth;
    if (currentWidth >= 769 && currentWidth <= 1200) {
      setTransitionForMediumScreens();
    } else if (currentWidth >= 1201) {
      setTransitionForLargeScreens();
    }
  }
}




/*
What's this? 

(setTransitionForLargeScreens() and setTransitionForMediumScreens())

These two functions set up the transitions for two types of screens:
medium and large screens.

Why do I need that?

Because on large screens, you have 4 images per row.. 

And on medium screens, you have 3 times per row...

That means different images end up being in the upper left/right corner

it depends on the window size.

AND THAT MEANS..

You need different transitions. You can't have the third image scale
downwards and to the left on a large screen. It will look weird. Because
this image will not be in the upper right corner, it will be near the middle.

I think you get it.

Problem on the way:

Using addClass instead of css() was unreliable in this case. 


*/
function setTransitionForLargeScreens() {
  $(".art-panel:nth-child(1):visible").css("transform-origin", "top left");
  $(".art-panel:nth-child(2):visible").css("transform-origin", "top center");
  $(".art-panel:nth-child(3):visible").css("transform-origin", "top center");
  $(".art-panel:nth-child(4):visible").css("transform-origin", "top right");
  $(".art-panel:nth-child(5):visible").css("transform-origin", "bottom left");
  $(".art-panel:nth-child(6):visible").css("transform-origin", "bottom center");
  $(".art-panel:nth-child(7):visible").css("transform-origin", "bottom center");
  $(".art-panel:nth-child(8):visible").css("transform-origin", "bottom right");
}

function setTransitionForMediumScreens() {
  $(".art-panel:nth-child(1):visible").css("transform-origin", "top left");
  $(".art-panel:nth-child(2):visible").css("transform-origin", "top center");
  $(".art-panel:nth-child(3):visible").css("transform-origin", "top right");
  $(".art-panel:nth-child(4):visible").css("transform-origin", "bottom left");
  $(".art-panel:nth-child(5):visible").css("transform-origin", "bottom center");
  $(".art-panel:nth-child(6):visible").css("transform-origin", "bottom right");
  $(".art-panel:nth-child(7):visible").css("transform-origin", "bottom left");
  $(".art-panel:nth-child(8):visible").css("transform-origin", "bottom center");
}
function removeTransitions() {
  $(".art-panel").css("transform-origin", "50% 50%");
}

/**
 * I thought it would be nice to also be able to see a full size of the image.
 * 
 * Here we select all images in the art panel, and add a click event listener.
 * 
 * The behavior we want to perform on each image click, 
 * is to run window.open 
 * 
 * but window upen needs a url, so it knows what to open in a new window
 * 
 * we pass it the url by asking each image for its "src" value.
 * 
 * For example:
 * 
 * <img src="https://tinyurl.com/mrxd7ed6" alt="Painting 8">
 */

function makeImageOpenableInANewTab(){
  document.querySelectorAll('.art-panel img').forEach(x => {
    x.addEventListener('click', () => {
        window.open(x.src, '_blank');
    });
  });
}

 
/**
 * I want to add the click event once everything is loaded..
 * makes no sense to do it beforehand.
 */
 window.onload = function(){
  makeImageOpenableInANewTab();
}