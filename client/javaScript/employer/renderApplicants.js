import { myJobPostList } from "../data.js";

const displayNumberOfApplicants = document.querySelector("span.numberOfApplicants")
const CandidateScreen = document.getElementById("Candidate-Screen");

const settingCandidateScreen = document.querySelector(".settingCandidateScreen");
const mainContent = document.querySelector(".main-content");


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

// action btn
CandidateScreen.addEventListener("click", (e) => {
    const btn = e.target.closest(".settingCandidateBtn");
    if (!btn) return;

    const li = btn.closest("li");
    const { jobId, id, name, email, img, messages } = li.dataset;

    settingCandidateScreen.classList.remove("w-[0]");
    settingCandidateScreen.classList.add("w-[40vw]");
    mainContent.classList.add("opacity-50");

    settingCandidateScreen.innerHTML = `
        <button class="closeSidebar text-black p-2 m-4 rounded-lg font-bold bg-yellow-400">
            Close <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="text-black p-2 bg-white m-5 rounded-lg h-[85%] overflow-y-scroll">
            <div class="flex flex-col gap-10 m-5">
            
            <div class="flex flex-row items-center justify-start gap-8 m-4">
                <div>
                <img class="w-[120px] h-[120px] rounded-full border border-dashed p-2"
                    src="${img}" 
                    alt="${name}">
                </div>
                <div>
                <p class="text-xl font-bold mb-2">${name}</p>
                <p>Email: ${email}</p>
                </div>
            </div>

            <div class="textArea">
                <label for="message" class="block mb-2 text-sm font-medium text-black">Internal notes</label>
                <textarea id="message" rows="4"
                class="block p-5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                placeholder="Write your comment here ...">${messages || ""}</textarea>
            </div>

            <div class="settingbtn flex flex-col gap-3">
                <div class="flex flex-row justify-between gap-3">
                <button class="previewBtn bg-[#a4d65e] p-3 rounded-lg flex-1 hover:scale-105 active:translate-y-[2px] active:scale-95 transition-transform duration-150 ease-in-out">Preview Resume</button>
                <button class="bg-[#a4d65e] p-3 rounded-lg flex-1 hover:scale-105 active:translate-y-[2px] active:scale-95 transition-transform duration-150 ease-in-out"><a href="pdf/Sunhak_Lov_s_Resume${id}.pdf" download class="w-full h-full block text-center">
                    Download Resume
                    </a>
                </button>
                </div>
                <div class="flex flex-row justify-between gap-3">
                <button class="interviewBtn bg-[#a4d65e] p-3 rounded-lg flex-1 hover:scale-105 active:translate-y-[2px] active:scale-95 transition-transform duration-150 ease-in-out">Request Interview</button>
                <button class="rejectBtn bg-[#a4d65e] p-3 rounded-lg flex-1 hover:scale-105 active:translate-y-[2px] active:scale-95 transition-transform duration-150 ease-in-out">Reject</button>
                </div>
                <button class="offerBtn bg-[#a4d65e] p-3 rounded-lg flex-1 hover:scale-105 active:translate-y-[2px]  active:scale-95 transition-transform duration-150 ease-in-out">Offer</button>
                <button class="saveBtn bg-yellow-400 p-3 rounded-lg flex-1 hover:scale-105 active:translate-y-[2px] active:scale-95 transition-transform duration-150 ease-in-out">Save</button>
            </div>
            <div class = "resume opacity-0 max-h-0 transition-all duration-200 ease-in-out">
            <embed class="mx-auto mt-5 rounded-lg border" 
                    src="pdf/Sunhak_Lov_s_Resume${id}.pdf" 
                    width="600" height="375">
            </div>
            </div>
        </div>
`;


    settingCandidateScreen.dataset.currentId = id;

    const closeSidebar = settingCandidateScreen.querySelector(".closeSidebar");
    closeSidebar.addEventListener("click", () => {
        settingCandidateScreen.classList.remove("w-[40vw]");
        settingCandidateScreen.classList.add("w-[0]");
        mainContent.classList.remove("opacity-50");
        resumeElement.classList.add("hidden");
    });

    const resumeElement = settingCandidateScreen.querySelector(".resume");
    const previewBtn = settingCandidateScreen.querySelector(".previewBtn");
    previewBtn.addEventListener("click", () => {
        resumeElement.classList.toggle("opacity-0");
        resumeElement.classList.toggle("max-h-0");
    });

    const interviewBtn = settingCandidateScreen.querySelector(".interviewBtn");
    interviewBtn.addEventListener("click", () => {
        const candidateId = settingCandidateScreen.dataset.currentId;
        const job = myJobPostList[jobId];
        job.applicants.forEach((applicant) => {
            if (applicant.candidateID === candidateId) {
                applicant.candidateStatus = ["Interview", "yellow"];
            }
        });

        interviewBtn.classList.add("bg-yellow-200", "scale-95");
        interviewBtn.textContent = "Requested";

        interviewBtn.disabled = true;

        setTimeout(() => {
            interviewBtn.classList.remove("bg-yellow-200", "scale-95");
            interviewBtn.disabled = false;
            interviewBtn.textContent = "Request Interview";
            CandidateScreen.innerHTML = "";
            renderCandidate(jobId);
        }, 800);
    })

    const rejectBtn = settingCandidateScreen.querySelector(".rejectBtn");
    rejectBtn.addEventListener("click", () => {
        const candidateId = settingCandidateScreen.dataset.currentId;
        const job = myJobPostList[jobId];
        job.applicants.forEach((applicant) => {
            if (applicant.candidateID === candidateId) {
                applicant.candidateStatus = ["Reject", "red"];
            }
        });

        rejectBtn.classList.add("bg-red-300", "scale-95");
        rejectBtn.textContent = "Rejected";

        rejectBtn.disabled = true;

        setTimeout(() => {
            rejectBtn.classList.remove("bg-red-300", "scale-95");
            rejectBtn.disabled = false;
            rejectBtn.textContent = "Reject";
            CandidateScreen.innerHTML = "";
            renderCandidate(jobId);
        }, 800);
    });


    const offerBtn = settingCandidateScreen.querySelector(".offerBtn");
    offerBtn.addEventListener("click", () => {
        const candidateId = settingCandidateScreen.dataset.currentId;
        const job = myJobPostList[jobId];
        job.applicants.forEach((applicant) => {
            if (applicant.candidateID === candidateId) {
                applicant.candidateStatus = ["Offer", "green"];
            }
        });

        offerBtn.classList.add("bg-green-200", "scale-95");
        offerBtn.textContent = "Offered";

        offerBtn.disabled = true;

        setTimeout(() => {
            offerBtn.classList.remove("bg-green-200", "scale-95");
            offerBtn.disabled = false;
            offerBtn.textContent = "Offer";
            CandidateScreen.innerHTML = "";
            renderCandidate(jobId);
        }, 800);
    });

    const saveBtn = settingCandidateScreen.querySelector(".saveBtn");
    const saveComment = settingCandidateScreen.querySelector("#message");
    saveBtn.addEventListener("click", () => {
        const candidateId = settingCandidateScreen.dataset.currentId;
        let textNote = "";
        const job = myJobPostList[jobId];
        job.applicants.forEach((applicant) => {
            if (applicant.candidateID === candidateId) {
                applicant.candidateNote = saveComment.value;
            }
        });

        saveBtn.classList.add("bg-yellow-200", "scale-95");
        saveBtn.textContent = "Saved";

        saveBtn.disabled = true;

        setTimeout(() => {
            saveBtn.classList.remove("bg-yellow-200", "scale-95");
            saveBtn.disabled = false;
            saveBtn.textContent = "Save";
            CandidateScreen.innerHTML = "";
            renderCandidate(jobId);
        }, 800);
    });
});

