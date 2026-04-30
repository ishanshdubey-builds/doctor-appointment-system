package com.das.pro.dasprorestjpa;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

// Import primary Spring Web mappings and Context Dependency Injectors
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Label controller allowing Spring component scanning to intercept generic authentication/administration contexts
@RestController
public class DasApi {

	// Inject User authentication credentials tracking via JVM natively
	@Autowired
	private LoginRepo repo;


	// Establish GET mapping used natively for data extraction verifications
	@GetMapping("/getdata")
	public String GetData() {
		// Define Optional boundaries mapping explicit string identifier keys safely
		Optional<UserInfoEntity> item = repo.findById("ishansh");
		
		// Map boolean validation identifying database resolution hit completely natively
		if(item.isPresent()) {
			// Trace data safely 
			System.out.println(item.get().date_of_birth);
			return "Successfull";
		} else {
			return "Failure";	
		}
	}

	// Establish GET mapping validating if a username is available during signup natively
	@GetMapping("/checkuserId")
	public ResponseEntity<Map<String, Boolean>> checkUserId(@RequestParam String user_id) {
		// Map boolean dictionary
		Map<String, Boolean> response = new HashMap<>();
		
		// Query exact user context natively traversing Login Repo boundaries
		Optional<UserInfoEntity> item = repo.findById(user_id);
		
		// If the DB does not find a match, the name is safe/available
		response.put("available", !item.isPresent());
		
		return ResponseEntity.ok(response);
	}

	// Direct testing PUT mapping modifying local explicit parameters
	@PutMapping("/updatedata")
	public String UpdateData() {
		// Query exact user context natively
		Optional<UserInfoEntity> item = repo.findById("ishansh");
		
		if(item.isPresent()) {
			// Decouple explicit pointer matching Java memory 
			UserInfoEntity existingEntity = item.get();
			// Reattribute properties securely
			existingEntity.setAddress("USA");
			// Persist mapped abstractions utilizing Spring Data automatically
			repo.save(existingEntity);
			return "Entity updated successfully";
		} else {
			return "Entity with ishansh not found";
		}
	}

	// Explicit generic testing DELETE pathway
	@DeleteMapping("/deletedata")
	public String DeleteData() {
		// Extract local tracking keys
		Optional<UserInfoEntity> item = repo.findById("ishansh");
		if(item.isPresent()) {
			// Delete directly pulling explicit mapping
			UserInfoEntity existingEntity = item.get();
			repo.delete(existingEntity);
			return "Entity Deleted successfully";
		} else {
			return "Failed";
		}
	}

    // Authentication logic moved to AuthController
}
