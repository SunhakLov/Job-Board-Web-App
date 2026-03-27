import { authenticateUser, reloadUsers } from '../data.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    let selectedUserType = 'candidate'; // Default to candidate

    const candidateBtn = document.getElementById('candidateBtn');
    const employerBtn = document.getElementById('employerBtn');
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');

    // Check if elements exist
    if (!candidateBtn || !employerBtn || !loginForm) {
        console.error('Required DOM elements not found');
        return;
    }

    // User type selection
    candidateBtn.addEventListener('click', () => {
        selectedUserType = 'candidate';
        candidateBtn.classList.remove('border-gray-300', 'bg-white', 'text-gray-700');
        candidateBtn.classList.add('border-blue-500', 'bg-blue-100', 'text-blue-700');
        employerBtn.classList.remove('border-blue-500', 'bg-blue-100', 'text-blue-700');
        employerBtn.classList.add('border-gray-300', 'bg-white', 'text-gray-700');
    });

    employerBtn.addEventListener('click', () => {
        selectedUserType = 'employer';
        employerBtn.classList.remove('border-gray-300', 'bg-white', 'text-gray-700');
        employerBtn.classList.add('border-blue-500', 'bg-blue-100', 'text-blue-700');
        candidateBtn.classList.remove('border-blue-500', 'bg-blue-100', 'text-blue-700');
        candidateBtn.classList.add('border-gray-300', 'bg-white', 'text-gray-700');
    });

    // Form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Validation
        if (!email) {
            alert('Please enter your email!');
            return;
        }

        if (!password) {
            alert('Please enter your password!');
            return;
        }

        // Reload users to get latest data
        reloadUsers();

        // Authenticate user
        const result = authenticateUser(email, password);

        if (result.success) {
            // Check if user role matches selected type
            if (result.user.role !== selectedUserType) {
                alert(`This account is registered as an ${result.user.role}. Please select the correct user type.`);
                return;
            }

            // Store user info in localStorage (without password)
            localStorage.setItem('currentUser', JSON.stringify(result.user));
            localStorage.setItem('userType', selectedUserType);

            // Redirect based on user type
            if (selectedUserType === 'candidate') {
                window.location.href = 'employee-profile.html';
            } else {
                window.location.href = 'employer-candidate.html';
            }
        } else {
            alert(result.message || 'Invalid email or password. Please try again.');
        }
    });
});