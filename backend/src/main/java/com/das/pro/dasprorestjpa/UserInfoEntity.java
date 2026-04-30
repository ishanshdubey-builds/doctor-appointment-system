package com.das.pro.dasprorestjpa;

import java.time.LocalDate;

// JPA mapping directives converting nested objects into relational schemas internally natively
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

// Standard Lombok hooks resolving simple class metadata
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

// Map user data explicitly defining login variables 
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Login")
public class UserInfoEntity {
	
	// Create identity binding globally identifying users directly by String keys natively (username)
	@Id
	String user_id;
	
	// Establish base user demographic scalars defining core profiles securely natively 
	String name;
	LocalDate date_of_birth;
	String address;
	Long contact;
	Long other_contact;
	
	// Explicit mapping containing application access limits ("Doctor" vs "Patient")
	String role;
	
	String email_id;
	String response;
	
	// Explicit authentication credential verification string natively (passwords)
	String password;
	
	// Nested array fields populated specifically mapping only when processing Doctor Registration boundaries 
	String doctor_id;
	String specification;
	String hospital_address;
	Long official_contact;
	String official_email_id;
	 
	// Provide inverse relationship pointing the Doctor Profile back towards base user records
	@OneToOne(mappedBy = "userInfoEntity" , cascade = CascadeType.ALL)
	DoctorInfoEntity doctorInfoEntity;
	 
	// Provide identical inverse relationship pointing standard profiles pointing backward to base records
	@OneToOne(mappedBy = "userInfoEntity" , cascade = CascadeType.ALL)
	PatientInfoEntity patientInfoEntity;
	
	// Built-in getters mapped cleanly isolating field definitions safely locally

	public String getDoctor_id() {
		return doctor_id;
	}
	public void setDoctor_id(String doctor_id) {
		this.doctor_id = doctor_id;
	}
	public String getSpecification() {
		return specification;
	}
	public void setSpecification(String specification) {
		this.specification = specification;
	}
	public String getHospital_address() {
		return hospital_address;
	}
	public void setHospital_address(String hospital_address) {
		this.hospital_address = hospital_address;
	}
	public Long getOfficial_contact() {
		return official_contact;
	}
	public void setOfficial_contact(Long official_contact) {
		this.official_contact = official_contact;
	}
	public String getOfficial_email_id() {
		return official_email_id;
	}
	public void setOfficial_email_id(String official_email_id) {
		this.official_email_id = official_email_id;
	}
	
	public String getResponse() {
		return response;
	}
	public void setResponse(String response) {
		this.response = response;
	}
	
	public String getUser_id() {
		return user_id;
	}
	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public LocalDate getDate_of_birth() {
		return date_of_birth;
	}
	public void setDate_of_birth(LocalDate date_of_birth) {
		this.date_of_birth = date_of_birth;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public Long getContact() {
		return contact;
	}
	public void setContact(Long contact) {
		this.contact = contact;
	}
	public Long getOther_contact() {
		return other_contact;
	}
	public void setOther_contact(Long other_contact) {
		this.other_contact = other_contact;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getEmail_id() {
		return email_id;
	}
	public void setEmail_id(String email_id) {
		this.email_id = email_id;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}

}
