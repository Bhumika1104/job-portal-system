package com.JobPortal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.JobPortal.model.Hr;
import com.JobPortal.model.User;

public interface HrRepo extends JpaRepository<Hr, Long> {
	Hr findByEmail(String email);
	Hr findByResetToken(String token);

}
