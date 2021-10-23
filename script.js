/**
 * SOME PROBLEMS I'VE NOT FOUND THE SOLUTION:
 * 
 * - Is there toggle for style.display: none;
 * 
 * - In order to make titles text having <br> and looking like in textaria
 *    i've tried title.replaceAll('\n', `<br>`) , but it doesn't work
 *    => solution put title.replaceAll('\n', `<br>`) into the task
 * 
 * - how to make .addingField and .list not overflow the bottom of screen?
 */






/*== FOR ALL BODY TAGS =======================================*/

/**
 * Funtion init makes sure that <body> (or function includeHTML) is loaded before the other functions run
 * 
 */
function init(){

  includeHTML();

//  setTimeout(function(){ //setTimeout 100ms makes sure that includeHTML() is loaded completely
//    markActive();       //before function markActive() runs.
//  }, 100);

  showAllTaskTitles();

}





/*== HEADER =================================================*/

/**
* Function markActive marks the clicked navItem active.
* @param {string} currentLocation - the current adress of your page
*/

// function markActive(){

//   const currentLocation = location.href;
//   let navItems = document.querySelectorAll('header nav a')

//   for(let i=0; i < navItems.length; i++){
//       if(currentLocation === navItems[i].href){
//           navItems[i].classList.add('active')
//       }
//   }

// }





/*== HTML TEMPLATES ==========================================*/

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





/*== MAIN ================================================== */

let category, title, description, deadline;

let today = new Date();

let date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();

let allTasks = [];

function setToLocalStorage(key, array) { //set here and use below
  localStorage.setItem(key, JSON.stringify(array));
}
function getFromLocalStorage(key) { //set here and use below
  return JSON.parse(localStorage.getItem(key));
}


if(getFromLocalStorage('allTasks')){
  allTasks = getFromLocalStorage('allTasks');
}

function showAllTaskTitles(){
  let todoList = document.getElementById('todoList');
  todoList.innerHTML = ``;
  allTasks.forEach((item, i) =>{
    todoList.innerHTML += `
      <div id="task${i}" draggable="true" onmouseover="showFunctionBtn(${i})" onmouseout="hideFunctionBtn(${i})">
        <p>${item.title}</p>
        <div class="collapse" id="detail${i}">
          <p><i>${allTasks[i].category}</i></p>
          <p>${allTasks[i].description}</p>
          <p>Create at ${allTasks[i].createAt}</p>
          <p>Deadline ...${allTasks[i].deadline.replaceAll('T', ` `)}</p>
        </div>
        <div class="function-btn" id="functionBtn${i}" style="display:none;">
          <button onclick="reverseChevron(this)" class="btn btn-light btn-sm" data-bs-toggle="collapse" data-bs-target="#detail${i}">
            <i class="fas fa-chevron-down"></i>
          </button>
          <button onclick="editTask(${i})" class="btn btn-light btn-sm">
            <i class="fas fa-pen"></i>
          </button>
          <button id="delete${i}" onclick="delTask(${i})" class="btn btn-light btn-sm">⨉</button>
        </div>
      </div>
    `;
  })
}

function openTaskInputField(){
  document.getElementById('addATask').style.display = 'none';
  document.getElementById('addTitleField').style.display = 'block';
}



function showAFullAddingField(){
  document.getElementById('showAFullAddingField').style.display = 'none';
  document.getElementById('fullAddingField').style.display = 'block';
}
function hideFullAddingField(){
  document.getElementById('showAFullAddingField').style.display = 'flex';
  document.getElementById('fullAddingField').style.display = 'none';
}



function save() {
  
  category = document.getElementById('category').value;
  title = document.getElementById('title').value;
  description = document.getElementById('description').value;
  deadline = document.getElementById('deadline').value;
  let task = {
    'category': category,
    'title': title.replaceAll('\n', `<br>`),
    'description': description.replaceAll('\n', `<br>`),
    'deadline': deadline,
    'createAt': date,
  };
  
  allTasks.push(task);
  setToLocalStorage('allTasks', allTasks);
  showAllTaskTitles();
  backToAddTitleField();

}



function backToAddTitleField(){
  hideFullAddingField();
  document.getElementById('addTitleField').style.display = 'none';
  document.getElementById('addATask').style.display = 'block';
}



function showFunctionBtn(i){
  document.getElementById(`functionBtn${i}`).style.display = 'flex';
}
function hideFunctionBtn(i){
  document.getElementById(`functionBtn${i}`).style.display = 'none';
}

function reverseChevron(thisBtn){
  thisBtn.querySelector('i').classList.toggle('fa-chevron-up')
}

function editTask(i){
  document.getElementById(`task${i}`).innerHTML = `
      <div class="card-header bg-transparent border-light d-flex justify-content-between align-items-center">
          <button onclick="saveEditedTask(${i})" class="btn btn-light btn-sm">Save</button>
          <button onclick="delTask(${i})" class="btn btn-light btn-sm">Delete</button>    
      </div>
      <input id="title${i}" class="form-control card" value="${allTasks[i].title}" aria-describedby="passwordHelpBlock" required>
      <textarea id="description${i}" type="text" class="form-control card" oninput="this.style.height = '';this.style.height = this.scrollHeight + 'px';">${allTasks[i].description}</textarea>
      <input id="deadline${i}" class="form-control" type="datetime-local" value="${allTasks[i].deadline}">
      <select id="category${i}" class="form-select mt-1 mb-2">
          <option selected>${allTasks[i].category}</option>
          <option value="Client">Client</option>
          <option value="Product">Product</option>
          <option value="Management">Management</option>
      </select>
  `;
}
function saveEditedTask(i) {
  
  let editedCategory = document.getElementById(`category${i}`).value;
  let editedTitle = document.getElementById(`title${i}`).value;
  let editedDescription = document.getElementById(`description${i}`).value;
  let editedDeadline = document.getElementById(`deadline${i}`).value;
  let editedTask = {
    'category': editedCategory,
    'title': editedTitle.replaceAll('\n', `<br>`),
    'description': editedDescription.replaceAll('\n', `<br>`),
    'deadline': editedDeadline,
    'createAt': date,
  };
  
  allTasks.splice(i, 1, editedTask);
  setToLocalStorage('allTasks', allTasks);
  showAllTaskTitles();

}
function delTask(i){
  allTasks.splice(i, 1);
  setToLocalStorage('allTasks', allTasks);
  showAllTaskTitles();
}