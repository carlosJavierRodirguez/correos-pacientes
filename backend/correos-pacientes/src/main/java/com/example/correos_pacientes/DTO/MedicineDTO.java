package com.example.correos_pacientes.DTO;

import java.time.LocalDate;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicineDTO {
    private int id;
    private String name;
    private LocalDate expiration;
    private String pharmaceuticals;
}
