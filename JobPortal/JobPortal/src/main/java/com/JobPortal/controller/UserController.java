package com.JobPortal.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.JobPortal.model.Hr;
import com.JobPortal.model.User;
import com.JobPortal.repository.UserRepo;
import com.JobPortal.service.HrService;
import com.JobPortal.service.UserService;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private UserService userService;
    
    
    // 🔹 EXISTING (unchanged)
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {

        User user = userRepo.findByEmail(email);

        if (user == null) {
            return "User not found";
        }

        String token = java.util.UUID.randomUUID().toString();

        user.setResetToken(token);
        userRepo.save(user);

        String link = "http://localhost:5173/reset-password/" + token;

        System.out.println("👉 Copy this link: " + link);

        return "Reset link generated (check console)";
    }
    
    
    // 🔹 EXISTING (unchanged)
    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String token,
                                @RequestParam String newPassword) {

        User user = userRepo.findByResetToken(token);

        if (user == null) {
            return "Invalid token";
        }

        user.setPassword(newPassword);
        user.setResetToken(null);

        userRepo.save(user);

        return "Password updated successfully";
    }


    // ✅ NEW SIMPLE DIRECT RESET (NO TOKEN)
    @PostMapping("/reset-password-direct")
    public String resetPasswordDirect(@RequestParam String email,
                                      @RequestParam String newPassword) {

        User user = userRepo.findByEmail(email);

        if (user == null) {
            return "User not found";
        }

        user.setPassword(newPassword);
        userRepo.save(user);

        return "Password updated successfully";
    }
    
    
    //getHrById
    @GetMapping("/{id}")
    public User getHr(@PathVariable Long id) {
    	return userService.getUserById(id);
    }

    // ✅ USER REGISTRATION
    @PostMapping("/register")
    public Object registerUser(@RequestBody User user) {

        User existingUser = userRepo.findByEmail(user.getEmail());

        if (existingUser != null) {
            return "❌ Email already registered";
        }

        User savedUser = userRepo.save(user);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "✅ User Registered Successfully");
        res.put("id", savedUser.getId());
        res.put("email", savedUser.getEmail());
        res.put("role", "USER");

        return res;
    }

    // ✅ USER LOGIN
    @PostMapping("/login")
    public Object loginUser(@RequestBody User user) {

        User existingUser = userRepo.findByEmail(user.getEmail());

        if (existingUser != null && existingUser.getPassword().equals(user.getPassword())) {

            Map<String, Object> res = new HashMap<>();
            res.put("id", existingUser.getId());
            res.put("email", existingUser.getEmail());
            res.put("role", "USER");

            return res;
        }

        return "❌ Invalid User Credentials";
    }
}