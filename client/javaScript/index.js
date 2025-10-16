// Working on UI interactive
const jobListingContainer = document.querySelector(".job-list-container")
const jobDetailPopupContainer = document.querySelector(".job-detail-container-popup")
const closejobPopupContainerBtn = document.querySelector(".close-popup")


function popJobDetail() {
    jobListingContainer.classList.add("hidden");
    jobDetailPopupContainer.classList.remove("hidden");
}

closejobPopupContainerBtn.addEventListener("click", () => {
    jobListingContainer.classList.remove("hidden");
    jobDetailPopupContainer.classList.add("hidden");
})

// Working on Fecthing and Updating UI