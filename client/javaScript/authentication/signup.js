import { registerUser } from '../data.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    let selectedUserType = 'candidate'; // Default to candidate

    const candidateBtn = document.getElementById('candidateBtn');
    const employerBtn = document.getElementById('employerBtn');
    const signupForm = document.getElementById('signupForm');
    const signupBtn = document.getElementById('signupBtn');

    // Check if elements exist
    if (!candidateBtn || !employerBtn || !signupForm || !signupBtn) {
        console.error('Required DOM elements not found');
        return;
    }

    // User type selection
    candidateBtn.addEventListener('click', () => {
        selectedUserType = 'candidate';
        candidateBtn.classList.remove('border-gray-300', 'bg-white', 'text-gray-700');
        candidateBtn.classList.add('border-green-500', 'bg-green-100', 'text-green-700');
        employerBtn.classList.remove('border-green-500', 'bg-green-100', 'text-green-700');
        employerBtn.classList.add('border-gray-300', 'bg-white', 'text-gray-700');
    });

    employerBtn.addEventListener('click', () => {
        selectedUserType = 'employer';
        employerBtn.classList.remove('border-gray-300', 'bg-white', 'text-gray-700');
        employerBtn.classList.add('border-green-500', 'bg-green-100', 'text-green-700');
        candidateBtn.classList.remove('border-green-500', 'bg-green-100', 'text-green-700');
        candidateBtn.classList.add('border-gray-300', 'bg-white', 'text-gray-700');
    });

    // Form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (!fullName) {
            alert('Please enter your full name!');
            return;
        }

        if (!email) {
            alert('Please enter your email!');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Disable button during registration
        signupBtn.disabled = true;
        signupBtn.textContent = 'Signing Up...';

        // Register user
        const result = registerUser(fullName, email, password, selectedUserType);

        if (result.success) {
            // Store user info in localStorage (without password)
            localStorage.setItem('currentUser', JSON.stringify({
                id: result.user.id,
                fullName: result.user.fullName,
                email: result.user.email,
                role: result.user.role
            }));
            localStorage.setItem('userType', selectedUserType);

            // Redirect based on user type
            if (selectedUserType === 'candidate') {
                window.location.href = 'employee-profile.html';
            } else {
                window.location.href = 'employer-candidate.html';
            }
        } else {
            alert(result.message || 'Registration failed. Please try again.');
            signupBtn.disabled = false;
            signupBtn.textContent = 'Sign Up';
        }
    });
});