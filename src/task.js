//querySelector is a more general way of getting elements and it allows you to pass in a CSS selector as the input parameter
const form = document.getElementById("taskform");
const button = document.querySelector("#taskform > button")
var taskInput = document.getElementById("taskInput");
var tasklist = document.getElementById("tasklist");

var dueDateInput = document.getElementById("dueDateInput");
var completionTimeInput = document.getElementById("completionTimeInput");
var estimatedTimeInput = document.getElementById("estimatedTimeInput");
var priorityInput = document.getElementById("priorityInput");


button.addEventListener("click", function(event){
  event.preventDefault();
  let task = taskInput.value;
  let dueDate = dueDateInput.value
  let completionTime = completionTimeInput.value;
  let estimatedTime = estimatedTimeInput.value;
  let priorityRating = priorityInput.options[priorityInput.selectedIndex].value;
  addTask(task, dueDate, estimatedTime, priorityRating , completionTime, false);
  console.log(tasklist);
})


// Create array to store tasks
var taskListArray = [];
// Define a function for dynamically creating task objects
function addTask(taskDescription, dueDate, estimatedTime, priorityRating, completionTime, completionStatus) {
  let d = new Date();
  let dateCreated = d.getFullYear();
  //task object
  let task = {
    taskDescription,
    dueDate,
    dateCreated,
    estimatedTime,
    completionTime,
    priorityRating,
    completionStatus  
  };
  // Push task object to taskList array
  taskListArray.push(task);
  renderTask(task);
}
// Call the addTask function with some test data
// Log out the overall array (render --> to the screen)
//appendChild --> one of the ways to get new items into the DOM
//call the task object^^
function renderTask(task){
  // create HTML elements
  let item = document.createElement("li");
  item.innerHTML = "<p>" + task.taskDescription + "</p>";

  tasklist.appendChild(item);
  //extra Task DOM elements
  let delButton = document.createElement("button");
  let delButtonText = document.createTextNode("Delete Task");
  delButton.appendChild(delButtonText);
  item.appendChild(delButton);
  
  //Event Listeners for DOM elements
  delButton.addEventListener("click", function(event){
    event.preventDefault();
    item.remove();
  })
  
  //Clear the input 
  form.reset();
}