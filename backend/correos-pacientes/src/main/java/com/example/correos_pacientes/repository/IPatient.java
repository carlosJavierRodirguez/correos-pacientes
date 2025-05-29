package com.example.correos_pacientes.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.correos_pacientes.model.Patient;

public interface IPatient extends JpaRepository<Patient, Integer> {

}
