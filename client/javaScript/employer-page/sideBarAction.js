import { renderCandidate } from "./renderApplicants.js";
import { myJobPostList, saveJobPosts } from "../data.js";

const CandidateScreen = document.getElementById("Candidate-Screen");
const settingCandidateScreen = document.querySelector(".settingCandidateScreen");
const mainContent = document.querySelector(".main-content");

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

        // Save to localStorage
        saveJobPosts();

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

        // Save to localStorage
        saveJobPosts();

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

        // Save to localStorage
        saveJobPosts();

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

        // Save to localStorage
        saveJobPosts();

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