// Default job posts
const defaultJobPosts = [
    {
        company: "Meta",
        logoImg: "./images/logo/meta.png",
        role: "Software Engineer",
        paidRate: 30,
        typeEmployment: "Internship",
        startDate: "Nov 2",
        endDate: "Dec 30",
        numberOfApplicants: 3,
        applicants: [
            {
                candidateID: "123",
                candidateName: "CatMeme",
                candidateEmail: "CatMeme@cpp.edu",
                candidateStatus: ["Reject", "red"],
                candidatePhoto: "images/cat1.jpg",
                candidateNote: ""
            },
            {
                candidateID: "456",
                candidateName: "DogMeme",
                candidateEmail: "DogMeme@cpp.edu",
                candidateStatus: ["Interview", "yellow"],
                candidatePhoto: "images/dog1.jpg",
                candidateNote: ""
            },
            {
                candidateID: "789",
                candidateName: "Ryan",
                candidateEmail: "Ryan@cpp.edu",
                candidateStatus: ["Offer", "green"],
                candidatePhoto: "images/ryan-trahan-smile.jpg",
                candidateNote: ""
            }
        ]
    },
    {
        company: "Google",
        logoImg: "./images/logo/google.jpg",
        role: "Frontend Developer",
        paidRate: 35,
        typeEmployment: "Co-op",
        startDate: "Jan 10",
        endDate: "Apr 15",
        numberOfApplicants: 4,
        applicants: [
            {
                candidateID: "123",
                candidateName: "CatMeme2",
                candidateEmail: "CatMeme@cpp.edu",
                candidateStatus: ["Reject", "red"],
                candidatePhoto: "images/cat1.jpg",
                candidateNote: ""
            },
            {
                candidateID: "456",
                candidateName: "DogMeme2",
                candidateEmail: "DogMeme@cpp.edu",
                candidateStatus: ["Interview", "yellow"],
                candidatePhoto: "images/dog1.jpg",
                candidateNote: ""
            },
            {
                candidateID: "789",
                candidateName: "Ryan2",
                candidateEmail: "Ryan@cpp.edu",
                candidateStatus: ["Offer", "green"],
                candidatePhoto: "images/ryan-trahan-smile.jpg",
                candidateNote: ""
            },
            {
                candidateID: "1235",
                candidateName: "Sunhak",
                candidateEmail: "sunhak@cpp.edu",
                candidateStatus: ["Reject", "red"],
                candidatePhoto: "images/ryan-trahan-smile.jpg",
                candidateNote: ""
            }
        ]
    },
    {
        company: "Apple",
        logoImg: "./images/logo/apple.jpg",
        role: "iOS Developer",
        paidRate: 40,
        typeEmployment: "Full-time",
        startDate: "Feb 5",
        endDate: "Aug 1",
        numberOfApplicants: 2,
        applicants: [
            {
                candidateID: "111",
                candidateName: "DogMeme3",
                candidateEmail: "dogmeme3@cpp.edu",
                candidateStatus: ["Interview", "yellow"],
                candidatePhoto: "images/dog1.jpg",
                candidateNote: ""
            },
            {
                candidateID: "222",
                candidateName: "Ryan3",
                candidateEmail: "ryan3@cpp.edu",
                candidateStatus: ["Offer", "green"],
                candidatePhoto: "images/ryan-trahan-smile.jpg",
                candidateNote: ""
            }
        ]
    },
    {
        company: "Amazon",
        logoImg: "./images/logo/amazon.jpg",
        role: "Backend Engineer",
        paidRate: 33,
        typeEmployment: "Part-time",
        startDate: "Mar 1",
        endDate: "Jun 20",
        numberOfApplicants: 3,
        applicants: [
            {
                candidateID: "321",
                candidateName: "CatMeme3",
                candidateEmail: "catmeme3@cpp.edu",
                candidateStatus: ["Reject", "red"],
                candidatePhoto: "images/cat1.jpg",
                candidateNote: ""
            },
            {
                candidateID: "654",
                candidateName: "Ryan4",
                candidateEmail: "ryan4@cpp.edu",
                candidateStatus: ["Interview", "yellow"],
                candidatePhoto: "images/ryan-trahan-smile.jpg",
                candidateNote: ""
            },
            {
                candidateID: "987",
                candidateName: "DogMeme4",
                candidateEmail: "dogmeme4@cpp.edu",
                candidateStatus: ["Offer", "green"],
                candidatePhoto: "images/dog1.jpg",
                candidateNote: ""
            }
        ]
    },
    {
        company: "Netflix",
        logoImg: "./images/logo/netflix.png",
        role: "UI/UX Designer",
        paidRate: 28,
        typeEmployment: "Internship",
        startDate: "May 10",
        endDate: "Aug 25",
        numberOfApplicants: 2,
        applicants: [
            {
                candidateID: "888",
                candidateName: "CatMeme5",
                candidateEmail: "catmeme5@cpp.edu",
                candidateStatus: ["Interview", "yellow"],
                candidatePhoto: "images/cat1.jpg",
                candidateNote: ""
            },
            {
                candidateID: "999",
                candidateName: "DogMeme5",
                candidateEmail: "dogmeme5@cpp.edu",
                candidateStatus: ["Offer", "green"],
                candidatePhoto: "images/dog1.jpg",
                candidateNote: ""
            }
        ]
    }
];

// Load from localStorage or use default
function loadJobPosts() {
    const stored = localStorage.getItem('jobPosts');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // If we have stored data, use it (it includes defaults + new jobs)
            // But ensure we have at least the defaults
            if (parsed && parsed.length > 0) {
                // Create a map of default jobs for quick lookup
                const defaultKeys = new Set(
                    defaultJobPosts.map(job => `${job.company}-${job.role}`)
                );
                
                // Start with stored jobs (which may include modified defaults)
                const result = [];
                const processedKeys = new Set();
                
                // First, add all stored jobs (this includes modified defaults)
                parsed.forEach(job => {
                    const key = `${job.company}-${job.role}`;
                    result.push(job);
                    processedKeys.add(key);
                });
                
                // Then, add any default jobs that weren't in stored data
                defaultJobPosts.forEach(job => {
                    const key = `${job.company}-${job.role}`;
                    if (!processedKeys.has(key)) {
                        result.push(job);
                    }
                });
                
                return result;
            }
            return defaultJobPosts;
        } catch (e) {
            console.error('Error parsing stored job posts:', e);
            return defaultJobPosts;
        }
    }
    return defaultJobPosts;
}

// Initialize job posts list
export const myJobPostList = loadJobPosts();

// Reload job posts from localStorage (useful when data might have changed)
// This modifies the existing array in place so all modules see the changes
export function reloadJobPosts() {
    const newData = loadJobPosts();
    // Clear existing array and add new data
    myJobPostList.length = 0;
    myJobPostList.push(...newData);
    return myJobPostList;
}

// Save to localStorage
export function saveJobPosts() {
    try {
        localStorage.setItem('jobPosts', JSON.stringify(myJobPostList));
    } catch (e) {
        console.error('Error saving job posts to localStorage:', e);
    }
}

// ==================== USER REGISTRATION & AUTHENTICATION ====================

// Default users (for testing/demo purposes)
const defaultUsers = [
    {
        id: '1',
        fullName: 'Ryan Trahan',
        email: 'ryan@cpp.edu',
        password: 'password123', // In production, this should be hashed
        role: 'candidate',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        fullName: 'Neil Sims',
        email: 'neil.sims@flowbite.com',
        password: 'password123', // In production, this should be hashed
        role: 'employer',
        createdAt: new Date().toISOString()
    }
];

// Load users from localStorage or use default
function loadUsers() {
    const stored = localStorage.getItem('users');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.length > 0) {
                // Merge defaults with stored users (avoid duplicates by email)
                const result = [...defaultUsers];
                const defaultEmails = new Set(defaultUsers.map(user => user.email.toLowerCase()));
                
                parsed.forEach(user => {
                    if (!defaultEmails.has(user.email.toLowerCase())) {
                        result.push(user);
                    }
                });
                
                return result;
            }
            return defaultUsers;
        } catch (e) {
            console.error('Error parsing stored users:', e);
            return defaultUsers;
        }
    }
    return defaultUsers;
}

// Initialize users list
export let usersList = loadUsers();

// Reload users from localStorage
export function reloadUsers() {
    usersList = loadUsers();
    return usersList;
}

// Save users to localStorage
export function saveUsers() {
    try {
        localStorage.setItem('users', JSON.stringify(usersList));
    } catch (e) {
        console.error('Error saving users to localStorage:', e);
    }
}

// Register a new user
export function registerUser(fullName, email, password, role) {
    // Check if user already exists
    const existingUser = usersList.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return { success: false, message: 'User with this email already exists' };
    }

    // Create new user
    const newUser = {
        id: Date.now().toString(),
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password, // In production, hash this password
        role: role, // 'candidate' or 'employer'
        createdAt: new Date().toISOString()
    };

    usersList.push(newUser);
    saveUsers();

    return { success: true, user: newUser };
}

// Authenticate user (login)
export function authenticateUser(email, password) {
    const user = usersList.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return { success: true, user: userWithoutPassword };
    }

    return { success: false, message: 'Invalid email or password' };
}

// Get user by email
export function getUserByEmail(email) {
    const user = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
}
