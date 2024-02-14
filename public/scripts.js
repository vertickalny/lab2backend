// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

function addTask() {
    const taskTitle = document.getElementById('taskTitle').value;
    const taskDescription = document.getElementById('taskDescription').value;

    if (!taskTitle || !taskDescription) {
        alert('Please enter both task title and description.');
        return;
    }

    const task = {
        title: taskTitle,
        description: taskDescription,
    };

    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Task added:', data);
            loadTasks();
        })
        .catch(error => console.error('Error adding task:', error));
}

function loadTasks() {
    const taskList = document.getElementById('taskList');

    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const listItem = createTaskListItem(task);
                taskList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading tasks:', error));
}

function createTaskListItem(task) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
    <span>${task.title}</span>
    <button onclick="editTask('${task._id}')">Edit</button>
    <button onclick="deleteTask('${task._id}')">Delete</button>
  `;
    return listItem;
}

function editTask(taskId) {
    const taskTitle = prompt('Enter new task title:');
    const taskDescription = prompt('Enter new task description:');

    if (taskTitle === null || taskDescription === null) {
        return; // User canceled
    }

    const updatedTask = {
        title: taskTitle,
        description: taskDescription,
    };

    fetch(`/tasks/${taskId}`, {
        method: 'PUT', // Use PUT for updating
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Task updated:', data);
            loadTasks();
        })
        .catch(error => console.error('Error updating task:', error));
}

function deleteTask(taskId) {
    fetch(`/tasks/${taskId}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Task deleted:', data);
            loadTasks();
        })
        .catch(error => console.error('Error deleting task:', error));
}
