// =============================================================
// IMPORTS
// =============================================================
import { myJobPostList } from "./data.js";


// =============================================================
// DOM ELEMENT REFERENCES
// =============================================================
const jobListingContainer = document.querySelector(".job-list-container");
const jobDetailPopupContainer = document.querySelector(".job-detail-container-popup");
const closejobPopupContainerBtn = document.querySelector(".close-popup");
const settingCandidateScreen = document.querySelector(".settingCandidateScreen");
const mainContent = document.querySelector(".main-content");
const CandidateScreen = document.getElementById("Candidate-Screen");
const popJobDetail = document.querySelector(".popJobDetail");


// =============================================================
// JOB DETAIL TOGGLE LOGIC
// =============================================================

// → Open job detail popup when employer clicks on a job
popJobDetail.addEventListener("click", () => {
    jobListingContainer.classList.add("hidden");
    jobDetailPopupContainer.classList.remove("hidden");
});

// → Close popup and go back to job list
closejobPopupContainerBtn.addEventListener("click", () => {
    jobListingContainer.classList.remove("hidden");
    jobDetailPopupContainer.classList.add("hidden");
});

// → End of job detail toggle logic



// =============================================================
// CANDIDATE RENDERING
// =============================================================

// Initialize candidate UI
renderCandidate();

/**
 * Renders all candidates from job data (temporary test data)
 */
function renderCandidate() {
    const Candidates = myJobPostList[0].applicants;
    let candidateListHTML = "";

    Candidates.forEach((candidate) => {
        candidateListHTML += `
            <li class="p-3 sm:p-4 border-double border-2 rounded-lg hover:scale-102 transition duration-300 ease-in-out"
                data-id="${candidate.candidateID}" 
                data-name="${candidate.candidateName}" 
                data-email="${candidate.candidateEmail}">
                
                <div class="flex items-center justify-between flex-row">
                    
                    <!-- Candidate info -->
                    <div class="flex items-center basis-4/9">
                        <div class="shrink-0">
                            <img class="w-10 h-10 rounded-full" 
                                 src="${candidate.candidatePhoto}" 
                                 alt="${candidate.candidateName}">
                        </div>
                        <div class="flex-1 min-w-0 ms-4">
                            <p class="text-sm font-medium text-gray-900 truncate">
                                ${candidate.candidateName}
                            </p>
                            <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                ${candidate.candidateEmail}
                            </p>
                        </div>
                    </div>

                    <!-- Date applied -->
                    <div class="basis-2/9">
                        <p>10/05/2025</p>
                    </div>

                    <!-- Candidate status -->
                    <div class="basis-2/9">
                        <p>
                            <span class="text-${candidate.candidateStatus[1]}-500 
                                           bg-${candidate.candidateStatus[1]}-100 
                                           p-2 rounded-lg font-bold">
                                ${candidate.candidateStatus[0]}
                            </span>
                        </p>
                    </div>

                    <!-- Action button -->
                    <div class="basis-1/9 flex justify-end">
                        <button type="button"
                            class="rounded-md p-2 inline-flex items-center justify-center 
                                   text-black hover:text-gray-500 hover:bg-gray-100 
                                   focus:outline-none focus:ring-2 focus:ring-inset 
                                   focus:ring-indigo-500 settingCandidateBtn">
                            <span class="sr-only">Actions Button</span>
                            <i class="fa-solid fa-bars"></i>
                        </button>
                    </div>
                </div>
            </li>
        `;
    });

    CandidateScreen.innerHTML += candidateListHTML;
}



// =============================================================
// CANDIDATE ACTION SIDEBAR INTERACTIONS
// =============================================================

/**
 * Handles all dynamic clicks on candidate action buttons
 * Uses event delegation for future-rendered candidates
 */
CandidateScreen.addEventListener("click", (e) => {
    const btn = e.target.closest(".settingCandidateBtn");
    if (!btn) return; // Ignore clicks outside the button

    // Get candidate data from <li>
    const li = btn.closest("li");
    const { id, name, email } = li.dataset;

    // --- Open sidebar ---
    settingCandidateScreen.classList.remove("w-[0]");
    settingCandidateScreen.classList.add("w-[40vw]");
    mainContent.classList.add("opacity-50");

    // --- Inject sidebar content dynamically ---
    settingCandidateScreen.innerHTML = `
        <button class="closeSidebar text-white p-2 font-bold bg-black">Close</button>
        <div class="p-4 text-white">
            <h2 class="text-xl font-bold mb-2">${name}</h2>
            <p>Email: ${email}</p>
            <p>ID: ${id}</p>
        </div>
    `;

    // --- Handle sidebar close ---
    const closeSidebar = settingCandidateScreen.querySelector(".closeSidebar");
    closeSidebar.addEventListener("click", () => {
        settingCandidateScreen.classList.remove("w-[40vw]");
        settingCandidateScreen.classList.add("w-[0]");
        mainContent.classList.remove("opacity-50");
    });
});

// → End of candidate action sidebar logic



// =============================================================
// 🚀 FUTURE TODO (For clarity)
// =============================================================

// ✅ Working on Fetching and Updating UI
//    - Fetch job post data from backend
//    - Update candidate status dynamically
//    - Integrate email notification system
//    - Add note-taking & GitHub/Resume preview in sidebar
