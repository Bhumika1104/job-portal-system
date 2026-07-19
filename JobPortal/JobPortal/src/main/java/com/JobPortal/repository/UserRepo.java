package com.JobPortal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.JobPortal.model.User;

public interface UserRepo extends JpaRepository<User, Long> {
	User findByEmail(String email);
	User findByResetToken(String token);

}
