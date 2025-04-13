    // Task data structure
    let tasks = {
      todo: [
        { id: 1, title: "Research competitors", description: "Analyze top 5 competitors in the market", priority: "High" },
      ],
      inProgress: [
        { id: 2, title: "Design user interface", description: "Create wireframes for the main dashboard", priority: "Medium" },
      ],
      completed: [
        { id: 3, title: "Project setup", description: "Initialize repository and setup development environment", priority: "Low" },
      ]
    };
    
    // Counter for generating new task IDs
    let nextTaskId = 4;
    
    // Initialize the board
    function initializeBoard() {
      // Render initial tasks
      renderTasks();
      
      // Add event listeners
      document.addEventListener('click', handleGlobalClick);
      
      // Add event listeners for drag and drop functionality
      setupDragAndDrop();
    }
    
    // Render all tasks in their respective columns
    function renderTasks() {
      // Clear existing tasks
      document.getElementById('todoColumn').innerHTML = '';
      document.getElementById('inProgressColumn').innerHTML = '';
      document.getElementById('completedColumn').innerHTML = '';
      
      // Render tasks for each column
      renderColumnTasks('todo', tasks.todo);
      renderColumnTasks('inProgress', tasks.inProgress);
      renderColumnTasks('completed', tasks.completed);
      
      // Update task counts
      updateTaskCounts();
    }
    
    // Render tasks for a specific column
    function renderColumnTasks(columnId, columnTasks) {
      const column = document.getElementById(`${columnId}Column`);
      
      columnTasks.forEach(task => {
        const taskElement = createTaskElement(task, columnId);
        column.appendChild(taskElement);
      });
    }
    
    // Create a task element
    function createTaskElement(task, columnId) {
      const taskElement = document.createElement('div');
      taskElement.className = 'task-card';
      taskElement.id = `task-${task.id}`;
      taskElement.draggable = true;
      
      // Add drag event listeners
      taskElement.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.setData('sourceColumn', columnId);
        setTimeout(() => {
          taskElement.classList.add('dragging');
        }, 0);
      });
      
      taskElement.addEventListener('dragend', () => {
        taskElement.classList.remove('dragging');
      });
      
      // Set priority class
      const priorityClass = `priority-${task.priority.toLowerCase()}`;
      
      taskElement.innerHTML = `
        <div class="task-header">
          <div class="task-priority ${priorityClass}">${task.priority}</div>
          <div class="task-menu">
            <button class="menu-button" data-task-id="${task.id}" data-column="${columnId}">
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <div class="menu-dropdown" id="menu-${task.id}" style="display: none;">
              ${columnId !== 'inProgress' ? `<div class="menu-item move-to-progress" data-task-id="${task.id}" data-column="${columnId}">Move to In Progress</div>` : ''}
              ${columnId !== 'todo' ? `<div class="menu-item move-to-todo" data-task-id="${task.id}" data-column="${columnId}">Move to To-Do</div>` : ''}
              ${columnId !== 'completed' ? `<div class="menu-item move-to-completed" data-task-id="${task.id}" data-column="${columnId}">Move to Completed</div>` : ''}
              <div class="menu-item delete-task" data-task-id="${task.id}" data-column="${columnId}">Delete Task</div>
            </div>
          </div>
        </div>
        <h3 class="task-title">${task.title}</h3>
        <p class="task-description">${task.description}</p>
      `;
      
      return taskElement;
    }
    
    // Handle clicks on the menu button and other interactive elements
    function handleGlobalClick(event) {
      // Handle menu button clicks
      if (event.target.closest('.menu-button')) {
        const button = event.target.closest('.menu-button');
        const taskId = button.dataset.taskId;
        const menuDropdown = document.getElementById(`menu-${taskId}`);
        
        // Close all other open menus first
        document.querySelectorAll('.menu-dropdown').forEach(dropdown => {
          if (dropdown.id !== `menu-${taskId}`) {
            dropdown.style.display = 'none';
          }
        });
        
        // Toggle this menu
        menuDropdown.style.display = menuDropdown.style.display === 'none' ? 'block' : 'none';
        event.stopPropagation();
        return;
      }
      
      // Close all menus when clicking elsewhere
      if (!event.target.closest('.menu-dropdown')) {
        document.querySelectorAll('.menu-dropdown').forEach(dropdown => {
          dropdown.style.display = 'none';
        });
      }
      
      // Handle menu item clicks
      if (event.target.closest('.menu-item')) {
        const menuItem = event.target.closest('.menu-item');
        const taskId = parseInt(menuItem.dataset.taskId);
        const sourceColumn = menuItem.dataset.column;
        
        if (menuItem.classList.contains('move-to-todo')) {
          moveTask(taskId, sourceColumn, 'todo');
        } else if (menuItem.classList.contains('move-to-progress')) {
          moveTask(taskId, sourceColumn, 'inProgress');
        } else if (menuItem.classList.contains('move-to-completed')) {
          moveTask(taskId, sourceColumn, 'completed');
        } else if (menuItem.classList.contains('delete-task')) {
          deleteTask(taskId, sourceColumn);
        }
        
        // Close the menu after action
        document.querySelectorAll('.menu-dropdown').forEach(dropdown => {
          dropdown.style.display = 'none';
        });
        event.stopPropagation();
      }
      
      // Implement other click handlers as needed
    }
    
    // Move a task from one column to another
    function moveTask(taskId, sourceColumn, targetColumn) {
      // Find the task in the source column
      const taskIndex = tasks[sourceColumn].findIndex(task => task.id === taskId);
      if (taskIndex === -1) return;
      
      // Remove from source and add to target
      const task = tasks[sourceColumn].splice(taskIndex, 1)[0];
      tasks[targetColumn].push(task);
      
      // Update the UI
      renderTasks();
    }
    
    // Delete a task
    function deleteTask(taskId, column) {
      const taskIndex = tasks[column].findIndex(task => task.id === taskId);
      if (taskIndex === -1) return;
      
      tasks[column].splice(taskIndex, 1);
      renderTasks();
    }
    
    // Update task counts in column headers
    function updateTaskCounts() {
      document.getElementById('todoCount').textContent = tasks.todo.length;
      document.getElementById('inProgressCount').textContent = tasks.inProgress.length;
      document.getElementById('completedCount').textContent = tasks.completed.length;
    }
    
    // Setup drag and drop functionality
    function setupDragAndDrop() {
      const columns = document.querySelectorAll('.column-content');
      
      columns.forEach(column => {
        column.addEventListener('dragover', (e) => {
          e.preventDefault();
          const afterElement = getDragAfterElement(column, e.clientY);
          const draggable = document.querySelector('.dragging');
          if (afterElement == null) {
            column.appendChild(draggable);
          } else {
            column.insertBefore(draggable, afterElement);
          }
        });
        
        column.addEventListener('drop', (e) => {
          e.preventDefault();
          const taskId = parseInt(e.dataTransfer.getData('text/plain'));
          const sourceColumn = e.dataTransfer.getData('sourceColumn');
          const targetColumn = column.id.replace('Column', '');
          
          if (sourceColumn !== targetColumn) {
            moveTask(taskId, sourceColumn, targetColumn);
          }
        });
      });
    }
    
    // Helper function for drag and drop positioning
    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];
      
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    // Add a new task function (to be connected to a form or button)
    function addNewTask(title, description, priority = 'Medium') {
      const newTask = {
        id: nextTaskId++,
        title,
        description,
        priority
      };
      
      tasks.todo.push(newTask);
      renderTasks();
    }
    
    // Initialize the board when the DOM is loaded
    document.addEventListener('DOMContentLoaded', initializeBoard);
    



    // Task Modal Functionality
const createTaskBtn = document.getElementById('createTaskBtn');
const taskModal = document.getElementById('taskModal');
const closeModal = document.getElementById('closeModal');
const cancelTaskBtn = document.getElementById('cancelTaskBtn');
const saveTaskBtn = document.getElementById('saveTaskBtn');
const taskForm = document.getElementById('taskForm');

// Open modal when clicking the New Task button
createTaskBtn.addEventListener('click', () => {
// Reset form fields
taskForm.reset();
document.getElementById('modalTitle').textContent = 'Create New Task';
document.getElementById('taskId').value = '';
saveTaskBtn.textContent = 'Create Task';

// Show modal
taskModal.style.display = 'flex';
});

// Close modal functions
function closeTaskModal() {
taskModal.style.display = 'none';
}

closeModal.addEventListener('click', closeTaskModal);
cancelTaskBtn.addEventListener('click', closeTaskModal);

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
if (event.target === taskModal) {
  closeTaskModal();
}
});

// Handle file uploads display
const taskAttachments = document.getElementById('taskAttachments');
const fileList = document.getElementById('fileList');

taskAttachments.addEventListener('change', () => {
fileList.innerHTML = '';

Array.from(taskAttachments.files).forEach(file => {
  const fileItem = document.createElement('div');
  fileItem.className = 'file-item';
  fileItem.innerHTML = `
    <i class="fas fa-file"></i>
    <span>${file.name}</span>
    <span class="remove-file" data-filename="${file.name}">×</span>
  `;
  fileList.appendChild(fileItem);
});

// Add event listeners to remove buttons
document.querySelectorAll('.remove-file').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.target.closest('.file-item').remove();
    // Note: We can't actually remove files from the FileList object,
    // but in a real application with backend integration, we would handle this properly
  });
});
});

// Save task function
saveTaskBtn.addEventListener('click', () => {
// Get form values
const title = document.getElementById('taskTitle').value;
const description = document.getElementById('taskDescription').value;
const status = document.getElementById('taskStatus').value;
const priority = document.getElementById('taskPriority').value;
const dueDate = document.getElementById('taskDueDate').value;
const assignee = document.getElementById('taskAssignee').value;

// Validate form (at minimum, require a title)
if (!title.trim()) {
  alert('Please enter a task title');
  return;
}

// Create new task object
const newTask = {
  id: nextTaskId++,
  title,
  description,
  priority,
  dueDate,
  assignee
};

// Add task to appropriate column based on status
switch(status) {
  case 'todo':
    tasks.todo.push(newTask);
    break;
  case 'inprogress':
    tasks.inProgress.push(newTask);
    break;
  case 'completed':
    tasks.completed.push(newTask);
    break;
}

// Re-render tasks and close modal
renderTasks();
closeTaskModal();
});

// Edit task functionality
function editTask(taskId, columnId) {
// Find the task
const task = tasks[columnId].find(t => t.id === taskId);
if (!task) return;

// Populate form fields
document.getElementById('taskId').value = task.id;
document.getElementById('taskTitle').value = task.title;
document.getElementById('taskDescription').value = task.description || '';
document.getElementById('taskStatus').value = columnId === 'inProgress' ? 'inprogress' : columnId;
document.getElementById('taskPriority').value = task.priority ? task.priority.toLowerCase() : 'medium';

if (task.dueDate) {
  document.getElementById('taskDueDate').value = task.dueDate;
}

if (task.assignee) {
  document.getElementById('taskAssignee').value = task.assignee;
}

// Update modal title and button text
document.getElementById('modalTitle').textContent = 'Edit Task';
saveTaskBtn.textContent = 'Update Task';

// Show modal
taskModal.style.display = 'flex';
}

// Update existing handleGlobalClick function to include edit functionality
const originalHandleGlobalClick = handleGlobalClick;
function handleGlobalClick(event) {
// Call the original function to keep existing functionality
originalHandleGlobalClick(event);

// Add edit task functionality when clicking on task card (excluding menu button)
if (event.target.closest('.task-card') && !event.target.closest('.menu-button')) {
  const taskCard = event.target.closest('.task-card');
  const taskId = parseInt(taskCard.id.replace('task-', ''));
  
  // Determine which column the task is in
  let columnId;
  if (taskCard.closest('#todoColumn')) columnId = 'todo';
  else if (taskCard.closest('#inProgressColumn')) columnId = 'inProgress';
  else if (taskCard.closest('#completedColumn')) columnId = 'completed';
  
  // Only proceed if we found the column
  if (columnId) {
    editTask(taskId, columnId);
  }
}
}

// Replace the original event listener with our enhanced version
document.removeEventListener('click', originalHandleGlobalClick);
document.addEventListener('click', handleGlobalClick);