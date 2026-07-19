package com.JobPortal.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;

import com.JobPortal.model.Application;
import com.JobPortal.model.Job;
import com.JobPortal.model.User;
import com.JobPortal.repository.ApplicationRepo;
import com.JobPortal.repository.JobRepo;
import com.JobPortal.repository.UserRepo;
import com.JobPortal.service.ApplicationService;

@RestController
@RequestMapping("/applications")
@CrossOrigin
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JobRepo jobRepo;

    @Autowired
    private ApplicationRepo applicationRepo;


    // 🔥 APPLY JOB (OLD - unchanged)
    @PostMapping("/apply")
    public Application applyJob(@RequestBody Application application) {

        User user = userRepo.findById(application.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = jobRepo.findById(application.getJob().getId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        application.setUser(user);
        application.setJob(job);

        return applicationService.applyJob(application);
    }


    // 🔥 USER → applied jobs
    @GetMapping("/user/{userId}")
    public List<Application> getUserApplications(@PathVariable Long userId) {
        return applicationService.getUserApplication(userId);
    }


    // 🔥 HR → job applications
    @GetMapping("/job/{jobId}")
    public List<Application> getJobApplications(@PathVariable Long jobId) {
        return applicationService.getJobApplication(jobId);
    }


    // 🔥 update status
    @PutMapping("/{id}")
    public Application updateStatus(@PathVariable Long id,
                                    @RequestParam String status) {
        return applicationService.updateStatus(id, status);
    }


    // 🔥 debug
    @GetMapping("/all")
    public List<Application> getAll() {
        return applicationRepo.findAll();
    }



    // =====================================================
    // 🔥 APPLY WITH RESUME
    // =====================================================

    @PostMapping("/applyWithResume")
    public Application applyWithResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId,
            @RequestParam("jobId") Long jobId) {

        try {

            // ✅ PDF validation
            if (file.isEmpty() || 
                !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {

                throw new RuntimeException("Only PDF file allowed");
            }


            // ✅ Upload folder create automatically
            String uploadDir = System.getProperty("user.dir") + "/uploads/";

            File folder = new File(uploadDir);

            if (!folder.exists()) {
                folder.mkdirs();
            }


            // check path
            System.out.println("Upload Folder Path : "
                    + folder.getAbsolutePath());


            // ✅ unique filename
            String fileName = System.currentTimeMillis()
                    + "_" 
                    + file.getOriginalFilename();


            // ✅ save PDF file
            File saveFile = new File(uploadDir + fileName);

            file.transferTo(saveFile);



            // ✅ fetch user
            User user = userRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));


            // ✅ fetch job
            Job job = jobRepo.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Job not found"));



            // ✅ create application
            Application application = new Application();

            application.setUser(user);
            application.setJob(job);
            application.setResumePath(fileName);
            application.setStatus("Pending"); 

            return applicationRepo.save(application);


        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "Error: " + e.getMessage()
            );
        }
    }




    // =====================================================
    // 🔥 DOWNLOAD RESUME
    // =====================================================

    @GetMapping("/resume/{fileName}")
    public ResponseEntity<Resource> downloadResume(
            @PathVariable String fileName) throws IOException {


        Path path = Paths.get(
                System.getProperty("user.dir") 
                + "/uploads/" 
                + fileName
        );


        Resource resource = new UrlResource(path.toUri());


        return ResponseEntity.ok()

                .header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" 
                + fileName + "\"")

                .body(resource);
    }

}