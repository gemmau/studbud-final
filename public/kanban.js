// an event listener for the 'add column' button which calls the addColumn() function
document.getElementById("myBtn").addEventListener("click", addColumn); 

// creates a div with a h1 element with the text of "new column". then appends the text to h1, the h1 to the div and the div to the div element with an id of 'k-board'  
function addColumn() {
  console.log("button clicked");
  var newColumn = document.createElement("div");
  var newHeading = document.createElement("h1");
  var headingText = document.createTextNode("new column");
  var kBoard = document.getElementById("k-board");
  newHeading.appendChild(headingText);
  newColumn.appendChild(newHeading);
  kBoard.appendChild(newColumn);

}