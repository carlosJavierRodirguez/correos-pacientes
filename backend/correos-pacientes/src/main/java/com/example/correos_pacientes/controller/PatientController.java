package com.example.correos_pacientes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.correos_pacientes.DTO.PatientDTO;
import com.example.correos_pacientes.DTO.responseDTO;
import com.example.correos_pacientes.service.PatientService;

@RestController
@RequestMapping("/api/v1/patient")
public class PatientController {
    @Autowired
    private PatientService patientService;

    // guarda los datos
    @PostMapping("/")
    public ResponseEntity<Object> registerPatient(@RequestBody PatientDTO patientDTO) {
        responseDTO respuesta = patientService.save(patientDTO);
        return new ResponseEntity<>(respuesta, HttpStatus.OK);
    }

    // lista los datos de la tabla patient
    @GetMapping("/")
    public ResponseEntity<Object> getAllPatient() {
        var patientList = patientService.findAll();
        return new ResponseEntity<>(patientList, HttpStatus.OK);
    }

    // borrar por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletePatient(@PathVariable int id) {
        var message = patientService.deletePatient(id);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}
