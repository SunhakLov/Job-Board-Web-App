import express from 'express'

const app = express();

app.get("/", (req, res) => {
    res.send("<h1>HELLO</h1>")
})

app.listen(8000, () => {
    console.log('server is running')
})


/*
========== TO-DO ==========
=> Create Users (applicants / employee) "POST GET UPDATE DELETE"
 
=> Create Application (applicants / employee) "POST GET UPDATE DELETE"
 
=> Create JobListing (applicants / employee) "POST GET UPDATE DELETE"
 
=> API 'GET' all job
 
=> API 'GET' search & filter
 
=> API 'GET' all job applied with status
 
=> API 'GET' all job posted
 
=> API 'GET' all applicant applied for the job
 
*/

