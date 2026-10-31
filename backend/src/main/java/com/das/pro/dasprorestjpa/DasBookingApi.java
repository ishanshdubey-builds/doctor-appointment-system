package com.das.pro.dasprorestjpa;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DasBookingApi {
    private final BookingRepo bookingRepo;
    private final DoctorRepo doctorRepo;

    public DasBookingApi(BookingRepo bookingRepo, DoctorRepo doctorRepo) {
        this.bookingRepo = bookingRepo;
        this.doctorRepo = doctorRepo;
    }

    @PostMapping("/Patientbooking")
    public ResponseEntity<Map<String, Object>> createBooking(
            @RequestBody BookingInfoEntity booking,
            Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        UserInfoEntity currentUser = currentUser(authentication);
        if (currentUser == null || !"patient".equalsIgnoreCase(currentUser.getRole())) {
            response.put("error", "Only authenticated patient accounts can create appointments.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        if (booking == null
                || isBlank(booking.getPatient_name())
                || booking.getAge() == null || booking.getAge() < 1 || booking.getAge() > 120
                || booking.getContact() == null || booking.getContact() < 1
                || booking.getBooking_date() == null
                || booking.getBooking_time() == null
                || isBlank(booking.getBooking_type())
                || isBlank(booking.getPayment_mode())
                || isBlank(booking.getDoctor_id())) {
            response.put("error", "Please complete all appointment details with valid values.");
            return ResponseEntity.badRequest().body(response);
        }

        if (!doctorRepo.existsById(booking.getDoctor_id())) {
            response.put("error", "The selected doctor is no longer available.");
            return ResponseEntity.badRequest().body(response);
        }

        // Never trust a patient ID supplied by the browser; derive ownership from the JWT.
        booking.setPatient_id(currentUser.getUser_id());
        try {
            BookingInfoEntity saved = bookingRepo.save(booking);
            response.put("booking_id", saved.getBooking_id());
            response.put("booking_name", saved.getPatient_name());
            response.put("booking_date", saved.getBooking_date());
            response.put("booking_time", saved.getBooking_time());
            response.put("booking_type", saved.getBooking_type());
            return ResponseEntity.ok(response);
        } catch (RuntimeException exception) {
            response.put("error", "The appointment could not be saved. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/booking")
    public ResponseEntity<List<BookingInfoEntity>> getMyBookings(Authentication authentication) {
        UserInfoEntity currentUser = currentUser(authentication);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<BookingInfoEntity> visibleBookings = new ArrayList<>();
        for (BookingInfoEntity booking : bookingRepo.findAll()) {
            if ("doctor".equalsIgnoreCase(currentUser.getRole())
                    && currentUser.getUser_id().equals(booking.getDoctor_id())) {
                visibleBookings.add(booking);
            } else if ("patient".equalsIgnoreCase(currentUser.getRole())
                    && currentUser.getUser_id().equals(booking.getPatient_id())) {
                visibleBookings.add(booking);
            }
        }
        return ResponseEntity.ok(visibleBookings);
    }

    private UserInfoEntity currentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserInfoEntity)) {
            return null;
        }
        return (UserInfoEntity) authentication.getPrincipal();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
