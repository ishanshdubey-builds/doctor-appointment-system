package com.das.pro.dasprorestjpa;

import java.util.List;

// Jackson annotations preventing circular recursion infinite loops when marshaling JSON mappings natively
import com.fasterxml.jackson.annotation.JsonIgnore;

// Core Jakarta mappings explicitly exposing Object bounds to underlying Hibernate logic 
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

// Leverage Lombok abstracting explicit getters down mapping at Runtime statically 
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

// Signal component tracking to Spring Boot
@Entity
@NoArgsConstructor
@AllArgsConstructor
// Force static table names dynamically
@Table (name = "Doctor")
public class DoctorInfoEntity {

	// Define specific ID mapping columns natively defining explicit database properties
	@Id
	@Column(name = "doctor_id")
	String doctor_id;
	
	// Basic scalar definitions automatically parsing Java Strings into VARCHAR mappings seamlessly  
	String doctor_name;
	String specification;
	String hospital_address;
	Long official_contact;
	String official_email_id;
	 
	// Connect to shared user identity safely mapping properties up
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "user_id")
	UserInfoEntity userInfoEntity;
	 
	// Provide inverse relationship bridging appointments mapped internally utilizing Jackson flag ignoring nested recursion
	@ManyToMany(mappedBy = "doctorInfoEntity" , cascade = CascadeType.ALL  )
	@JsonIgnore
	List<BookingInfoEntity> bookingInfoEntity ;
	
	// Forward relation linking medical attachments dynamically natively tracking multiple rows cleanly
	@OneToMany(mappedBy = "doctorInfoEntity")
	List<ReportInfoEntity> reportInfoEntity;
	
	// JVM standard setter boundaries explicitly handling raw properties natively dynamically
	
	public String getDoctor_name() {
		return doctor_name;
	}

	public void setDoctor_name(String doctor_name) {
		this.doctor_name = doctor_name;
	}

	public List<ReportInfoEntity> getReportInfoEntity() {
		return reportInfoEntity;
	}

	public void setReportInfoEntity(List<ReportInfoEntity> reportInfoEntity) {
		this.reportInfoEntity = reportInfoEntity;
	}

	public List<BookingInfoEntity> getBookingInfoEntity() {
		return bookingInfoEntity;
	}

	public void setBookingInfoEntity(List<BookingInfoEntity> bookingInfoEntity) {
		this.bookingInfoEntity = bookingInfoEntity;
	}

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

	public void setOfficial_contact(Long long1) {
		this.official_contact = long1;
	}

	public String getOfficial_email_id() {
		return official_email_id;
	}

	public void setOfficial_email_id(String official_email_id) {
		this.official_email_id = official_email_id;
	}

	public UserInfoEntity getUserInfoEntity() {
        return userInfoEntity;
    }

    public void setUserInfoEntity(UserInfoEntity userInfoEntity) {
        this.userInfoEntity = userInfoEntity;
    }

}
