package com.example.correos_pacientes.DTO;

import java.time.LocalDate;
import java.time.LocalTime;

import com.example.correos_pacientes.model.Medicine;
import com.example.correos_pacientes.model.Patient;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReminderDTO {
    private int id;
    private Patient patient;
    private Medicine medicine;
    private LocalDate date;
    private LocalTime time;
    private boolean confirmation;
    private boolean suspended;
}
