// -var artPanels = document.querySelectorAll(".art-panel");
// -var filterButtons = document.querySelectorAll(".filter-button");

var searchField;
var filterButtons;
var artPanels;

$(document).ready(function() {


  searchField = document.getElementById('search-field');
  filterButtons = document.querySelectorAll('.filter-button');
  artPanels = document.querySelectorAll('.art-panel');


  /**
   * WHY USE A SEPARATE FUNCTION IN THESE EVENT LISTENERS
   * 
   * By adding event listeners that trigger a function, you can have multiple
   * buttons/search input fields that trigger the same function. 
   * 
   * This is better than
   * the search input having its own even listener functionality
   * and then the boxes having their own. 
   * 
   * Why?
   * 
   * We have to think of how search and filter works in simple terms.
   * First off, we need to show only elements that contain a search query
   * and then among the stuff that is visible so far, we will have to
   * further hide things that don't contain a digit.
   * 
   * BUT
   * 
   * when should we do it? If we have an "ok" search button
   * we can just add a click listener to that button, and
   * do the things I described.
   * 
   * BUT.. we want to search/filter in "real-time", so 
   * both search and filter should be applied as soon as you click
   * a check box, or when you write any character into the search bar.
   * 
   * Initially I thought.. "let's just create a separate click lisener for the check boxes, and one for search".
   * 
   * I actually did that in another assignment. And it ended with me having duplicate code 
   * in two different event listeners.
   * 
   * It made the logic more complicated too.
   * 
   * So for the future, here is a rule of thumb. If you have
   * multiple controls, doing something together, then consider
   * making all controls point to the same function.
   * 
   */
  filterButtons.forEach(checkBox => checkBox.addEventListener('change', applyFilterAndSearch));
  searchField.addEventListener('input', applyFilterAndSearch);
});


function applyFilterAndSearch() {

 
  var query = searchField.value;

  var checkBoxValues = getCheckBoxValues();

  artPanels.forEach(item => {
    var artPanelText = item.textContent;

    var searchWordMatch = artPanelText.includes(query);

    var noFiltersSelected = checkBoxValues.length === 0;
  

    var filterMatch = noFiltersSelected || containsAnyCheckboxValue(artPanelText, checkBoxValues);

    if (searchWordMatch && filterMatch) {

        item.style.display = "grid";

    } else {
        item.style.display = "none";

    }
});
}



function getCheckBoxValues() {
  var checkBoxValues = [];

  for (var i = 0; i < filterButtons.length; i++) {
      var checkbox = filterButtons[i];
      
      if (checkbox.checked) {
        checkBoxValues.push(checkbox.value);
      }
  }

  return checkBoxValues;
}



function containsAnyCheckboxValue(artPanelText, checkBoxValues) {
  for (var i = 0; i < checkBoxValues.length; i++) {
      var checkboxValue = checkBoxValues[i];

      if (artPanelText.includes(checkboxValue)) {
          return true;
      }
  }
  
  return false;
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
/**
function makeImageOpenableInANewTab(){
  document.querySelectorAll('.art-panel img').forEach(x => {
    x.addEventListener('click', () => {
        window.open(x.src, '_blank');
    });
  });
}
*/
 
/**
 * I want to add the click event once everything is loaded..
 * makes no sense to do it beforehand.
 */
/**
 window.onload = function(){
  makeImageOpenableInANewTab();
}

*/