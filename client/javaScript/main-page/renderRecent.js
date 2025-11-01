import { myJobPostList } from "../data.js";

const jobRecent = document.getElementById("recentJob");

export function renderRecent() {
    let jobListHTML = "";

    myJobPostList.forEach((job, index) => {
        jobListHTML += `

                    <div
                        class="eachJob flex flex-col p-4 cursor-pointer hover:scale-105 transition duration-300 ease-in-out popJobDetail" id="job${index}">
                        <div
                            class="flex flex-col sm:flex-row bg-[#005030] text-white rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:bg-[#a4d65e] hover:text-[#005030] sm:h-40 w-full">

                            <div class="p-4 flex items-center justify-center ">
                                <img src="${job.logoImg}" alt="${job.company} logo"
                                    class="bg-white w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover object-center" />
                            </div>

                            <div class="flex flex-col leading-normal gap-3 justify-center h-full">
                                <div class="company-role pt-2">
                                    <p class="font-bold text-base md:text-base">${job.company}</p>
                                    <p class="text-lg md:text-xl font-bold tracking-tight">
                                        ${job.role}
                                    </p>
                                </div>
                                <p class="font-thin text-sm">
                                    <span class="salary">${job.paidRate}$/hr</span> &middot;
                                    <span class="type">${job.typeEmployment}</span> &middot;
                                    <span class="duration">${job.startDate} - ${job.endDate}</span>
                                </p>
                                <p class="font-thin text-sm">
                                    Number of Applications : <span>${job.numberOfApplicants}</span> Applications
                                </p>
                            </div>
                        </div>
                    </div>

        `
    });

    jobRecent.innerHTML = jobListHTML;
}