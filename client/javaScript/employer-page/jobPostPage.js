import { myJobPostList, saveJobPosts } from "../data.js";


const newJobPostBtn = document.getElementById("newJobPostBtn");
const popUp = document.getElementById("newJob");
const closeBtn = document.getElementById("closeBtn");
const cancelBtn = document.getElementById("cancelBtn");
const form = document.getElementById("jobPostForm");
const tableBody = document.getElementById("jobPostTableBody");
const submitButton = document.getElementById("submitButton");

function openPopUp() {
  popUp.classList.remove("hidden");
  popUp.classList.add("flex");
}

function closePopUp() {
  popUp.classList.add("hidden");
  popUp.classList.remove("flex");
}

// Format date from YYYY-MM-DD to "Mon DD" format
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString + "T00:00:00"); // Add time to avoid timezone issues
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}`;
}

function renderTable() {

  if (!tableBody) return;

  const rows = myJobPostList.map((job, index) => {
    return `
    <tr class="hover:bg-gray-50">
      <td class="px-4 py-3 font-semibold text-[#005030]">${job.company}</td>
      <td class="px-4 py-3">${job.role}</td>
      <td class="px-4 py-3">${job.paidRate}</td>
      <td class="px-4 py-3">${job.typeEmployment}</td>
      <td class="px-4 py-3">${job.startDate}</td>
      <td class="px-4 py-3">${job.endDate}</td>
      <td class="px-4 py-3 text-center">${job.numberOfApplicants}</td>
      <td class="px-4 py-3 text-center">
        <button
          type="button"
          class="delete-job-btn inline-flex items-center justify-center w-8 h-8 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition"
          data-job-index="${index}"
          title="Delete job post"
        >
          <i class="fa-solid fa-trash text-sm"></i>
        </button>
      </td>
    </tr>
  `;
  });

  tableBody.innerHTML = rows.join("");
}

renderTable();

// Delete job functionality
function deleteJob(index) {
  if (index < 0 || index >= myJobPostList.length) return;

  const job = myJobPostList[index];
  const confirmDelete = confirm(
    `Are you sure you want to delete the job post for "${job.role}" at ${job.company}? This action cannot be undone.`
  );

  if (confirmDelete) {
    myJobPostList.splice(index, 1);
    saveJobPosts(); // Save to localStorage
    renderTable(); // Re-render table
  }
}

// Event delegation for delete buttons
if (tableBody) {
  tableBody.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-job-btn");
    if (deleteBtn) {
      const index = parseInt(deleteBtn.getAttribute("data-job-index"), 10);
      deleteJob(index);
    }
  });
}

if (newJobPostBtn) {
  newJobPostBtn.addEventListener("click", openPopUp);
}

if (closeBtn) {
  closeBtn.addEventListener("click", closePopUp);
}

if (cancelBtn) {
  cancelBtn.addEventListener("click", closePopUp);
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const company = formData.get("company")?.toString().trim();
    const role = formData.get("role")?.toString().trim();
    const paidRate = formData.get("paidRate")?.toString().trim();
    const startDate = formData.get("startDate")?.toString().trim();
    const endDate = formData.get("endDate")?.toString().trim();
    const typeEmployment = formData.get("typeEmployment")?.toString();
    if (
      !company ||
      !role ||
      !paidRate ||
      !startDate ||
      !endDate ||
      !typeEmployment
    ) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const newJob = {
      company,
      role,
      paidRate: parseFloat(paidRate),
      typeEmployment,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      numberOfApplicants: 0,
      logoImg: "./images/cpp.png", // Cal Poly Pomona seal image
      applicants: []
    };

    myJobPostList.push(newJob);
    saveJobPosts(); // Save to localStorage
    renderTable();

    // Reset form and close modal
    form.reset();
    closePopUp();

  })

}

