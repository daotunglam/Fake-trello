/** SOME PROBLEM / NOTICES:
 * 
 *  - because of event.stopPropagation
 *    addTASK inputBox doesn't close when click to open the other addTASK.
 *    How to fix this problem?
 * 
 */





let is_an_addTASK_input_opened;
let currentTask, currentTaskIndex;
let allTaskEditFields = [];




// RENDER ALL TASKS TITLES =================================================start
/**
 * show the tasks on the specified column
 */
function renderAllTasks_onlyTitle(column) {

    tasksOfThisColumn = allTasks.filter(task => task['columnID'] == column.id);
    // console.log('allTasks: ', allTasks, 'tasksOfThisColumn:', tasksOfThisColumn) 

    let listTasks = document.getElementById(`column${column.id}`).querySelector('.list');

    listTasks.innerHTML = ``;
    if (tasksOfThisColumn) {
        tasksOfThisColumn.forEach(task => {
            listTasks.innerHTML += generateTasks(task);
        })
    }

}
// RENDER ALL TASKS TITLES =================================================end





// GENERATE TASKS TITLES =================================================start
function generateTasks(task) {
    return `
        <div id="task${task.id}" class="card" draggable="true" ondragstart="drag(${task.id})" onmouseover="show('functionBtn${task.id}')" onmouseout="hide('functionBtn${task.id}')">
        
            <div class="function-btn" id="functionBtn${task.id}" style="display:none;">
                <button onclick="reverseChevron(this)" class="btn btn-light btn-sm" data-bs-toggle="collapse" data-bs-target="#detail${task.id}">
                <i class="fas fa-chevron-down"></i>
                </button>
                <button id="delete${task.id}" onclick="delTask(${task.id})" class="btn btn-light btn-sm">⨉</button>
            </div>

            <textarea id="title${task.id}" class="card-header bg-white" readonly onclick="editTask(${task.id})" oninput="resizeWith(this)" value="${task.title}">${task.title}</textarea>

            <div id="detail${task.id}" class="collapse m-1">

                <textarea id="description${task.id}" readonly type="text" oninput="resizeWith(this)" rows="4" onclick="editTask(${task.id})" value="${task.description}">${task.description}</textarea>
                
                <div class="d-flex align-items-center">
                    <i>Deadline</i>
                    <input id="deadline${task.id}" readonly type="datetime-local" value="${task.deadline}"  onclick="editTask(${task.id})">
                </div>
        
            </div>
    
        </div>
    `;
}
// GENERATE TASKS TITLES =================================================end





// REVERSE DIRECTION BUTTON CHEVRON ON THE TASK =================================================start
function reverseChevron(thisChevron) {
    thisChevron.querySelector('i').classList.toggle('fa-chevron-up');
}
// REVERSE DIRECTION BUTTON CHEVRON ON THE TASK =================================================end





// RESIZE WIDTH OF TEXTAREA =================================================start
/**
 * resizes the textarea like the size of the input content.
 * @param {HTML element} textarea the current textarea that's being worked on.
 */
function resizeWith(textarea) {
    textarea.style.height = '';
    textarea.style.height = textarea.scrollHeight + 'px';
}
// RESIZE WIDTH OF TEXTAREA =================================================end





// BUTTON ADD-A-TASK =================================================start
/**
 * show a button names Add A Task on the end of each column
 * @param {object} column from array allColumns
 */
function renderBtn_AddATask(columnID) {
    document.getElementById(`column${columnID}`).querySelector('.card-footer').innerHTML = `
    <div class="card-text" onclick="open_addTASK_title(${columnID}), event.stopPropagation()">+ Add a task</div>
`;
}
// BUTTON ADD-A-TASK =================================================end


function clossAllTasks() {
    allTaskEditFields.forEach((taskField) => {
        let field = document.getElementById(taskField);
        let parent = field.parentElement;
        parent.innerHTML = `
        <div class="card-text" onclick="open_addTASK_title(${taskField}), event.stopPropagation()">+ Add a task</div>
        `;
    });
}


// OPEN ADD-TASKTITLE =================================================start
/**
 * open a field to create a new task by filling a title
 */
function open_addTASK_title(columnID) {
    allTaskEditFields.push(`addTask${columnID}`);
    document.getElementById(`column${columnID}`).querySelector('.card-footer').innerHTML = `
        <div id="addTask${columnID}">
            <textarea id="title" placeholder="add a title..." oninput="resizeWith(this)"></textarea>
            
            <div id="addTask_full" style="display:none;">
                <textarea id="description" placeholder="add a description..." oninput="resizeWith(this)"></textarea>
                
                <div class="d-flex align-items-center">
                    <i>Deadline</i>
                    <input id="deadline" class="deadline" type="datetime-local">
                </div>
            </div>

            <div class="task-buttons">
                <button id="showAddTask_full" onclick="show('addTask_full'), hide('showAddTask_full')" class="btn btn-light btn-sm">Add a full task</button>
                <button onclick="saveNewTask(${columnID}), renderAllColumns()" class="btn btn-outline-dark btn-sm">Save</button>
                <button onclick="renderBtn_AddATask(${columnID})" class="btn btn-close"></button>
            </div>
        </div>
    `;
    is_an_addTASK_input_opened = true;
    addEvtClickToWindow(`addTask${columnID}`, columnID, null);
}
// OPEN ADD-TASKTITLE =================================================end





// SAVE & CLOSE ADD-TASK =================================================start
function saveNclose_addTask(columnID) {

    let tt = document.getElementById('title')
    if (document.getElementById(`addTask${columnID}`)) {
        if (tt.value == '') {
            renderBtn_AddATask(columnID)
        } else {
            saveNewTask(columnID);
            renderAllColumns();
        }
    }

    is_an_addTASK_input_opened = false;

}
// SAVE & CLOSE ADD-TASK =================================================end





// SAVE NEW TASK =================================================start
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
    saveToLocalStr('allTasks', allTasks);

    currentColumn = allColumns.find(column => column.id == columnID) //specifies this column

    renderAllTasks_onlyTitle(currentColumn) //render all tasks of this column

}
// SAVE NEW TASK =================================================end





// EDIT TASK =================================================start
function editTask(taskID) {

    let thisTask = document.getElementById(`task${taskID}`);
    thisTask.draggable = false;
    thisTask.onmouseover = false;
    thisTask.onmouseout = false;

    let q = document.getElementById(`task${taskID}`).querySelectorAll('textarea, input');
    q.forEach(item => {
        item.readOnly = false;
    })

    addEvtClickToWindow(`task${taskID}`, null, taskID)

}
// EDIT TASK =================================================end





// SAVE EDITED TASK =================================================start
function saveEditedTASK(taskID) {

    findTaskBy(taskID);

    editedTITLE = document.getElementById(`title${taskID}`).value;
    editedDESCRIPTION = document.getElementById(`description${taskID}`).value;
    editedDEADLINE = document.getElementById(`deadline${taskID}`).value;
    let editedTASK = {
        'id': taskID,
        'columnID': currentTask.columnID,
        'title': editedTITLE,
        'description': editedDESCRIPTION,
        'deadline': editedDEADLINE,
    };

    allTasks.splice(currentTaskIndex, 1, editedTASK);
    saveToLocalStr('allTasks', allTasks);

    currentColumn = allColumns.find(column => column.id == currentTask.columnID) //specifies this column

    renderAllTasks_onlyTitle(currentColumn) //render all tasks of this column

}
// SAVE EDITED TASK =================================================end





// DELETE TASK =================================================start
function delTask(taskID) {

    findTaskBy(taskID);

    allTasks.splice(currentTaskIndex, 1);
    saveToLocalStr('allTasks', allTasks);

    currentColumn = allColumns.find(column => column.id == currentTask.columnID)

    renderAllTasks_onlyTitle(currentColumn) //render all tasks of current column

}
// DELETE TASK =================================================end






// DRAG-DROP ==========================================================start
function allowDrop(ev) {
    ev.preventDefault()
}

function drag(taskID) {
    findTaskBy(taskID);
}

function dropIn(columnID) {
    currentTask.columnID = columnID;
    saveToLocalStr('allTasks', allTasks);
    renderAllColumns();
}
// DRAG-DROP ==========================================================end