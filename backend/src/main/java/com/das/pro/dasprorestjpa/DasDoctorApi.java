package com.das.pro.dasprorestjpa;

import java.util.List;

// Core Spring Web and Stereotype imports
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// Define class as a RestController mapping web requests to data formats
@RestController
public class DasDoctorApi {
	
	// Inject the Doctor Data access layer automatically avoiding manual initializations
	@Autowired
	DoctorRepo doctorRepo;
	
	// Establish a GET endpoint at /doctorlist generating available lists of doctors
	@GetMapping("/doctorlist")
	public ResponseEntity<List<DoctorInfoEntity>> getDoctorList() {
		// Retrieve all rows mapped to DoctorInfoEntity natively via Iterable to List cast
		List<DoctorInfoEntity> doctorList = (List<DoctorInfoEntity>) doctorRepo.findAll();
		
		// Return HTTP 200 explicitly wrapping the result set
		return ResponseEntity.ok(doctorList);
	}

}
