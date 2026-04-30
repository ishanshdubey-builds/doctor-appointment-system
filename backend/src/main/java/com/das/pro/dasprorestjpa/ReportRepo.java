package com.das.pro.dasprorestjpa;

// Import CrudRepository abstracting manual SQL statements
import org.springframework.data.repository.CrudRepository;

// Repository interface bridging the Report DB mapping utilizing String UUID keys
public interface ReportRepo extends CrudRepository<ReportInfoEntity, String> {

}
