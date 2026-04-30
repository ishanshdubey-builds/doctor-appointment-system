package com.das.pro.dasprorestjpa;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private LoginRepo loginRepo;

    @Autowired
    private DoctorRepo doctorRepo;

    @Autowired
    private PatientRepo patientRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public String authenticateUser(String userId, String rawPassword) throws Exception {
        UserInfoEntity user = loginRepo.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new Exception("Invalid credentials");
        }
        return jwtUtil.generateToken(user.getUser_id(), user.getRole());
    }

    @Transactional
    public void registerUser(UserInfoEntity user) throws Exception {
        if (loginRepo.existsById(user.getUser_id())) {
            throw new Exception("User ID already exists");
        }

        // Hash the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        if ("Doctor".equalsIgnoreCase(user.getRole())) {
            DoctorInfoEntity doc = new DoctorInfoEntity();
            doc.setDoctor_id(user.getUser_id());
            doc.setDoctor_name(user.getName());
            doc.setSpecification(user.getSpecification());
            doc.setHospital_address(user.getHospital_address());
            doc.setOfficial_contact(user.getOfficial_contact());
            doc.setOfficial_email_id(user.getEmail_id());
            doc.setUserInfoEntity(user);
            doctorRepo.save(doc);
        } else {
            PatientInfoEntity pat = new PatientInfoEntity();
            pat.setPatient_id(user.getUser_id());
            pat.setAge(user.getDate_of_birth());
            pat.setContact(user.getContact());
            pat.setUserInfoEntity(user);
            patientRepo.save(pat);
        }
        loginRepo.save(user);
    }
}
