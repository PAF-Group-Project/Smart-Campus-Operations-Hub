package com.groupxx.smartcampus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.groupxx.smartcampus", "com.smartcampus.booking"})
@EnableMongoRepositories(basePackages = {"com.groupxx.smartcampus", "com.smartcampus.booking"})
@EnableMongoAuditing
public class SmartCampusApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartCampusApplication.class, args);
	}

}
