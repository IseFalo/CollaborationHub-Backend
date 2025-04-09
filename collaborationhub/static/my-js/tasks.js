document.addEventListener('DOMContentLoaded', function() {
    // Initialize drag and drop
    const columns = document.querySelectorAll('.kanban-column-body');
    
    // Set up sortable for each column
    columns.forEach(column => {
        new Sortable(column, {
            group: 'tasks',
            animation: 150,
            onEnd: function(evt) {
                // Update task status in backend
                const taskId = evt.item.dataset.taskId;
                const newStatus = evt.to.parentElement.id.replace('-column', '');
                
                updateTaskStatus(taskId, newStatus);
                updateColumnCounts();
            }
        });
    });
    
    // Function to update task status via API
    function updateTaskStatus(taskId, newStatus) {
        // AJAX call to Django backend
        fetch('/api/tasks/' + taskId + '/status/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(response => response.json())
        .then(data => console.log('Task updated:', data))
        .catch(error => console.error('Error updating task:', error));
    }
    
    // Function to update column counts
    function updateColumnCounts() {
        const columns = document.querySelectorAll('.kanban-column');
        columns.forEach(column => {
            const taskCount = column.querySelector('.kanban-column-body').children.length;
            column.querySelector('.task-count').textContent = taskCount;
        });
    }
    
    // Helper function to get CSRF token
    function getCsrfToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const createTaskBtn = document.getElementById('createTaskBtn');
    const kanbanBoard = document.getElementById('kanbanBoard');
    const taskModal = document.getElementById('taskModal');
    const closeModal = document.getElementById('closeModal');
    const cancelTaskBtn = document.getElementById('cancelTaskBtn');

    // Function to show task modal and hide kanban board
    function showTaskModal() {
        kanbanBoard.style.display = 'none';
        taskModal.classList.add('show');
    }

    // Function to hide task modal and show kanban board
    function hideTaskModal() {
        kanbanBoard.style.display = 'flex';
        taskModal.classList.remove('show');
    }

    // Event listener for create task button
    createTaskBtn.addEventListener('click', showTaskModal);

    // Event listeners to close the modal
    closeModal.addEventListener('click', hideTaskModal);
    cancelTaskBtn.addEventListener('click', hideTaskModal);

    // Optional: Close modal when clicking outside the modal content
    taskModal.addEventListener('click', (event) => {
        if (event.target === taskModal) {
            hideTaskModal();
        }
    });
});