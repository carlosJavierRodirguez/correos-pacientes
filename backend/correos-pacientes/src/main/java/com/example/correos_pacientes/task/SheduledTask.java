package com.example.correos_pacientes.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.correos_pacientes.model.Reminder;
import com.example.correos_pacientes.service.EmailService;
import com.example.correos_pacientes.service.ReminderService;

import java.util.List;

@Component
public class SheduledTask {
    @Autowired
    private EmailService emailService;

    @Autowired
    private ReminderService reminderService;

    // @Scheduled(fixedRate = 5000) 
    // public void taskeRecordatorio() {
    //     List<Reminder> reminders = reminderService.findAllReminder();

    //     for (Reminder reminder : reminders) {
    //         String email = reminder.getPatient().getEmail();
    //         String name = reminder.getPatient().getName();
    //         String medicine = reminder.getMedicine().getName();
    //         String date = reminder.getDate().toString();
    //         String time = reminder.getTime().toString();

    //         emailService.avancedEmail(email, name, medicine, date, time);
    //         System.out.println("Correo enviado a: " + email);
    //     }
    // }
}
