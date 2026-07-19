package com.JobPortal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.JobPortal.model.Hr;
import com.JobPortal.model.User;
import com.JobPortal.repository.UserRepo;

@Service
public class UserService {
	
	@Autowired
    private UserRepo userRepo;
	
	//register
	public User registerUser(User user) {
		if(userRepo.findByEmail(user.getEmail()) != null){
			System.out.println("Email already exists");
		}
		return userRepo.save(user);
	}
	
	//login
	public User loginUser(String email, String password) {
		User user = userRepo.findByEmail(email);
		if(user == null) {
			throw new RuntimeException("User not found!");
		}
		if(! user.getPassword().equals(password)) {
			throw new RuntimeException("Invalid password!");
		}
		return user;
	}
	
	//grtHrById
	public User getUserById(Long id) {
		return userRepo.findById(id).orElse(null);
	}

}

