package com.example.correos_pacientes.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.correos_pacientes.DTO.ReminderDTO;
import com.example.correos_pacientes.DTO.responseDTO;

import com.example.correos_pacientes.model.Reminder;

import com.example.correos_pacientes.repository.IReminder;

@Service
public class ReminderService {
    @Autowired
    private IReminder repository;

    // listar usuarios que si quieren recibir recordatorios
    public List<Reminder> findAllReminder() {
        return repository.findBySuspendedFalse();
    }

    // listar todas las columnas
    public List<Reminder> findAll() {
        return repository.findAll();
    }

    // lista segun el id
    public Optional<Reminder> findById(int id) {
        return repository.findById(id);
    }

    // eliminar por id
    public responseDTO deleteReminder(int id) {
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

    // Guardar o actualizar un recordatorio
    public responseDTO save(ReminderDTO reminderDTO) {
        // Validaciones básicas
        if (reminderDTO.getPatient() == null) {
            return new responseDTO(HttpStatus.BAD_REQUEST.toString(), "Debe especificar un paciente.");
        }

        if (reminderDTO.getMedicine() == null) {
            return new responseDTO(HttpStatus.BAD_REQUEST.toString(), "Debe especificar un medicamento.");
        }

        if (reminderDTO.getDate() == null) {
            return new responseDTO(HttpStatus.BAD_REQUEST.toString(), "La fecha no puede estar vacía.");
        }

        if (reminderDTO.getTime() == null) {
            return new responseDTO(HttpStatus.BAD_REQUEST.toString(), "La hora no puede estar vacía.");
        }

        // Convertir DTO a entidad Reminder
        Reminder reminder = convertToDTO(reminderDTO); // <-- Aquí estaba el error original

        // ¿Es actualización o nuevo?
        if (reminderDTO.getId() > 0) {
            Optional<Reminder> existingReminderOptional = repository.findById(reminderDTO.getId());

            if (!existingReminderOptional.isPresent()) {
                return new responseDTO(HttpStatus.NOT_FOUND.toString(),
                        "El recordatorio con ID " + reminderDTO.getId() + " no fue encontrado.");
            }

            Reminder existingReminder = existingReminderOptional.get();
            existingReminder.setPatient(reminder.getPatient());
            existingReminder.setMedicine(reminder.getMedicine());
            existingReminder.setDate(reminder.getDate());
            existingReminder.setTime(reminder.getTime());
            existingReminder.setConfirmation(reminder.isConfirmation());
            existingReminder.setSuspended(reminder.isSuspended());

            repository.save(existingReminder);
            return new responseDTO(HttpStatus.OK.toString(), "El recordatorio se actualizó correctamente.");
        } else {
            repository.save(reminder);
            return new responseDTO(HttpStatus.OK.toString(), "El recordatorio se registró correctamente.");
        }
    }

    public ReminderDTO convertToDTO(Reminder reminder) {
        return new ReminderDTO(
                reminder.getId(),
                reminder.getPatient(),
                reminder.getMedicine(),
                reminder.getDate(),
                reminder.getTime(),
                reminder.isConfirmation(),
                reminder.isSuspended());
    }

    public Reminder convertToDTO(ReminderDTO reminderDTO) {
        return new Reminder(
                reminderDTO.getId(),
                reminderDTO.getPatient(),
                reminderDTO.getMedicine(),
                reminderDTO.getDate(),
                reminderDTO.getTime(),
                reminderDTO.isConfirmation(),
                reminderDTO.isSuspended());
    }

}
