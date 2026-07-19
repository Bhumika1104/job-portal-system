package com.JobPortal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.JobPortal.model.Job;
import com.JobPortal.service.JobService;

@RestController
@RequestMapping("/jobs")
@CrossOrigin("*")
public class JobController {

    @Autowired
    private JobService jobService;

    // Add Job 
    @PostMapping("/add/{hrId}")
    public Job addJob(@RequestBody Job job, @PathVariable Long hrId) {
        return jobService.addJob(job, hrId);
    }

    //Get all jobs
    @GetMapping("/all")
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    // Get jobs by HR
    @GetMapping("/hr/{hrId}")
    public List<Job> getJobsByHr(@PathVariable Long hrId) {
        return jobService.getJobsByHr(hrId);
    }

    // Delete job
    @DeleteMapping("/delete/{id}")
    public String deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return "Job deleted successfully";
    }
    
    // ✅ Close Job
    @PutMapping("/close/{id}")
    public Job closeJob(@PathVariable Long id) {
        return jobService.closeJob(id);
    }

    // ✅ Get only OPEN jobs (user side)
    @GetMapping("/open")
    public List<Job> getOpenJobs() {
        return jobService.getOpenJobs();
    }
}