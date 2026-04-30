package com.das.pro.dasprorestjpa;

// Core Spring Data import generating repository implementations automatically
import org.springframework.data.repository.CrudRepository;

// Exposes Patient database record logic specifying String as the Patient DB generic primary key
public interface PatientRepo extends CrudRepository<PatientInfoEntity, String> {

}
