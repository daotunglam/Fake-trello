
/*==========================
FOR ALL BODY TAGS 
===========================*/

let allColumns = [];
let allTasks = [];

/**
 * Funtion init makes sure that <body> (or function includeHTML) is loaded before the other functions run
 * 
 */
function init(){

  includeHTML();

  loadPage();

}

/**
 * set the general functions hier to use many times below 
 * @param {} x id of the element
 */
function show(x){
  document.getElementById(x).style.display = 'flex';
}
function hide(x){
  document.getElementById(x).style.display = 'none';
}

/**
 * a general functions that we set hier to use many times below.
 * this function specifies an object that how it looks like and which index it has in its array.
 * @param {array} array the array that contains this object.
 * @param {string} id the id in this object.
 */
 function findTaskBy(id){
  currentTask = allTasks.find(task => task['id'] == id);
  currentTaskIndex = allTasks.indexOf(currentTask);
  console.log('allTasks: ', allTasks, 'currentTask:', currentTask, 'currentTaskIndex', currentTaskIndex) 
}






/*======================
HTML TEMPLATES 
======================*/

/**
 * This Function is to include HTML snippets in HTML.
 * 
 */

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}








/*==========================
MAIN
========================== */



/**
 * this is the second function that run automaticaly when the page is opened.
 * 
 */
function loadPage(){
  renderAllColumns();
  renderAddAColumn();
}








/**======================================
ALL FUNCTIONS FOR COLUMNS
========================================*/



/**
 * show on board all columns with their names and their tasks
 */
 function renderAllColumns(){
  let board = document.getElementById('board');
  board.innerHTML = '';
  allColumns.forEach((column, i) => {
    board.innerHTML += `
      <div class="column card" id="column${column.id}" onmouseover="show('delColumn${column.id}')" onmouseout="hide('delColumn${column.id}')">
        <button id="delColumn${column.id}" onclick="delColumn(${column.id}, ${i})" class="btn btn-close btn-sm border" style="display:none;"></button>
        
        <div class="card-body">
            <h5 class="card-title">${column.columnName}</h5>
            <div class="list" ondrop="dropTo('todoList')" ondragover="allowDrop(event)"></div>
        </div>

        <div class="card-footer"></div>
      </div>
    `;
    renderAddATask(column.id);
    renderAllTasks_onlyTitle(column);
  })
}



/**
 * show a button names Add A Column on the right the columns
 */
function renderAddAColumn(){
  let board = document.getElementById('board');
  board.innerHTML += `
      <div class="card column" onclick="openInputField_addAColumn(this)">
          <div class="card-body">

              <div class="card-text" id="addAColumn_mark">+ Add a column</div>

              <form id="addAColumn_input" style="display: none;">
                  <input class="form-control" placeholder="add a column name...">
                  <div class="mt-2">
                      <button onclick="nextNewColumn()" class="btn btn-primary btn-sm">Next new column</button>
                      <button onclick="cancelNewColumn()" class="btn btn-close btn-sm"></button>
                  </div>
              </form>

          </div>
      </div>
  `;
}



function openInputField_addAColumn(thisInputField){

  show('addAColumn_input');
  hide('addAColumn_mark');

  console.log(thisInputField);
  // thisInputField.onclick = null;

  document.addEventListener('click', function(e){
    if(!thisInputField.contains(e.target)){
      saveNewColumn();
      loadPage();
    }
  })

}



/**
 * on the field Add A Column, after filling a column name,
 * click on button Next New Column to
 * create a new column with title and button Add A Task
 * and open the input field Add A Column by side to continue create other column.
 */
function nextNewColumn(){
  saveNewColumn();
  loadPage();
  openInputField_addAColumn();
}



function saveNewColumn(){
  columnName = document.querySelector('#addAColumn_input > input').value;
  column = {
    'columnName': columnName,
    'id': new Date().getTime(),
  }
  allColumns.push(column);
}



function cancelNewColumn(){
  hide('addAColumn_input');
  show('addAColumn_mark');
}



function delColumn(columnID, i){
  currentColumn = allColumns.find(column => column.id == columnID)
  //Del Column:
  allColumns.splice(i, 1, currentColumn);

  //Del all tasks of this column:
  // let taskOfThisColumn = allTasks.find(task => task.columnID == columnID);
  // console.log(taskOfThisColumn)
  // while (taskOfThisColumn) {
  //   taskIndex = allTasks.indexOf(taskOfThisColumn)
  //   allTasks.splice(taskIndex, 1, taskOfThisColumn)
  //   taskOfThisColumn = allTasks.find(task => task.columnID == columnID);
  // }
}








/**===========================
ALL FUNCTIONS FOR TASKS
============================ */



/**
 * show the tasks on the specified column
 */
function renderAllTasks_onlyTitle(column){

  tasksOfThisColumn = allTasks.filter(task => task['columnID'] == column.id);
  console.log('allTasks: ', allTasks, 'tasksOfThisColumn:', tasksOfThisColumn) 

  let listTasks = document.getElementById(`column${column.id}`).querySelector('.list');

  listTasks.innerHTML = ``;
  if(tasksOfThisColumn){
    tasksOfThisColumn.forEach(task =>{
      listTasks.innerHTML += generateTasks(task);
    })
  }

}



function generateTasks(task){
  return `
    <div id="task${task.id}" class="card" draggable="true" onmouseover="show('functionBtn${task.id}')" onmouseout="hide('functionBtn${task.id}')">

      <button onclick="saveEditedTask(${task.id})" id="saveEditedTask${task.id}" class="saveEditedTaskBtn btn btn-light btn-sm">Save</button>
      <div class="function-btn" id="functionBtn${task.id}" style="display:none;">
        <button onclick="reverseChevron(this)" class="btn btn-light btn-sm" data-bs-toggle="collapse" data-bs-target="#detail${task.id}">
          <i class="fas fa-chevron-down"></i>
        </button>
        <button id="delete${task.id}" onclick="delTask(${task.id})" class="btn btn-light btn-sm">⨉</button>
      </div>

      <div class="card-header bg-transparent border-light d-flex justify-content-between align-items-center">  
        <textarea readonly id="title${task.id}" onclick="editTask(this, ${task.id})" oninput="resizeWith(this)">${task.title}</textarea>
      </div>

      <div class="collapse" id="detail${task.id}">
        <div class="card-body">

          <textarea readonly id="description${task.id}" type="text" oninput="resizeWith(this)" rows="4" onclick="editTask(this, ${task.id})">${task.description}</textarea>
          
          <div class="d-flex align-items-center">
            <i>Deadline</i>
            <input readonly id="deadline${task.id}" class="deadline" type="datetime-local" value="${task.deadline}"  onclick="editTask(this, ${task.id})">
          </div>

        </div>
      </div>

    </div>
  `;
}


/**
 * resizes the input field like the size of the input content.
 * @param {HTML element} thisInputField the current Input Field that's being worked on.
 */
function resizeWith(thisInputField){
  thisInputField.style.height = '';
  thisInputField.style.height = thisInputField.scrollHeight + 'px';
}




/**
 * show a button names Add A Task on the end of each column
 * @param {object} column from array allColumns
 */
function renderAddATask(columnID){
  document.getElementById(`column${columnID}`).querySelector('.card-footer').innerHTML = `
      <div class="card-text" onclick="openInputField_addATask(${columnID})">+ Add a task</div>
  `; 
}





/**
 * open a field to create a new task by filling a title
 */
function openInputField_addATask(columnID){
  document.getElementById(`column${columnID}`).querySelector('.card-footer').innerHTML = `
    <div id="addTitleField" class="addingField">
        <textarea id="title" placeholder="add a title..."
            oninput="this.style.height = '';this.style.height = this.scrollHeight + 'px';"></textarea>
        
        <div id="fullAddingField" style="display:none;">
            <textarea id="description" placeholder="add a description..."
                oninput="this.style.height = '';this.style.height = this.scrollHeight + 'px';"></textarea>
            
            <div class="d-flex align-items-center">
                <i>Deadline</i>
                <input id="deadline" class="deadline" type="datetime-local">
            </div>
        </div>

        <div class="task-buttons">
            <button id="showAFullAddingField" onclick="showAFullAddingField()" class="btn btn-light btn-sm">Add a full task</button>
            <button onclick="saveNewTask(${columnID})" class="btn btn-outline-dark btn-sm">Save</button>
            <button onclick="renderAddATask(${columnID})" class="btn btn-close"></button>
        </div>
    </div>
  `;
}




function saveNewTask(columnID) {
  
  title = document.getElementById('title').value;
  description = document.getElementById('description').value;
  deadline = document.getElementById('deadline').value;
  let task = {
    'id': new Date().getTime(),
    'columnID': columnID,
    'title': title,
    'description': description,
    'deadline': deadline,
  };
  
  allTasks.push(task);

  currentColumn = allColumns.find(column => column.id == columnID) //specifies this column

  renderAllTasks_onlyTitle(currentColumn) //render all tasks of this column

}

