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

import com.example.correos_pacientes.DTO.ReminderDTO;
import com.example.correos_pacientes.DTO.responseDTO;

import com.example.correos_pacientes.service.ReminderService;

@RestController
@RequestMapping("/api/v1/reminder")
public class ReminderController {
    @Autowired
    private ReminderService reminderService;

    // guarda los datos
    @PostMapping("/")
    public ResponseEntity<Object> registerReminder(@RequestBody ReminderDTO reminderDTO) {
        responseDTO respuesta = reminderService.save(reminderDTO);
        return new ResponseEntity<>(respuesta, HttpStatus.OK);
    }

    // lista los datos de la tabla patient
    @GetMapping("/")
    public ResponseEntity<Object> getAll() {
        var patientList = reminderService.findAll();
        return new ResponseEntity<>(patientList, HttpStatus.OK);
    }

    // borrar por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteReminder(@PathVariable int id) {
        var message = reminderService.deleteReminder(id);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}
