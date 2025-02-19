


// Firebase config
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

document.getElementById('email').addEventListener('input', validateEmail);
document.getElementById('password').addEventListener('input', validatePassword);

document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset previous error messages
    document.getElementById('email').classList.remove('is-invalid');
    document.getElementById('password').classList.remove('is-invalid');
    document.getElementById('emailError').style.display = 'none';
    document.getElementById('passwordError').style.display = 'none';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validate email and password before Firebase sign-up
    if (validateEmail() && validatePassword()) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            // Success: Use SweetAlert to show a success message
            Swal.fire({
                title: 'Success!',
                text: 'Account created successfully!',
                icon: 'success',
                confirmButtonText: 'OK',
                background: '#1c1c1c',  // Dark background for consistency with your dark theme
                color: '#fff',  // White text
                confirmButtonColor: '#2575fc', // Matching button color
            }).then(() => {
                // Redirect after confirmation
                window.location.href = 'signin.html';
            });
        } catch (error) {
            // Error: Use SweetAlert to show an error message
            Swal.fire({
                title: 'Error!',
                text: 'Error signing up: ' + error.message,
                icon: 'error',
                confirmButtonText: 'Try Again',
                background: '#1c1c1c',  // Dark background for consistency with your dark theme
                color: '#fff',  // White text
                confirmButtonColor: '#e74c3c',  // Red button color for error
            });
        }
    }
});

// Email validation function
function validateEmail() {
    const email = document.getElementById('email').value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailField = document.getElementById('email');
    const emailError = document.getElementById('emailError');

    if (!emailPattern.test(email)) {
        emailField.classList.add('is-invalid');
        emailError.style.display = 'block';
        return false;
    } else {
        emailField.classList.remove('is-invalid');
        emailError.style.display = 'none';
        return true;
    }
}

// Password validation function
function validatePassword() {
    const password = document.getElementById('password').value;
    const passwordField = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');

    if (password.length < 6) {
        passwordField.classList.add('is-invalid');
        passwordError.style.display = 'block';
        return false;
    } else {
        passwordField.classList.remove('is-invalid');
        passwordError.style.display = 'none';
        return true;
    }
}
