package com.JobPortal.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.JobPortal.model.Hr;
import com.JobPortal.model.Job;
import com.JobPortal.repository.HrRepo;
import com.JobPortal.repository.HrRepo;
import com.JobPortal.repository.JobRepo;
import com.JobPortal.repository.JobRepo;

@Service
public class JobService {

    @Autowired
    private JobRepo jobRepo;

    @Autowired
    private HrRepo hrRepo;

    // Add Job 
    public Job addJob(Job job, Long hrId) {

        Hr hr = hrRepo.findById(hrId)
                .orElseThrow(() -> new RuntimeException("HR not found"));

        job.setHr(hr);

        return jobRepo.save(job);
    }

    // ✅ Get all jobs
    public List<Job> getAllJobs() {
        return jobRepo.findAll();
    }

    // ✅ Get jobs by HR
    public List<Job> getJobsByHr(Long hrId) {
        return jobRepo.findByHr_Id(hrId);
    }

    // ✅ Delete job
    public void deleteJob(Long id) {
        jobRepo.deleteById(id);
    }
    
    // ✅ Add Job (default OPEN)
    public Job addJob(Job job) {
        job.setJobStatus("OPEN"); // 🔥 default
        return jobRepo.save(job);
    }

    // ✅ Close Job
    public Job closeJob(Long id) {
        Job job = jobRepo.findById(id).orElse(null);

        if (job != null) {
            job.setJobStatus("CLOSED");
            return jobRepo.save(job);
        }

        return null;
    }

    // ✅ Get only OPEN jobs (for users)
    public List<Job> getOpenJobs() {
        return jobRepo.findByJobStatus("OPEN");
    }
}