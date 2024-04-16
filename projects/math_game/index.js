/**
 * Takes teh button "startGameBtn "
 * 
 * and applies a click event listener which 
 * will do two things when you click on btn
 * 
 * 1. It will open upptift.html in a new window.
 * 
 * 2. It will make it possible to close down the game with "esc"
 */
var btn = document.getElementById("startGameBtn");
btn.addEventListener("click", () => {

    var gameWindow = window.open("uppgift.html", "_blank");
    gameWindow.addEventListener("keydown", e => {
        if (e.key === "Escape") 
            gameWindow.close();
    });
});