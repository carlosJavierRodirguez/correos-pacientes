package com.example.correos_pacientes.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDTO {
    private int id;
    private String name;
    private String email;
    private String telephone;
}
