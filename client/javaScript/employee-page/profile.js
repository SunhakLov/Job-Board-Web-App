// Profile Script
document.addEventListener('DOMContentLoaded', () => {
    // Image upload functionality
    const changeImageBtn = document.getElementById('changeImageBtn');
    const imageUpload = document.getElementById('imageUpload');
    const profileImage = document.getElementById('profileImage');
    const profileForm = document.getElementById('profileForm');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // Check if elements exist
    if (!changeImageBtn || !imageUpload || !profileImage || !profileForm || !saveBtn || !cancelBtn) {
        console.error('Required DOM elements not found');
        return;
    }

    changeImageBtn.addEventListener('click', () => {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profileImage.src = event.target.result;
                // Save profile image to localStorage
                try {
                    let profileData = {};
                    const saved = localStorage.getItem('employeeProfile');
                    if (saved) {
                        profileData = JSON.parse(saved);
                    }
                    profileData.profileImage = event.target.result;
                    localStorage.setItem('employeeProfile', JSON.stringify(profileData));
                } catch (e) {
                    console.warn('Could not save profile image:', e);
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // Load saved profile data on page load
    try {
        const saved = localStorage.getItem('employeeProfile');
        if (saved) {
            const profileData = JSON.parse(saved);

            // Load profile image
            if (profileData.profileImage) {
                profileImage.src = profileData.profileImage;
            } else {
                // Default image
                profileImage.src = './images/default.jpg';
            }

            // Load form fields
            if (profileData.firstName) document.getElementById('firstName').value = profileData.firstName;
            if (profileData.lastName) document.getElementById('lastName').value = profileData.lastName;
            if (profileData.email) document.getElementById('email').value = profileData.email;
            if (profileData.phone) document.getElementById('phone').value = profileData.phone;
            if (profileData.location) document.getElementById('location').value = profileData.location;
            if (profileData.linkedin) document.getElementById('linkedin').value = profileData.linkedin;
            if (profileData.github) document.getElementById('github').value = profileData.github;
            if (profileData.portfolio) document.getElementById('portfolio').value = profileData.portfolio;
        } else {
            // Set default profile image if no saved data
            profileImage.src = './images/default.jpg';
        }
    } catch (e) {
        console.warn('Could not load profile data:', e);
        // Set default profile image on error
        profileImage.src = './images/default.jpg';
    }

    // Form submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(profileForm);
        const profileData = {};
        formData.forEach((value, key) => {
            profileData[key] = value;
        });

        // Save profile image if it exists
        if (profileImage.src && profileImage.src !== 'https://flowbite.com/docs/images/logo.svg') {
            profileData.profileImage = profileImage.src;
        }

        // Save to localStorage
        try {
            localStorage.setItem('employeeProfile', JSON.stringify(profileData));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }

        // Simulate saving (in real app, this would send to server)
        console.log('Saving profile data:', profileData);

        // Show success message
        saveBtn.innerHTML = '<i class="fa-solid fa-check mr-2"></i>Saved!';
        saveBtn.classList.remove('bg-[#005030]', 'hover:bg-[#a4d65e]');
        saveBtn.classList.add('bg-green-500', 'hover:bg-green-600');

        setTimeout(() => {
            saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk mr-2"></i>Save Changes';
            saveBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
            saveBtn.classList.add('bg-[#005030]', 'hover:bg-[#a4d65e]');
        }, 2000);
    });

    cancelBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
            profileForm.reset();
            // Reset image to default
            profileImage.src = './images/default.jpg';
        }
    });
});

