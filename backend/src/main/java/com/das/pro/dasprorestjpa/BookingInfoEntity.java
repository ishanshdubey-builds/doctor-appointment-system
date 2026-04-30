package com.das.pro.dasprorestjpa;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


// JPA annotations importing native table bounds tracking properties dynamically against hibernate schema natively 
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

// Lombok runtime constructors bypassing massive file clutter 
import lombok.AllArgsConstructor;

// Signal Spring Framework resolving data layer dynamically 
@Entity
@AllArgsConstructor
@Table(name = "Booking")
public class BookingInfoEntity {
	
	// Create primary table key
	@Id
	@jakarta.persistence.GeneratedValue(strategy = jakarta.persistence.GenerationType.UUID)
	@Column(name = "booking_id")
	private String booking_id;
	
	// Scalar bindings reflecting exact payload components mapped up dynamically
	String patient_name;
	Long age;
	Long contact;
	LocalDate booking_date;
	LocalTime booking_time;
	String booking_type;
	String payment_mode;
	String doctor_id;
	String response;
	
	// Default constructor needed for JPA proxying
	public BookingInfoEntity() {
	}
	
	// Handle cross-relational Doctor-mapping cleanly generating isolated link table explicitly
	@ManyToMany(cascade = { CascadeType.ALL })
	@JoinTable(name = "Booking_Doctor_Table",
			joinColumns= {@JoinColumn(name = "booking_id", referencedColumnName="booking_id")},
			inverseJoinColumns = {@JoinColumn(name = "doctor_id", referencedColumnName="doctor_id")})
	List<DoctorInfoEntity> doctorInfoEntity;
	
	// Tie direct one-to-one record explicitly bound representing biological report uploads attached securely natively
	@OneToOne(mappedBy = "bookingInfoEntity")
	ReportInfoEntity reportInfoEntity;
	
	// Native JVM mappings explicitly validating property calls safely

	public ReportInfoEntity getReportInfoEntity() {
		return reportInfoEntity;
	}
	public void setReportInfoEntity(ReportInfoEntity reportInfoEntity) {
		this.reportInfoEntity = reportInfoEntity;
	}
	public String getResponse() {
		return response;
	}
	public void setResponse(String response) {
		this.response = response;
	}
	public String getDoctor_id() {
		return doctor_id;
	}
	public void setDoctor_id(String doctor_id) {
		this.doctor_id = doctor_id;
	}
	public List<DoctorInfoEntity> getDoctorInfoEntity() {
		return doctorInfoEntity;
	}
	public void setDoctorInfoEntity(List<DoctorInfoEntity> doctorInfoEntity) {
		this.doctorInfoEntity = doctorInfoEntity;
	}
	public String getPatient_name() {
		return patient_name;
	}
	public void setPatient_name(String patient_name) {
		this.patient_name = patient_name;
	}
	public Long getAge() {
		return age;
	}
	public void setAge(Long age) {
		this.age = age;
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
	public LocalTime getBooking_time() {
		return booking_time;
	}
	public void setBooking_time(LocalTime booking_time) {
		this.booking_time = booking_time;
	}
	public String getBooking_type() {
		return booking_type;
	}
	public void setBooking_type(String booking_type) {
		this.booking_type = booking_type;
	}
	public String getPayment_mode() {
		return payment_mode;
	}
	public void setPayment_mode(String payment_mode) {
		this.payment_mode = payment_mode;
	}
	public String getBooking_id() {
		return booking_id;
	}
	public void setBooking_id(String booking_id) {
		this.booking_id = booking_id;
	}
	
}
