// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDzFzHcwjwKrSXRw2keAjHivnxEe-Gc80k",
    authDomain: "studyplanning-8c226.firebaseapp.com",
    projectId: "studyplanning-8c226",
    storageBucket: "studyplanning-8c226.firebasestorage.app",
    messagingSenderId: "674857280835",
    appId: "1:674857280835:web:14787eb744a710eebe3bf6"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
const taskRow = document.getElementById('taskRow');
const searchBar = document.getElementById('searchBar');
const signOutBtn = document.getElementById('signOutBtn');

// Sign Out User
signOutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
        window.location.href = 'signin.html'; 
    } catch (error) {
        alert('Error signing out: ' + error.message);
    }
});

// Check if user is authenticated
auth.onAuthStateChanged(async (user) => {
    if (user) {
        signOutBtn.style.display = 'block'; 
        loadTasks(); 
    } else {
        window.location.href = 'signin.html'; 
    }
});

// Add Task
addBtn.addEventListener('click', async () => {
    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskDate = document.getElementById('taskDate').value;
    const taskTime = document.getElementById('taskTime').value;

    if (taskName && taskDate && taskTime) {
        await db.collection('tasks').add({
            name: taskName,
            description: taskDescription,
            date: taskDate,
            time: taskTime,
            userId: auth.currentUser.uid 
        });

        resetForm();
    }
});

// Edit Task
async function editTask(id) {
    const doc = await db.collection('tasks').doc(id).get();
    const task = doc.data();

    document.getElementById('taskID').value = id;
    document.getElementById('taskName').value = task.name;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskDate').value = task.date;
    document.getElementById('taskTime').value = task.time;

    addBtn.classList.add('d-none');
    updateBtn.classList.remove('d-none');
}

// Update Task
updateBtn.addEventListener('click', async () => {
    const id = document.getElementById('taskID').value;
    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskDate = document.getElementById('taskDate').value;
    const taskTime = document.getElementById('taskTime').value;

    if (id && taskName && taskDescription && taskDate && taskTime) {
        await db.collection('tasks').doc(id).update({
            name: taskName,
            description: taskDescription,
            date: taskDate,
            time: taskTime
        });

        resetForm();
    }
});

// Delete Task
async function deleteTask(id) {
    // SweetAlert2 confirmation dialog
    const { isConfirmed } = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
    });

    // If user confirms, delete the task
    if (isConfirmed) {
        try {
            // Perform the deletion from Firebase Firestore
            await db.collection('tasks').doc(id).delete();
            Swal.fire(
                'Deleted!',
                'Your task has been deleted.',
                'success'
            );
        } catch (error) {
            Swal.fire(
                'Error!',
                'There was a problem deleting the task.',
                'error'
            );
        }
    }
}


// Reset Form
function resetForm() {
    document.getElementById('taskID').value = '';
    document.getElementById('taskName').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskDate').value = '';
    document.getElementById('taskTime').value = '';

    addBtn.classList.remove('d-none');
    updateBtn.classList.add('d-none');
}

// Load tasks for the logged-in user
function loadTasks() {
    db.collection('tasks').where('userId', '==', auth.currentUser.uid)
        .orderBy('date') 
        .onSnapshot(querySnapshot => {
            taskRow.innerHTML = ''; 

            querySnapshot.forEach(doc => {
                const task = doc.data();
                const taskCard = document.createElement('div');
                taskCard.className = 'col-md-4';
                taskCard.innerHTML = `
                    <div class="card p-3">
                        <div class="card-body">
                            <h5 class="card-title text-primary">${task.name}</h5>
                            <p class="card-text">${task.description}</p>
                            <p class="card-text">Deadline: ${task.date} at ${task.time}</p>
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-outline-primary btn-sm" onclick="editTask('${doc.id}')">Edit</button>
                                <button class="btn btn-outline-danger btn-sm" onclick="deleteTask('${doc.id}')">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
                taskRow.appendChild(taskCard);
            });
        });
}

// Search tasks
searchBar.addEventListener('input', () => {
    const query = searchBar.value.toLowerCase();

    db.collection('tasks')
        .where('userId', '==', auth.currentUser.uid) 
        .onSnapshot(querySnapshot => {
            const filteredTasks = [];
            querySnapshot.forEach(doc => {
                const task = doc.data();
                if (task.name.toLowerCase().includes(query) || task.description.toLowerCase().includes(query)) {
                    filteredTasks.push({ id: doc.id, ...task });
                }
            });
            renderTasks(filteredTasks); 
        });
});

// Function to render tasks
function renderTasks(filteredTasks) {
    taskRow.innerHTML = ''; 
    filteredTasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = 'col-md-4';
        taskCard.innerHTML = `
            <div class="card p-3">
                <div class="card-body">
                    <h5 class="card-title text-primary">${task.name}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text">Deadline: ${task.date} at ${task.time}</p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-outline-primary btn-sm" onclick="editTask('${task.id}')">Edit</button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteTask('${task.id}')">Delete</button>
                    </div>
                </div>
            </div>
        `;
        taskRow.appendChild(taskCard);
    });
}
