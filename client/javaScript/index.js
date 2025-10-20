// Data for testing
import { myJobPostList } from "./data.js";

// Working on UI interactive
const jobListingContainer = document.querySelector(".job-list-container")
const jobDetailPopupContainer = document.querySelector(".job-detail-container-popup")
const closejobPopupContainerBtn = document.querySelector(".close-popup")
const settingCandidateScreen = document.querySelector(".settingCandidateScreen")
const closeSidebar = document.querySelector(".closeSidebar")
const mainContent = document.querySelector(".main-content")
const CandidateScreen = document.getElementById("Candidate-Screen")
const popJobDetail = document.querySelector(".popJobDetail")

popJobDetail.addEventListener("click", () => {
    jobListingContainer.classList.add("hidden");
    jobDetailPopupContainer.classList.remove("hidden");
})

closejobPopupContainerBtn.addEventListener("click", () => {
    jobListingContainer.classList.remove("hidden");
    jobDetailPopupContainer.classList.add("hidden");
})


// render ui

// settingCandidateBtn 
CandidateScreen.addEventListener("click", (e) => {
    const btn = e.target.closest(".settingCandidateBtn");
    if (!btn) return; // click wasn’t on the button

    const li = btn.closest("li");
    const { id, name, email } = li.dataset;

    // open sidebar
    settingCandidateScreen.classList.remove("w-[0]");
    settingCandidateScreen.classList.add("w-[40vw]");
    mainContent.classList.add("opacity-50");

    // inject sidebar content
    settingCandidateScreen.innerHTML = `
        <button class="closeSidebar text-white p-2 font-bold bg-black">Close</button>
        <div class="p-4 text-white">
            <h2 class="text-xl font-bold mb-2">${name}</h2>
            <p>Email: ${email}</p>
            <p>ID: ${id}</p>
        </div>
    `;

    // handle close
    const closeSidebar = settingCandidateScreen.querySelector(".closeSidebar");
    closeSidebar.addEventListener("click", () => {
        settingCandidateScreen.classList.remove("w-[40vw]");
        settingCandidateScreen.classList.add("w-[0]");
        mainContent.classList.remove("opacity-50");
    });
});

renderCandidate();

function renderCandidate() {
    const Candidates = myJobPostList[0].applicants;
    let candidates = '';

    Candidates.forEach((candidate) => {
        candidates += `
            <li class="p-3 sm:p-4 border-double border-2 rounded-lg hover:scale-102 transition duration-300 ease-in-out"
                                data-id="${candidate.candidateID}" data-name="${candidate.candidateName}" data-email="${candidate.candidateEmail}">
                                <div class="flex items-center justify-between flex-row">
                                    <div class="flex items-center basis-4/9">
                                        <div class="shrink-0">
                                            <img class="w-10 h-10  rounded-full" src="${candidate.candidatePhoto}" alt="Neil image">
                                        </div>
                                        <div class="flex-1 min-w-0 ms-4">
                                            <p class="text-sm font-medium text-gray-900 truncate ">
                                                ${candidate.candidateName}
                                            </p>
                                            <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                                                ${candidate.candidateEmail}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="basis-2/9">
                                        <p>10/05/2025</p>
                                    </div>
                                    <div class="basis-2/9">
                                        <p><span class="text-${candidate.candidateStatus[1]}-500 bg-${candidate.candidateStatus[1]}-100 p-2 rounded-lg font-bold">${candidate.candidateStatus[0]}</span>
                                        </p>
                                    </div>
                                    <div class="basis-1/9 flex justify-end">
                                        <button type="button"
                                            class="rounded-md p-2 inline-flex items-center justify-center text-black hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 close-popup self-end settingCandidateBtn">
                                            <span class="sr-only">Actions Button</span>
                                            <i class="fa-solid fa-bars"></i>
                                        </button>
                                    </div>
                                </div>
                            </li>
        `
    })

    CandidateScreen.innerHTML += candidates;
}


// Working on Fecthing and Updating UI