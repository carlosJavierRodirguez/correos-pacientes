package com.example.correos_pacientes.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.correos_pacientes.DTO.MedicineDTO;

import com.example.correos_pacientes.DTO.responseDTO;
import com.example.correos_pacientes.model.Medicine;

import com.example.correos_pacientes.repository.IMedicine;

@Service
public class MedicineService {
    @Autowired
    private IMedicine repository;

    // listar todas las columnas
    public List<Medicine> findAll() {
        return repository.findAll();
    }

    // lista el medicina segun el id
    public Optional<Medicine> findById(int id) {
        return repository.findById(id);
    }

    // eliminar un medicina por id
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

    // guardar o actualizar un medicina
    public responseDTO save(MedicineDTO medicineDTO) {
        // Validaciones básicas
        if (medicineDTO.getName() == null || medicineDTO.getName().isEmpty()) {
            return new responseDTO(HttpStatus.BAD_REQUEST.toString(),
                    "El nombre del medicamento no puede estar vacío.");
        }

        if (medicineDTO.getName().length() > 100) {
            return new responseDTO(HttpStatus.BAD_REQUEST.toString(),
                    "El nombre del medicamento no puede superar los 100 caracteres.");
        }

        if (medicineDTO.getExpiration() == null) {
            return new responseDTO(HttpStatus.BAD_REQUEST.toString(), "La fecha de expiración no puede estar vacía.");
        }

        if (medicineDTO.getPharmaceuticals() == null || medicineDTO.getPharmaceuticals().isEmpty()) {
            return new responseDTO(HttpStatus.BAD_REQUEST.toString(),
                    "El laboratorio farmacéutico no puede estar vacío.");
        }

        if (medicineDTO.getPharmaceuticals().length() > 100) {
            return new responseDTO(HttpStatus.BAD_REQUEST.toString(),
                    "El laboratorio farmacéutico no puede superar los 100 caracteres.");
        }

        // Convertimos el DTO a entidad
        Medicine medicine = convertToModel(medicineDTO);

        // ¿Es actualización o nuevo?
        if (medicineDTO.getId() > 0) {
            Optional<Medicine> existingMedicineOptional = repository.findById(medicineDTO.getId());

            if (!existingMedicineOptional.isPresent()) {
                return new responseDTO(HttpStatus.NOT_FOUND.toString(),
                        "La medicina con ID " + medicineDTO.getId() + " no fue encontrada.");
            }

            // Actualizar datos
            Medicine existingMedicine = existingMedicineOptional.get();
            existingMedicine.setName(medicine.getName());
            existingMedicine.setExpiration(medicine.getExpiration());
            existingMedicine.setPharmaceuticals(medicine.getPharmaceuticals());

            repository.save(existingMedicine);

            return new responseDTO(HttpStatus.OK.toString(), "La medicina se actualizó correctamente.");
        } else {
            // Guardar nueva medicina
            repository.save(medicine);
            return new responseDTO(HttpStatus.OK.toString(), "La medicina se registró correctamente.");
        }
    }

    public Medicine convertToModel(MedicineDTO medicineDTO) {
        return new Medicine(
                medicineDTO.getId(),
                medicineDTO.getName(),
                medicineDTO.getExpiration(),
                medicineDTO.getPharmaceuticals());
    }

    public MedicineDTO convertToDTO(Medicine medicine) {
        return new MedicineDTO(
                medicine.getId(),
                medicine.getName(),
                medicine.getExpiration(),
                medicine.getPharmaceuticals());
    }

}
