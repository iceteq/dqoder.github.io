/*
3.1.1 Obligatory - regex
Checks if string has at least one digit.
*/
function containsDigits(str) {
    const wholeNumbers = new RegExp("\\d+"); 
    return wholeNumbers.test(str);
  }
  
function isDigitFilterSelected() {
    return document.getElementById("digitFilter").checked;
}
  

  /**
   * Set up the checkbox that will filter out any products
   * without digit in its name
   */
const digitFilterCheckbox = document.getElementById("digitFilter");
  digitFilterCheckbox.addEventListener("change", function () {
    displayAll();

    if (this.checked) {
      applyDigitFilter();
    } else {
    }
});

/**
 * Goes through products array, and sets display="none"
 * for those that contain digits.
 */
function applyDigitFilter() {

        
    var allItems = document.querySelector('article ul').querySelectorAll('li');

    allItems.forEach(function(li) {

        if(!containsDigits(li.textContent)){
            console.log("I've hidden " + li.textContent);
            li.style.display = "none";
        }
    });

    }
    
/**
 * Almost the same as applyDigitFilter() but remove the "dispay = "none"
 * property from all.
 *   */
function displayAll() {
var allItems = document.querySelector('article ul').querySelectorAll('li');

allItems.forEach(function(li) {

        li.style.display = "";
    
});

}