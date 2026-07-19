 package com.JobPortal.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.JobPortal.model.Application;
import com.JobPortal.repository.ApplicationRepo;

@Service
public class ApplicationService {
	@Autowired
	private ApplicationRepo applicationRepo;
	
	//apply job
	public Application applyJob(Application application) {
		application.setStatus("Pending");
		return applicationRepo.save(application);
	}
	
	//get appli by user
	public List<Application> getUserApplication(Long userId){
		return applicationRepo.findByUserId(userId);
	}
	
	//grt app by hr
	public List<Application>getJobApplication(Long jobId){
		return applicationRepo.findByJobId(jobId);
	}
	
	//update/reject status
    public Application updateStatus(Long id, String status) {
        Application app = applicationRepo.findById(id).orElse(null);

        if (app != null) {
            app.setStatus(status);
            return applicationRepo.save(app);
        }

        return null;
    }
	

}
