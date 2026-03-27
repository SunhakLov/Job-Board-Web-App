import { myJobPostList, saveJobPosts, reloadJobPosts } from "../data.js";

document.addEventListener('DOMContentLoaded', () => {
    const applicationsList = document.getElementById('applicationsList');
    const noApplications = document.getElementById('noApplications');
    const applicationsCount = document.getElementById('applicationsCount');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Check if elements exist
    if (!applicationsList || !noApplications || !applicationsCount) {
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
                    candidateEmail: profileData.email || 'ryan@cpp.edu'
                };
            }
        } catch (e) {
            console.warn('Could not load employee profile:', e);
        }
        return {
            candidateEmail: 'ryan@cpp.edu'
        };
    }

    // Get status badge HTML
    function getStatusBadge(status) {
        const statusMap = {
            'Pending': { text: 'Pending', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
            'Interview': { text: 'Interview', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
            'Offer': { text: 'Offer', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
            'Reject': { text: 'Rejected', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' }
        };

        const statusInfo = statusMap[status] || statusMap['Pending'];
        return `<span class="px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.textColor}">
            ${statusInfo.text}
        </span>`;
    }

    // Get all applications for current employee
    function getMyApplications() {
        // Reload data to ensure we have the latest status updates
        reloadJobPosts();
        const currentEmployee = getCurrentEmployee();
        const applications = [];

        myJobPostList.forEach((job, jobIndex) => {
            if (job.applicants && job.applicants.length > 0) {
                const myApplication = job.applicants.find(
                    applicant => applicant.candidateEmail === currentEmployee.candidateEmail
                );

                if (myApplication) {
                    applications.push({
                        jobIndex: jobIndex,
                        job: job,
                        application: myApplication
                    });
                }
            }
        });

        return applications;
    }

    // Cancel application
    function cancelApplication(jobIndex) {
        const job = myJobPostList[jobIndex];
        const currentEmployee = getCurrentEmployee();

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

        // Re-render applications
        renderApplications(currentFilter);
        alert(`Application cancelled for ${job.company} - ${job.role}.`);
    }

    let currentFilter = 'all';

    // Render applications
    function renderApplications(filter = 'all') {
        currentFilter = filter;
        const applications = getMyApplications();
        
        // Filter by status
        const filteredApplications = filter === 'all' 
            ? applications 
            : applications.filter(app => app.application.candidateStatus[0] === filter);

        if (filteredApplications.length === 0) {
            applicationsList.classList.add('hidden');
            noApplications.classList.remove('hidden');
            if (applications.length === 0) {
                applicationsCount.textContent = 'No Applications';
            } else {
                applicationsCount.textContent = `No ${filter === 'all' ? '' : filter} Applications`;
            }
            return;
        }

        applicationsList.classList.remove('hidden');
        noApplications.classList.add('hidden');
        applicationsCount.textContent = `${filteredApplications.length} Application${filteredApplications.length !== 1 ? 's' : ''} ${filter === 'all' ? '' : `(${filter})`}`;

        let applicationsHTML = "";
        filteredApplications.forEach(({ jobIndex, job, application }) => {
            const status = application.candidateStatus[0];
            const statusBadge = getStatusBadge(status);

            applicationsHTML += `
                <div class="application-card border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 ease-in-out">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                            <div class="flex-shrink-0">
                                <img src="${job.logoImg}" alt="${job.company} logo"
                                    class="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover object-center bg-white border-2 border-gray-200" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                    <h3 class="text-xl font-bold text-[#005030]">${job.company}</h3>
                                    <span class="text-gray-500">•</span>
                                    <p class="text-lg font-semibold text-gray-700">${job.role}</p>
                                </div>
                                <div class="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                                    <span class="flex items-center gap-1">
                                        <i class="fa-solid fa-dollar-sign"></i>
                                        <span>$${job.paidRate}/hr</span>
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <i class="fa-solid fa-briefcase"></i>
                                        <span>${job.typeEmployment}</span>
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <i class="fa-solid fa-calendar"></i>
                                        <span>${job.startDate} - ${job.endDate}</span>
                                    </span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm text-gray-600">Status:</span>
                                    ${statusBadge}
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                            <button data-job-index="${jobIndex}" 
                                class="cancel-application-btn px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-200">
                                <i class="fa-solid fa-times mr-2"></i>Cancel Application
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        applicationsList.innerHTML = applicationsHTML;

        // Add event listeners to cancel buttons
        document.querySelectorAll('.cancel-application-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const jobIndex = parseInt(btn.getAttribute('data-job-index'));
                cancelApplication(jobIndex);
            });
        });
    }

    // Filter button event listeners
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => {
                b.classList.remove('active', 'bg-[#005030]', 'text-white');
                b.classList.add('bg-gray-200', 'text-gray-700');
            });
            btn.classList.add('active', 'bg-[#005030]', 'text-white');
            btn.classList.remove('bg-gray-200', 'text-gray-700');

            const filter = btn.getAttribute('data-filter');
            renderApplications(filter);
        });
    });

    // Initial render
    renderApplications('all');
});

