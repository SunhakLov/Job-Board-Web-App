// Working on UI interactive
const jobListingContainer = document.querySelector(".job-list-container")
const jobDetailPopupContainer = document.querySelector(".job-detail-container-popup")
const closejobPopupContainerBtn = document.querySelector(".close-popup")
const settingCandidateBtns = document.querySelectorAll(".settingCandidateBtn")
const settingCandidateScreen = document.querySelector(".settingCandidateScreen")
const closeSidebar = document.querySelector(".closeSidebar")
const mainContent = document.querySelector(".main-content");
const candidateList = document.querySelector("ul[role='list']");

function popJobDetail() {
    jobListingContainer.classList.add("hidden");
    jobDetailPopupContainer.classList.remove("hidden");
}

closejobPopupContainerBtn.addEventListener("click", () => {
    jobListingContainer.classList.remove("hidden");
    jobDetailPopupContainer.classList.add("hidden");
})

settingCandidateBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const li = btn.closest("li");
        const { id, name, email } = li.dataset;
        settingCandidateScreen.classList.remove("w-[0]");
        settingCandidateScreen.classList.add("w-[40vw]");
        mainContent.classList.add("opacity-50");
        settingCandidateScreen.innerHTML = "";
        settingCandidateScreen.insertAdjacentHTML("beforeend", `
            <button class="closeSidebar text-white p-2 font-bold bg-black">Close</button>
            <p>hi user with ${id} & named "${name}" & email is ${email}</p>
        `);
        const closeSidebar = settingCandidateScreen.querySelector(".closeSidebar");
        closeSidebar.addEventListener("click", () => {
            const screen = closeSidebar.parentElement;
            screen.classList.remove("w-[40vw]");
            screen.classList.add("w-[0]");
            mainContent.classList.remove("opacity-50");
        });
    })
})

// closeSidebar.addEventListener("click", () => {
//     const screen = closeSidebar.parentElement;
//     screen.classList.remove("w-[40vw]");
//     screen.classList.add("w-[0]");
//     mainContent.classList.remove("opacity-50");
// })

// Working on Fecthing and Updating UI