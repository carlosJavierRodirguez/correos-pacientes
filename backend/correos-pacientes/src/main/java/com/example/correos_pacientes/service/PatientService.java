package com.example.correos_pacientes.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.correos_pacientes.DTO.PatientDTO;
import com.example.correos_pacientes.DTO.responseDTO;
import com.example.correos_pacientes.model.Patient;
import com.example.correos_pacientes.repository.IPatient;

@Service
public class PatientService {

    @Autowired
    private IPatient repository;

    // listar todas las columnas
    public List<Patient> findAll() {
        return repository.findAll();
    }

    // lista el paciente segun el id
    public Optional<Patient> findById(int id) {
        return repository.findById(id);
    }

    public responseDTO save(PatientDTO patientDTO) {
        // Validaciones básicas
        if (patientDTO.getName() == null || patientDTO.getName().isEmpty()) {
            return new responseDTO(HttpStatus.BAD_REQUEST.toString(), "El nombre no puede estar vacío.");
        }

        if (patientDTO.getEmail() == null || patientDTO.getEmail().isEmpty()) {
            return new responseDTO(HttpStatus.BAD_REQUEST.toString(), "El email no puede estar vacío.");
        }

        if (patientDTO.getTelephone() == null || patientDTO.getTelephone().isEmpty()) {
            return new responseDTO(HttpStatus.BAD_REQUEST.toString(), "El teléfono no puede estar vacío.");
        }

        // Convertimos el DTO a entidad
        Patient patient = convertToModel(patientDTO);

        // ¿Es actualización o nuevo?
        if (patientDTO.getId() > 0) {
            Optional<Patient> existingPatientOptional = repository.findById(patientDTO.getId());

            if (!existingPatientOptional.isPresent()) {
                return new responseDTO(HttpStatus.NOT_FOUND.toString(),
                        "El paciente con ID " + patientDTO.getId() + " no fue encontrado.");
            }

            // Actualizar datos
            Patient existingPatient = existingPatientOptional.get();
            existingPatient.setName(patient.getName());
            existingPatient.setEmail(patient.getEmail());
            existingPatient.setTelephone(patient.getTelephone());

            repository.save(existingPatient);

            return new responseDTO(HttpStatus.OK.toString(), "El paciente se actualizó correctamente.");
        } else {
            // Guardar nuevo paciente
            repository.save(patient);
            return new responseDTO(HttpStatus.OK.toString(), "El paciente se registró correctamente.");
        }
    }

    public responseDTO deletePatient(int id) {
        if (!findById(id).isPresent()) {
            return new responseDTO(
                    HttpStatus.OK.toString(),
                    "El registro no existe.");
        }
        repository.deleteById(id);
        return new responseDTO(
                HttpStatus.OK.toString(),
                "Se eliminó correctamente.");
    }

    public Patient convertToModel(PatientDTO patientDTO) {
        return new Patient(
                patientDTO.getId(),
                patientDTO.getName(),
                patientDTO.getEmail(),
                patientDTO.getTelephone());
    }

    public PatientDTO convertToDTO(Patient patient) {
        return new PatientDTO(
                patient.getId(),
                patient.getName(),
                patient.getEmail(),
                patient.getTelephone());
    }

}
