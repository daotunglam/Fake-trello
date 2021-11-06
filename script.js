
/*==========================
FOR ALL BODY TAGS 
===========================*/

let allColumns = [];
let allTasks = [];
let is_addCOLUMN_input_opened;
let is_addTASK_title_opened;

/**
 * Funtion init makes sure that <body> (or function includeHTML) is loaded before the other functions run
 * 
 */
function init(){

  includeHTML();

  renderAllColumns();

}

/**
 * set the general functions hier to use many times below 
 * @param {string} x id of the element
 */
function show(x){
  document.getElementById(x).style.display = 'flex';
}
function hide(x){
  document.getElementById(x).style.display = 'none';
}

/**
 * general function setting here and using many times below
 * This function sets an array to the localstorage
 * @param {string} key the keyname marks the array you want to create/update. on the localstorage.
 * @param {array} array the array from your code that you want to save to localstorage.
 */
function saveToLocalStr(key, array){//set here and use below
    localStorage.setItem(key, JSON.stringify(array));
}

/**
 * general function setting here and using many times below
 * This function get specified value from the localstorage and put in an array
 * @param {string} key the keyname marks the value you want on the localstorage.
 */
function getFromLocalStr(key) { //put the key in ''
  return JSON.parse(localStorage.getItem(key));
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
}

/**
 * save and close an input form when click outside it.
 * @param {click} event 
 */
function saveNcloseSth(event){
  event.stopPropagation();
  saveNclose_addCOLUMN(event);
  saveNclose_addTASK(event);
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









/**======================================
ALL FUNCTIONS FOR COLUMNS
========================================*/



/**
 * show on main all columns with their names and their tasks
 */
 function renderAllColumns(){
  if(getFromLocalStr('allColumns')) {allColumns = getFromLocalStr('allColumns')};
  if(getFromLocalStr('allTasks'))   {allTasks = getFromLocalStr('allTasks')};
  
  let columnsContainer = document.getElementById('columnsContainer');
  columnsContainer.innerHTML = '';
  allColumns.forEach((column, i) => {
    columnsContainer.innerHTML += `
      <div class="column card" id="column${column.id}" onmouseover="show('delColumn${column.id}')" onmouseout="hide('delColumn${column.id}')">
        <button id="delColumn${column.id}" onclick="delColumn(${column.id}, ${i})" class="btn btn-close btn-sm border" style="display:none;"></button>
        
        <div class="card-body">
            <h5 class="card-title">${column.columnName}</h5>
            <div class="list" ondrop="dropTo('todoList')" ondragover="allowDrop(event)"></div>
        </div>

        <div class="card-footer"></div>
      </div>
    `;
    renderBtn_AddATask(column.id);
    renderAllTasks_onlyTitle(column);
  })
}






function open_addCOLUMN_input(event){
  event.stopPropagation();
  show('addAColumn_input');
  hide('addAColumn_mark');
  is_addCOLUMN_input_opened = true;
}



/**
 * on the field Add A Column, after filling a column name,
 * click on button Next New Column to
 * create a new column with title and button Add A Task
 * and open the input field Add A Column by side to continue create other column.
 */
function nextNewColumn(event){
  event.stopPropagation(); //stop onclick in #addColumn
  saveNewColumn();
  renderAllColumns();
  open_addCOLUMN_input();
}



function saveNewColumn(){

  columnName = document.querySelector('#addAColumn_input > input').value;
  column = {
    'columnName': columnName,
    'id': new Date().getTime(),
  }
  allColumns.push(column);

  saveToLocalStr('allColumns', allColumns)

}



function cancelNewColumn(event){
  event.stopPropagation(); //stop onclick in #addColumn, otherwise addCOLUMN_input es opened again.
  hide('addAColumn_input');
  show('addAColumn_mark');
  is_addCOLUMN_input_opened = false;
}



function delColumn(columnID, i){

  //find tasks of this column
  let allTasksOfThisColumn = allTasks.filter(task => task.columnID == columnID);
  while(allTasksOfThisColumn.length > 0){
    firstTaskOfthisColumn = allTasks.find(task => task.columnID == columnID);
    index = allTasks.indexOf(firstTaskOfthisColumn)
    //Del task of this column:
    allTasks.splice(index, 1);
  }
  saveToLocalStr('allTasks', allTasks)

  //Del Column:
  allColumns.splice(i, 1);
  saveToLocalStr('allColumns', allColumns)

  renderAllColumns()

}








/**===========================
ALL FUNCTIONS FOR TASKS
============================ */



/**
 * show the tasks on the specified column
 */
function renderAllTasks_onlyTitle(column){

  tasksOfThisColumn = allTasks.filter(task => task['columnID'] == column.id);
  // console.log('allTasks: ', allTasks, 'tasksOfThisColumn:', tasksOfThisColumn) 

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
function renderBtn_AddATask(columnID){
  is_addTASK_input_opened = false;
  document.getElementById(`column${columnID}`).querySelector('.card-footer').innerHTML = `
      <div class="card-text" onclick="open_addTASK_title(${columnID}, event)">+ Add a task</div>
  `; 
}





/**
 * open a field to create a new task by filling a title
 */
function open_addTASK_title(columnID, event){
  event.stopPropagation()
  document.getElementById(`column${columnID}`).querySelector('.card-footer').innerHTML = `
    <div id="addTask" class="addingField">
        <textarea id="title" placeholder="add a title..." oninput="resizeWith(this)"></textarea>
        
        <div id="addTask_full" style="display:none;">
            <textarea id="description" placeholder="add a description..." oninput="resizeWith(this)"></textarea>
            
            <div class="d-flex align-items-center">
                <i>Deadline</i>
                <input id="deadline" class="deadline" type="datetime-local">
            </div>
        </div>

        <div class="task-buttons">
            <button id="showAddTask_full" onclick="showAddTask_full()" class="btn btn-light btn-sm">Add a full task</button>
            <button onclick="saveNewTask(${columnID})" class="btn btn-outline-dark btn-sm">Save</button>
            <button onclick="renderBtn_AddATask(${columnID})" class="btn btn-close"></button>
        </div>
    </div>
  `;
  is_addTASK_title_opened = true;
  // document.addEventListener('click', function(e){
  //   if( ! document.getElementById('addTask').contains(e.target) ){
  //     console.log('outside')
  //   }
  // })
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








/**=============================================
    SAVE AND CLOSE A DIV WHEN CLICK OUTSIDE IT
============================================= */
function saveNclose_addCOLUMN(event){

  let c = document.getElementById('addAColumn_input').querySelector('input')
  if(is_addCOLUMN_input_opened == true){
    if(c.value == ''){
      cancelNewColumn(event)
    }else{
      saveNewColumn();
      renderAllColumns();
      cancelNewColumn(event)
    }
  }

}



function saveNclose_addTASK(){
  
  let tt = document.getElementById('title')
  if(is_addTASK_title_opened == true){
    if(tt.value == ''){
      renderAllColumns()
    }
    // else{
    //   saveNewTask();
    //   renderAllColumns();
    // }
  }

}