package com.das.pro.dasprorestjpa;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

// Core Spring Web Request Annotations
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

// Label controller allowing Spring component scanning to intercept request contexts
@RestController
public class DasReportApi {
	
	// Dynamically inject reporting data access context mapping
	@Autowired
	private ReportRepo reportRepo;
	
	// Create strict POST endpoint designed specifically mapping massive multi-part data payload requests (PDFs)
	@PostMapping("/uploadReport")
    public ResponseEntity<Map<String, Object>> uploadReport( 
    	  // Explicitly annotate specific form encoded structures to backend literals natively
    	  @RequestParam("booking_report_id") String bookingId,
          @RequestParam("patient_report_name") String patientReportName,
          @RequestParam("doctor_report_id") String doctorReportId,
          @RequestParam("booking_date") LocalDate bookingDate,
          @RequestParam("pdf") MultipartFile file) {
          
        

        // Define standard object to object dictionary returning mapped state outputs easily
        Map<String, Object> response = new HashMap<>(); 

        try {
        	// Explicitly decouple Byte[] arrays utilizing JVM buffer extraction resolving binary properties
            byte[] fileContent = file.getBytes();
            
            // Create a brand new logical instance referencing PDF Report abstractions 
            ReportInfoEntity uploadedReport = new ReportInfoEntity();
            
            // Reapply form encoded strings mapping out generic payload mapping properties 
            uploadedReport.setBooking_report_id(bookingId);
            uploadedReport.setPatient_report_name(patientReportName);
            uploadedReport.setDoctor_report_id(doctorReportId);
            uploadedReport.setBooking_date(bookingDate);
            
            // Append massive blob representation to object entity entirely
            uploadedReport.setPdfContent(fileContent);
            
            // Finalize native database save effectively running insert commands securely
            reportRepo.save(uploadedReport);
            
            // Log local validation successfully hitting server console interface natively
            System.out.println("upload success");
            
            // Format returning object pushing confirmation and precise identification key referencing database lookup
            response.put("message", "File uploaded successfully");
            response.put("report_id", uploadedReport.getReport_id());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
        	// Tracing failures locally
        	System.out.println("fail to upload");
        	
        	// Mapping textual client failure outputs natively
        	response.put("error", "Report Processing Failed");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
	}
	
	// Establish standard GET mapping directly querying the backend blob mapping natively returning file bytes
	@GetMapping("/downloadReport")
	public ResponseEntity<byte[]> downloadReport(@RequestParam("report_id" ) String report_id) {
		// Log specific network requests querying literal files directly within the server console
		System.out.println(report_id);
	    try {
	        // Native abstraction validating data existence preventing null-pointer resolutions locally
	        Optional<ReportInfoEntity> reportOptional = reportRepo.findById(report_id);
	        
	        // Check if DB found record mapping logically requested PDF entity
	        if (reportOptional.isEmpty()) {
	        	// Bounce context mapping back HTTP 404 natively signifying nothing was retrieved 
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	        }
	        
	        // Resolve specific record resolving optional boundaries effectively
	        ReportInfoEntity report = reportOptional.get();
	        
	        // Pull blob chunk mapping out raw decoded byte stream out from MySQL driver boundaries
	        byte[] pdfContent = report.getPdfContent();
	        
	        // Set explicit Web Browser downloading standards bypassing specific frontend logic and utilizing native functionality
	        HttpHeaders headers = new HttpHeaders();
	        headers.setContentType(MediaType.APPLICATION_PDF);
	        headers.setContentDispositionFormData("filename", "report.pdf");
	        headers.setContentLength(pdfContent.length);
	        
	        // Local logging verifying successful output boundaries natively
	        System.out.println("download pdf success");
	        return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
	        
	    } catch (Exception e) {
	    	// Prevent network timeout disconnections and respond precisely to logical trace fails securely 
	        System.out.println("Failed to download report: " + e.getMessage());
	        System.out.println("download pdf fail");
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
	    }
	}
}
