package com.das.pro.dasprorestjpa;

import java.time.LocalDate;
import java.util.List;


// Import JPA decorators mapping JVM abstractions down to MySQL Database natively
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

// Lombok mapping implicit Constructor properties 
import lombok.AllArgsConstructor;

// Tell Spring to track this object representing the Medical Report Document Table
@Entity
@AllArgsConstructor
@Table(name="Report")
public class ReportInfoEntity {
	
	// Create strict identifier resolving explicit primary DB keys
	@Id
	@jakarta.persistence.GeneratedValue(strategy = jakarta.persistence.GenerationType.UUID)
	@Column(name = "report_id")
	String report_id;
	
	// Scalar properties mapping raw text and temporal constructs defining the upload payload 
	String booking_report_id;
	String patient_report_name;
	String doctor_report_id;
	LocalDate booking_date;
	String response;
	
	// Map Java Byte arrays securely up isolating PDF buffer constructs dynamically mapping natively to LONGBLOB types
	@Lob
	@Column(name = "pdf_content", columnDefinition = "LONGBLOB")
	byte[] pdfContent;
	
	// Default constructor needed for JPA proxying
	public ReportInfoEntity() {
	}
	
	// Isolate generic mapping associating generic identifiers back natively to independent Booking mappings 
	@OneToOne
	@JoinColumn(name = "booking_id")
	BookingInfoEntity bookingInfoEntity; 
	
	// Relate nested lists resolving mapped independent schemas dynamically 
	@ManyToOne(targetEntity = PatientInfoEntity.class)
	@JoinColumn(name="patient_id")
	List<PatientInfoEntity> patientInfoEntity;
	
	// Connect reporting payloads back securely utilizing internal Java mapped lists to Doctors actively mapped natively
	@ManyToOne(cascade = CascadeType.ALL, targetEntity = DoctorInfoEntity.class)
	@JoinColumn(name="doctor_id")
	List<DoctorInfoEntity> doctorInfoEntity;

	// Generated properties mapping explicitly to JVM Heap fields explicitly validating property calls safely
	
	public String getResponse() {
		return response;
	}

	public void setResponse(String response) {
		this.response = response;
	}

	public String getReport_id() {
		return report_id;
	}

	public void setReport_id(String report_id) {
		this.report_id = report_id;
	}

	public String getBooking_report_id() {
		return booking_report_id;
	}

	public void setBooking_report_id(String booking_report_id) {
		this.booking_report_id = booking_report_id;
	}

	public String getPatient_report_name() {
		return patient_report_name;
	}

	public void setPatient_report_name(String patient_report_name) {
		this.patient_report_name = patient_report_name;
	}

	public String getDoctor_report_id() {
		return doctor_report_id;
	}

	public void setDoctor_report_id(String doctor_report_id) {
		this.doctor_report_id = doctor_report_id;
	}

	public LocalDate getBooking_date() {
		return booking_date;
	}

	public void setBooking_date(LocalDate booking_date) {
		this.booking_date = booking_date;
	}

	public BookingInfoEntity getBookingInfoEntity() {
		return bookingInfoEntity;
	}

	public void setBookingInfoEntity(BookingInfoEntity bookingInfoEntity) {
		this.bookingInfoEntity = bookingInfoEntity;
	}

	public byte[] getPdfContent() {
		return pdfContent;
	}

	public void setPdfContent(byte[] pdfContent) {
		this.pdfContent = pdfContent;
	}

	public List<PatientInfoEntity> getPatientInfoEntity() {
		return patientInfoEntity;
	}

	public void setPatientInfoEntity(List<PatientInfoEntity> patientInfoEntity) {
		this.patientInfoEntity = patientInfoEntity;
	}

	public List<DoctorInfoEntity> getDoctorInfoEntity() {
		return doctorInfoEntity;
	}

	public void setDoctorInfoEntity(List<DoctorInfoEntity> doctorInfoEntity) {
		this.doctorInfoEntity = doctorInfoEntity;
	}

}
