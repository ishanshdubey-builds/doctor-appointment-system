package com.das.pro.dasprorestjpa;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Core Spring and Network definitions
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

// Label controller allowing Spring component scanning to detect mapped routing ends
@RestController
public class DasBookingApi {

	// Automatically inject data access properties to manage Bookings directly via JVM
	@Autowired
	private BookingRepo bookRepo;

	// Establish POST mapping routing new booking payload requests to this specific function block
	@PostMapping("/Patientbooking")
	public ResponseEntity<Map<String, Object>> signup(@RequestBody BookingInfoEntity patient) {
		// Instantiate generic mapped return array supporting polymorphic data structures
		Map<String, Object> response = new HashMap<>();
		try {
			// Extremely verbose field checking making sure malformed or incomplete objects are intercepted early
			if (
					patient.getPatient_name() == null || patient.getPatient_name().trim().isEmpty() ||
					patient.getAge() == null || patient.getAge() == 0L || 
					patient.getContact() == null || patient.getContact() == 0L ||
					patient.getBooking_date() == null || 
					patient.getBooking_time() == null || 
					patient.getBooking_type() == null || 
					patient.getPayment_mode() == null 
					) {
				// Inject direct human error text
				response.put("error", "All fields are required");
				
				// Immediately deny routing returning HTTP 400 Bad Request
				return ResponseEntity.badRequest().body(response);
			}

			// Localized server console trace identifying passed payload gate 
			System.out.println("Booking success");
			
			// Commit the entire payload entity explicitly to the bounded database
			bookRepo.save(patient);
			
			// Reflect the precise created identifiers dynamically back downward toward the requesting client
			response.put("booking_id", patient.getBooking_id());
			response.put("booking_name", patient.getPatient_name()); 
			response.put("booking_date", patient.getBooking_date());
			response.put("booking_time", patient.getBooking_time());
			response.put("booking_type", patient.getBooking_type());

			// Complete cycle returning HTTP 200 code
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			// Log general failure traces visually
			System.out.println("failed");
			
			// Set explicit server-sided return error message array
			response.put("error", "Booking Failed");
			
			// Expose explicit Server failures instead of client-side failures
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}
	
	// Create GET mapping fetching the complete stored list of current global Database Bookings
	@GetMapping("/booking")
	public ResponseEntity<List<BookingInfoEntity>> getDoctorBookings() {
		// Native iteration pushing bounded iterables into standardized generic Lists 
		List<BookingInfoEntity> doctorBookings = (List<BookingInfoEntity>) bookRepo.findAll();
		
		// Map generic array mapping directly out as an HTTP 200 return containing literal arrays 
		return ResponseEntity.ok(doctorBookings);
	}

}
