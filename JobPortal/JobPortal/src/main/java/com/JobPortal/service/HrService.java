package com.JobPortal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.JobPortal.model.Hr;
import com.JobPortal.repository.HrRepo;

@Service
public class HrService {
	@Autowired 
	 private HrRepo hrRepo;
	
	//register
	public Hr registerUser(Hr hr) {
		if(hrRepo.findByEmail(hr.getEmail()) != null){
			System.out.println("Email already exists");
		}
		return hrRepo.save(hr);
	}
	
	//login
	public Hr loginUser(String email, String password) {
		Hr hr = hrRepo.findByEmail(email);
		if(hr == null) {
			throw new RuntimeException("User not found!");
		}
		if(! hr.getPassword().equals(password)) {
			throw new RuntimeException("Invalid password!");
		}
		return hr;
	}
	
	//grtHrById
	public Hr getHrById(Long id) {
		return hrRepo.findById(id).orElse(null);
	}

}
