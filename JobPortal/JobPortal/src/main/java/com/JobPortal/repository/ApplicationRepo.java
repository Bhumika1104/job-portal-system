package com.JobPortal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.JobPortal.model.Application;

public interface ApplicationRepo extends JpaRepository<Application, Long> {

    //  particular user applications
    List<Application> findByUserId(Long userId);

    //  particular job applications (HR use)
    List<Application> findByJobId(Long jobId);
    
    List<Application> findByJobHrId(Long hrId);
    

}