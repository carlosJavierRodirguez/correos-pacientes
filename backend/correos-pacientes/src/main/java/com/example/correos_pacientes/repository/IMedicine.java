package com.example.correos_pacientes.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.correos_pacientes.model.Medicine;

public interface IMedicine extends JpaRepository<Medicine, Integer> {

}
