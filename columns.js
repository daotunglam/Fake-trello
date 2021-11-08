/** SOME PROBLEM / NOTICES:
 * 
 * - because of document.addEventlistener('click')
 *    some events onclick have to have event.stopPropagation
 *    But why some event don't need that?
 *    Ex: open_addCOLUMN_input()
 * 
 */




// RENDER ALL COLUMNS ===========================================start
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
          <button id="delColumn${column.id}" onclick="delColumn(${column.id}, ${i})" class="btn btn-close btn-sm" style="display:none;"></button>

          <h5 class="card-header">
            ${column.columnName}
          </h5>
          
          <div class="list card-body" ondrop="dropTo('todoList')" ondragover="allowDrop(event)"></div>
  
          <div class="card-footer"></div>
        </div>
      `;
      renderBtn_AddATask(column.id);
      renderAllTasks_onlyTitle(column);
    })
  }
  // RENDER ALL COLUMNS ===========================================end
  


  
  
  // OPEN ADD COLUMN ===========================================start
  function open_addCOLUMN_input(){
    show('addAColumn_input');
    hide('addAColumn_mark');
    is_addCOLUMN_input_opened = true;
    
    document.addEventListener('click', function(e){
      if(is_addCOLUMN_input_opened == true){
        if( !document.getElementById('addColumn').contains(e.target)){
            saveNclose_addCOLUMN()
        }
      }
    })
  }
  // OPEN ADD COLUMN ===========================================end
  


  
  
  // SAVE & CLOSE ADD COLUMN ===========================================start
  function saveNclose_addCOLUMN(){
    let c = document.getElementById('addAColumn_input').querySelector('input')
    if(is_addCOLUMN_input_opened == true){
      if(c.value == ''){
        cancelNewColumn()
      }else{
        saveNewColumn();
        renderAllColumns();
        cancelNewColumn()
      }
    }
  }
  // SAVE & CLOSE ADD COLUMN ===========================================end
  


  
  
  // NEXT NEW COLUMN =================================================start
  /**
   * on the field Add A Column, after filling a column name,
   * click on button Next New Column to
   * create a new column with title and button Add A Task
   * and open the input field Add A Column by side to continue create other column.
   */
  function nextNewColumn(){
    saveNewColumn();
    renderAllColumns();
    // open_addCOLUMN_input(); NOT NECESSERY BECAUSE ONCLICKING ON BTN X IST ONCLICKING ON #addColumn AS WELL.
  }
  // NEXT NEW COLUMN =================================================end
  


  
  
  // SAVE NEW COLUMN =================================================start
  function saveNewColumn(){
  
    columnName = document.querySelector('#addAColumn_input > input').value;
    column = {
      'columnName': columnName,
      'id': new Date().getTime(),
    }
    allColumns.push(column);
  
    saveToLocalStr('allColumns', allColumns)
  
  }
  // SAVE NEW COLUMN =================================================end
  


  
  
  // CANCEL NEW COLUMN =================================================start
  function cancelNewColumn(){
    hide('addAColumn_input');
    show('addAColumn_mark');
    is_addCOLUMN_input_opened = false;
  }
  // CANCEL NEW COLUMN =================================================end
  
  
  


  // DELETE A COLUMN =================================================start
  function delColumn(columnID, i){
  
    //Del tasks of this column /* THIS IS A POWERFUL THING I FOUND - REMEMBER FOR THE NEXT PROJECTS */
    for(index = allTasks.length - 1 ; index > 0 ; index--){
        if(allTasks[index].columnID == columnID){
            allTasks.splice(index, 1);
        }
    }
    saveToLocalStr('allTasks', allTasks)
  
    //Del Column:
    allColumns.splice(i, 1);
    saveToLocalStr('allColumns', allColumns)
  
    renderAllColumns()
  
  }
  // DELETE A COLUMN =================================================end
  