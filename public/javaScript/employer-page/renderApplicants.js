import { myJobPostList } from "../data.js";

const displayNumberOfApplicants = document.querySelector("span.numberOfApplicants")
const CandidateScreen = document.getElementById("Candidate-Screen");


export function renderApplicantsElement(jobId) {

    displayNumberOfApplicants.innerHTML = myJobPostList[jobId].numberOfApplicants;

}

export function renderCandidate(jobId) {
    const Candidates = myJobPostList[jobId].applicants;
    let candidateListHTML = "";

    Candidates.forEach((candidate) => {
        candidateListHTML += `
            <li class="p-3 sm:p-4 border-double border-2 rounded-lg hover:scale-102 transition duration-300 ease-in-out"
                data-job-id="${jobId}"
                data-id="${candidate.candidateID}" 
                data-name="${candidate.candidateName}" 
                data-email="${candidate.candidateEmail}"
                data-img="${candidate.candidatePhoto}"
                data-messages="${candidate.candidateNote}">
                
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

    CandidateScreen.innerHTML = candidateListHTML;
}



