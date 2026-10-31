package com.das.pro.dasprorestjpa;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class DasReportApi {
    private static final long MAX_PDF_SIZE = 20L * 1024L * 1024L;

    private final ReportRepo reportRepo;
    private final BookingRepo bookingRepo;

    public DasReportApi(ReportRepo reportRepo, BookingRepo bookingRepo) {
        this.reportRepo = reportRepo;
        this.bookingRepo = bookingRepo;
    }

    @PostMapping("/uploadReport")
    public ResponseEntity<Map<String, Object>> uploadReport(
            @RequestParam("booking_report_id") String bookingId,
            @RequestParam("patient_report_name") String patientReportName,
            @RequestParam("doctor_report_id") String doctorReportId,
            @RequestParam("booking_date") LocalDate bookingDate,
            @RequestParam("pdf") MultipartFile file,
            Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        UserInfoEntity currentUser = currentUser(authentication);
        if (currentUser == null || !"doctor".equalsIgnoreCase(currentUser.getRole())
                || !currentUser.getUser_id().equals(doctorReportId)) {
            response.put("error", "Only the assigned doctor can upload this report.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        Optional<BookingInfoEntity> bookingOptional = bookingRepo.findById(bookingId);
        if (bookingOptional.isEmpty()) {
            response.put("error", "Appointment not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        BookingInfoEntity booking = bookingOptional.get();
        if (!currentUser.getUser_id().equals(booking.getDoctor_id())
                || !booking.getBooking_date().equals(bookingDate)) {
            response.put("error", "You are not authorised to update this appointment.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        if (file == null || file.isEmpty() || file.getSize() > MAX_PDF_SIZE
                || (file.getContentType() != null && !"application/pdf".equalsIgnoreCase(file.getContentType()))
                || file.getOriginalFilename() == null || !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            response.put("error", "Please upload a valid PDF file up to 20 MB.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            ReportInfoEntity report = new ReportInfoEntity();
            report.setBooking_report_id(bookingId);
            report.setPatient_report_name(patientReportName);
            report.setDoctor_report_id(currentUser.getUser_id());
            report.setBooking_date(bookingDate);
            report.setBookingInfoEntity(booking);
            report.setPdfContent(file.getBytes());
            ReportInfoEntity saved = reportRepo.save(report);

            response.put("message", "File uploaded successfully");
            response.put("report_id", saved.getReport_id());
            return ResponseEntity.ok(response);
        } catch (Exception exception) {
            response.put("error", "Report processing failed. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/downloadReport")
    public ResponseEntity<byte[]> downloadReport(
            @RequestParam("report_id") String reportId,
            Authentication authentication) {
        UserInfoEntity currentUser = currentUser(authentication);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<ReportInfoEntity> reportOptional = reportRepo.findById(reportId);
        if (reportOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ReportInfoEntity report = reportOptional.get();
        Optional<BookingInfoEntity> bookingOptional = bookingRepo.findById(report.getBooking_report_id());
        if (bookingOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        BookingInfoEntity booking = bookingOptional.get();
        boolean isAssignedDoctor = "doctor".equalsIgnoreCase(currentUser.getRole())
                && currentUser.getUser_id().equals(booking.getDoctor_id());
        boolean isOwningPatient = "patient".equalsIgnoreCase(currentUser.getRole())
                && currentUser.getUser_id().equals(booking.getPatient_id());
        if (!isAssignedDoctor && !isOwningPatient) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        byte[] pdfContent = report.getPdfContent();
        if (pdfContent == null || pdfContent.length == 0) {
            return ResponseEntity.notFound().build();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Report_" + reportId + ".pdf");
        headers.setContentLength(pdfContent.length);
        return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
    }

    private UserInfoEntity currentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserInfoEntity)) {
            return null;
        }
        return (UserInfoEntity) authentication.getPrincipal();
    }
}
