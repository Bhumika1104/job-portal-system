
package com.JobPortal.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.JobPortal.model.Hr;
import com.JobPortal.repository.HrRepo;
import com.JobPortal.service.HrService;

@RestController
@RequestMapping("/hr")
@CrossOrigin
public class HrController {

    @Autowired
    private HrRepo hrRepo;
    @Autowired
    private HrService hrService;
    
    
    // 🔹 EXISTING (unchanged)
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {

        Hr hr = hrRepo.findByEmail(email);

        if (hr == null) {
            return "Hr not found";
        }

        String token = java.util.UUID.randomUUID().toString();

        hr.setResetToken(token);
        hrRepo.save(hr);

        String link = "http://localhost:5173/reset-password/" + token;

        System.out.println("👉 Copy this link: " + link);

        return "Reset link generated (check console)";
    }
    
    
    // 🔹 EXISTING (unchanged)
    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String token,
                                @RequestParam String newPassword) {

        Hr hr = hrRepo.findByResetToken(token);

        if (hr == null) {
            return "Invalid token";
        }

        hr.setPassword(newPassword);
        hr.setResetToken(null);

        hrRepo.save(hr);

        return "Password updated successfully";
    }


    // ✅ NEW SIMPLE DIRECT RESET (NO TOKEN)
    @PostMapping("/reset-password-direct")
    public String resetPasswordDirect(@RequestParam String email,
                                      @RequestParam String newPassword) {

        Hr hr = hrRepo.findByEmail(email);

        if (hr == null) {
            return "User not found";
        }

        hr.setPassword(newPassword);
        hrRepo.save(hr);

        return "Password updated successfully";
    }
    
    //getHrById
    @GetMapping("/{id}")
    public Hr getHr(@PathVariable Long id) {
    	return hrService.getHrById(id);
    }
    
    

    // ✅ HR Registration API
    @PostMapping("/register")
    public Object registerHr(@RequestBody Hr hr) {

        // check if email already exists
        Hr existingHr = hrRepo.findByEmail(hr.getEmail());

        if (existingHr != null) {
            return "❌ Email already registered";
        }

        // save new HR
        Hr savedHr = hrRepo.save(hr);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "✅ HR Registered Successfully");
        res.put("id", savedHr.getId());
        res.put("email", savedHr.getEmail());

        return res;
    }

    // ✅ HR Login API
    @PostMapping("/login")
    public Object loginHr(@RequestBody Hr hr) {

        Hr existingHr = hrRepo.findByEmail(hr.getEmail());

        if (existingHr != null && existingHr.getPassword().equals(hr.getPassword())) {

            Map<String, Object> res = new HashMap<>();
            res.put("id", existingHr.getId());   // 🔥 IMPORTANT (job upload साठी)
            res.put("email", existingHr.getEmail());
            res.put("role", "HR");

            return res;
        }

        return "❌ Invalid HR Credentials";
    }
}
