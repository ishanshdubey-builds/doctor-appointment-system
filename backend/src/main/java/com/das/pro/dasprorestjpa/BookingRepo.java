package com.das.pro.dasprorestjpa;

// Import Spring Data Repository interface to provide basic CRUD operations automatically
import org.springframework.data.repository.CrudRepository;

// Declare an interface extending CrudRepository pointing to BookingInfoEntity representing DB mapping
// Using String as the secondary generic mapping to the explicit Primary Key type of the Entity
public interface BookingRepo extends CrudRepository<BookingInfoEntity, String> {

}
