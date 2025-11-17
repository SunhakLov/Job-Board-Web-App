import { myJobPostList, saveJobPosts } from "../data.js";

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const employmentTypeFilter = document.getElementById('employmentTypeFilter');
    const jobResults = document.getElementById('jobResults');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    const clearFilters = document.getElementById('clearFilters');

    // Check if elements exist
    if (!searchForm || !searchInput || !employmentTypeFilter || !jobResults || !noResults || !resultsCount) {
        console.error('Required DOM elements not found');
        return;
    }

    // Get current employee information
    function getCurrentEmployee() {
        try {
            const saved = localStorage.getItem('employeeProfile');
            if (saved) {
                const profileData = JSON.parse(saved);
                return {
                    candidateID: profileData.email ? profileData.email.replace('@', '_').replace('.', '_') : 'employee_' + Date.now(),
                    candidateName: `${profileData.firstName || 'Ryan'} ${profileData.lastName || 'Trahan'}`,
                    candidateEmail: profileData.email || 'ryan@cpp.edu',
                    candidateStatus: ["Pending", "gray"],
                    candidatePhoto: profileData.profileImage || './images/default.jpg',
                    candidateNote: ""
                };
            }
        } catch (e) {
            console.warn('Could not load employee profile:', e);
        }
        // Default employee info
        return {
            candidateID: 'ryan_cpp_edu',
            candidateName: 'Ryan Trahan',
            candidateEmail: 'ryan@cpp.edu',
            candidateStatus: ["Pending", "gray"],
            candidatePhoto: './images/default.jpg',
            candidateNote: ""
        };
    }

    // Check if employee has already applied to a job
    function hasApplied(job, employeeEmail) {
        return job.applicants && job.applicants.some(applicant => applicant.candidateEmail === employeeEmail);
    }

    function filterJobs() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const employmentType = employmentTypeFilter.value;

        const filtered = myJobPostList.filter(job => {
            const matchesSearch = !searchTerm || 
                job.company.toLowerCase().includes(searchTerm) ||
                job.role.toLowerCase().includes(searchTerm);
            
            const matchesType = !employmentType || job.typeEmployment === employmentType;

            return matchesSearch && matchesType;
        });

        renderJobs(filtered);

        // Show/hide clear filters button
        if (clearFilters) {
            if (searchTerm || employmentType) {
                clearFilters.classList.remove('hidden');
            } else {
                clearFilters.classList.add('hidden');
            }
        }
    }

    function renderJobs(jobs) {
        if (jobs.length === 0) {
            jobResults.classList.add('hidden');
            noResults.classList.remove('hidden');
            resultsCount.textContent = 'No Jobs Found';
            return;
        }

        jobResults.classList.remove('hidden');
        noResults.classList.add('hidden');
        resultsCount.textContent = `${jobs.length} Job${jobs.length !== 1 ? 's' : ''} Found`;

        const currentEmployee = getCurrentEmployee();
        let jobListHTML = "";
        
        jobs.forEach((job) => {
            // Find the actual index in myJobPostList
            const jobIndex = myJobPostList.findIndex(j => 
                j.company === job.company && j.role === job.role
            );
            
            const alreadyApplied = hasApplied(job, currentEmployee.candidateEmail);
            const applyButtonHTML = alreadyApplied
                ? `<button data-job-index="${jobIndex}" class="cancel-btn px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-200">
                        <i class="fa-solid fa-times mr-2"></i>Cancel Application
                    </button>`
                : `<button data-job-index="${jobIndex}" class="apply-btn px-4 py-2 bg-[#a4d65e] text-[#005030] rounded-lg font-medium hover:bg-yellow-400 transition-all duration-200">
                        <i class="fa-solid fa-paper-plane mr-2"></i>Apply Now
                    </button>`;

            jobListHTML += `
                <div class="eachJob flex flex-col p-4 hover:scale-[1.02] transition duration-300 ease-in-out">
                    <div class="flex flex-col sm:flex-row bg-[#005030] text-white rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:bg-[#a4d65e] hover:text-[#005030] w-full">
                        <div class="p-4 flex items-center justify-center">
                            <img src="${job.logoImg}" alt="${job.company} logo"
                                class="bg-white w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover object-center" />
                        </div>
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-1 p-4">
                            <div class="flex flex-col leading-normal gap-3 justify-center h-full">
                                <div class="company-role pt-2">
                                    <p class="font-bold text-base md:text-base">${job.company}</p>
                                    <p class="text-lg md:text-xl font-bold tracking-tight">
                                        ${job.role}
                                    </p>
                                </div>
                                <p class="font-thin text-sm">
                                    <span class="salary">$${job.paidRate}/hr</span> &middot;
                                    <span class="type">${job.typeEmployment}</span> &middot;
                                    <span class="duration">${job.startDate} - ${job.endDate}</span>
                                </p>
                                <p class="font-thin text-sm">
                                    Number of Applications: <span>${job.numberOfApplicants}</span> Application${job.numberOfApplicants !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div class="flex-shrink-0 mt-2 sm:mt-0">
                                ${applyButtonHTML}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        jobResults.innerHTML = jobListHTML;

        // Add event listeners to apply buttons
        document.querySelectorAll('.apply-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const jobIndex = parseInt(btn.getAttribute('data-job-index'));
                applyToJob(jobIndex);
            });
        });

        // Add event listeners to cancel buttons
        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const jobIndex = parseInt(btn.getAttribute('data-job-index'));
                cancelApplication(jobIndex);
            });
        });
    }

    // Apply to a job
    function applyToJob(jobIndex) {
        const job = myJobPostList[jobIndex];
        const currentEmployee = getCurrentEmployee();

        // Check if already applied
        if (hasApplied(job, currentEmployee.candidateEmail)) {
            alert('You have already applied to this job!');
            return;
        }

        // Add employee to applicants array
        if (!job.applicants) {
            job.applicants = [];
        }
        job.applicants.push(currentEmployee);

        // Update number of applicants
        job.numberOfApplicants = job.applicants.length;

        // Save to localStorage
        saveJobPosts();

        // Re-render jobs to update the UI
        filterJobs();

        alert(`Successfully applied to ${job.company} - ${job.role}!`);
    }

    // Cancel/Withdraw application from a job
    function cancelApplication(jobIndex) {
        const job = myJobPostList[jobIndex];
        const currentEmployee = getCurrentEmployee();

        // Check if employee has applied
        if (!hasApplied(job, currentEmployee.candidateEmail)) {
            alert('You have not applied to this job!');
            return;
        }

        // Confirm cancellation
        if (!confirm(`Are you sure you want to cancel your application to ${job.company} - ${job.role}?`)) {
            return;
        }

        // Remove employee from applicants array
        if (job.applicants) {
            job.applicants = job.applicants.filter(
                applicant => applicant.candidateEmail !== currentEmployee.candidateEmail
            );
        }

        // Update number of applicants
        job.numberOfApplicants = job.applicants ? job.applicants.length : 0;

        // Save to localStorage
        saveJobPosts();

        // Re-render jobs to update the UI
        filterJobs();

        alert(`Application cancelled for ${job.company} - ${job.role}.`);
    }

    // Initial render
    renderJobs(myJobPostList);

    // Search form submission
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        filterJobs();
    });

    // Real-time filtering on input change
    searchInput.addEventListener('input', filterJobs);
    employmentTypeFilter.addEventListener('change', filterJobs);

    // Clear filters
    if (clearFilters) {
        clearFilters.addEventListener('click', () => {
            searchInput.value = '';
            employmentTypeFilter.value = '';
            filterJobs();
        });
    }
});

