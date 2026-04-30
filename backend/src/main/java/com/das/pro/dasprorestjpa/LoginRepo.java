package com.das.pro.dasprorestjpa;

// Import standard CrudRepository interface generating DB implementations behind the scenes
import org.springframework.data.repository.CrudRepository;

// Interface establishing DB abstraction layer for Login details mapping specifically UserInfoEntity
public interface LoginRepo extends CrudRepository<UserInfoEntity, String> {

}
