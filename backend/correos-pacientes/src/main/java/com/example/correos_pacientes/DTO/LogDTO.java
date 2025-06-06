package com.example.correos_pacientes.DTO;

import com.example.correos_pacientes.model.Reminder;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogDTO {
    private int id;
    private Reminder reminder;
     private String name;
}
