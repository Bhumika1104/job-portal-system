package com.JobPortal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.JobPortal.model.Job;

public interface JobRepo extends JpaRepository<Job, Long> {

    List<Job> findByHr_Id(Long hrId);
    List<Job> findByJobStatus(String jobStatus);
}