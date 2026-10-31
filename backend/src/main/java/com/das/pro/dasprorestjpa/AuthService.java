package com.das.pro.dasprorestjpa;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final LoginRepo loginRepo;
    private final DoctorRepo doctorRepo;
    private final PatientRepo patientRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(LoginRepo loginRepo, DoctorRepo doctorRepo, PatientRepo patientRepo,
                       PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.loginRepo = loginRepo;
        this.doctorRepo = doctorRepo;
        this.patientRepo = patientRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String authenticateUser(String userId, String rawPassword) throws Exception {
        if (userId == null || userId.isBlank() || rawPassword == null || rawPassword.isBlank()) {
            throw new Exception("Invalid credentials");
        }
        UserInfoEntity user = loginRepo.findById(userId)
                .orElseThrow(() -> new Exception("Invalid credentials"));
        if (user.getPassword() == null || !passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new Exception("Invalid credentials");
        }
        return jwtUtil.generateToken(user.getUser_id(), user.getRole());
    }

    @Transactional
    public void registerUser(UserInfoEntity user) throws Exception {
        if (user == null || user.getUser_id() == null || user.getUser_id().isBlank()
                || user.getName() == null || user.getName().isBlank()
                || user.getPassword() == null || user.getPassword().length() < 8
                || user.getRole() == null || user.getRole().isBlank()) {
            throw new Exception("Name, username, role and a password of at least 8 characters are required");
        }

        if (loginRepo.existsById(user.getUser_id())) {
            throw new Exception("User ID already exists");
        }

        boolean isDoctor = "Doctor".equalsIgnoreCase(user.getRole());
        boolean isPatient = "Patient".equalsIgnoreCase(user.getRole());
        if (!isDoctor && !isPatient) {
            throw new Exception("Role must be Patient or Doctor");
        }
        if (isDoctor && (user.getSpecification() == null || user.getSpecification().isBlank()
                || user.getHospital_address() == null || user.getHospital_address().isBlank())) {
            throw new Exception("Doctor speciality and hospital address are required");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (isDoctor) {
            DoctorInfoEntity doctor = new DoctorInfoEntity();
            doctor.setDoctor_id(user.getUser_id());
            doctor.setDoctor_name(user.getName());
            doctor.setSpecification(user.getSpecification());
            doctor.setHospital_address(user.getHospital_address());
            doctor.setOfficial_contact(user.getOfficial_contact());
            doctor.setOfficial_email_id(user.getOfficial_email_id() != null
                    ? user.getOfficial_email_id() : user.getEmail_id());
            doctor.setUserInfoEntity(user);
            doctorRepo.save(doctor);
        } else {
            PatientInfoEntity patient = new PatientInfoEntity();
            patient.setPatient_id(user.getUser_id());
            patient.setAge(user.getDate_of_birth());
            patient.setContact(user.getContact());
            patient.setUserInfoEntity(user);
            patientRepo.save(patient);
        }

        // The profile owns the one-to-one association and cascades its user record.
        loginRepo.save(user);
    }
}
