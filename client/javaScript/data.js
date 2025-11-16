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
                // Merge: start with defaults, then add any stored jobs that aren't defaults
                const result = [...defaultJobPosts];
                const defaultKeys = new Set(
                    defaultJobPosts.map(job => `${job.company}-${job.role}`)
                );
                
                parsed.forEach(job => {
                    const key = `${job.company}-${job.role}`;
                    if (!defaultKeys.has(key)) {
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

// Save to localStorage
export function saveJobPosts() {
    try {
        localStorage.setItem('jobPosts', JSON.stringify(myJobPostList));
    } catch (e) {
        console.error('Error saving job posts to localStorage:', e);
    }
}
