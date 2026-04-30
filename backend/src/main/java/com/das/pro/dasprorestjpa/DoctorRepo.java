package com.das.pro.dasprorestjpa;

// Import Spring Data Repository interface allowing abstraction of data access layer logic
import org.springframework.data.repository.CrudRepository;

// Interface extending CrudRepository explicitly typing DoctorInfoEntity and mapping its Primary Key (String)
public interface DoctorRepo extends CrudRepository<DoctorInfoEntity, String> {

}
