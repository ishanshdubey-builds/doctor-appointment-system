package com.das.pro.dasprorestjpa;

import java.time.LocalDate;
import java.util.List;

// JPA Database Abstractions mapping pure Java classes directly to remote SQL tables
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

// Lombok injections enabling implicit getters/setters/constructors automatically at runtime
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

// Signal to Hibernate engine to map this abstraction automatically
@Entity
@NoArgsConstructor
@AllArgsConstructor
// Explicitly name the table within MySQL engine
@Table(name = "Patient")
public class PatientInfoEntity {
	
	// Establish standard String primary key mapping natively
	@Id
	String patient_id;
	
	// Map native Java Date types to MySQL Date abstractions automatically
	LocalDate age;
	
	Long contact;
	LocalDate booking_date;
	
	// Link Patient back to universal User payload using a foreign key boundary named "user_id"
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "user_id")
	UserInfoEntity userInfoEntity;
	
	// Connect Patient to array of Reports utilizing a mapped variable "patientInfoEntity" found inside the Report table
	@OneToMany(mappedBy = "patientInfoEntity")
	List<ReportInfoEntity> reportInfoEntity;

	// Generated properties mapping explicitly to JVM Heap fields natively

	public String getPatient_id() {
		return patient_id;
	}

	public List<ReportInfoEntity> getReportInfoEntity() {
		return reportInfoEntity;
	}

	public void setReportInfoEntity(List<ReportInfoEntity> reportInfoEntity) {
		this.reportInfoEntity = reportInfoEntity;
	}

	public void setPatient_id(String patient_id) {
		this.patient_id = patient_id;
	}

	public LocalDate getAge() {
		return age;
	}

	public void setAge(LocalDate localDate) {
		this.age = localDate;
	}

	public Long getContact() {
		return contact;
	}

	public void setContact(Long contact) {
		this.contact = contact;
	}

	public LocalDate getBooking_date() {
		return booking_date;
	}

	public void setBooking_date(LocalDate booking_date) {
		this.booking_date = booking_date;
	}

	public UserInfoEntity getUserInfoEntity() {
		return userInfoEntity;
	}

	public void setUserInfoEntity(UserInfoEntity userInfoEntity) {
		this.userInfoEntity = userInfoEntity;
	}

}
