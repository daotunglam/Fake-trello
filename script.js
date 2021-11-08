/*===============================================
  HTML TEMPLATES 
===============================================*/

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








/*=====================================================
  FOR ALL BODY TAGS 
======================================================*/



let allColumns = [];
let allTasks = [];
let is_addCOLUMN_input_opened;





// INIT ============================================start
/**
 * Funtion init makes sure that <body> (or function includeHTML) is loaded before the other functions run
 * 
 */
function init(){

  includeHTML();

  renderAllColumns();

}
// INIT ============================================end





// SHOW HIDE A DIV =======================================start
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
// SHOW HIDE A DIV =======================================end





// SAVE-GET LOCALSTORAGE ===========================================start
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
// SAVE-GET LOCALSTORAGE ===========================================end





// FIND TASK BY ID ===========================================start
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
// FIND TASK BY ID ===========================================end





// ADD EVENT CLICK TO WINDOW =================================================start
function addEvtClickToWindow(divID, columnID, taskID){
  document.addEventListener('click', function(e){
      // if( document.getElementById(divID) ){
      if( is_an_addTASK_input_opened === true ){

        //for add-new-task
        if( divID === `addTask${columnID}` && !document.getElementById(divID).contains(e.target) ){
            saveNclose_addTask(columnID)
        }
        
        //for edit-task
        if( divID === `task${taskID}` && !document.getElementById(divID).contains(e.target) ){
          saveEditedTASK(taskID)
        }

      }

  })
}
// ADD EVENT CLICK TO WINDOW =================================================end