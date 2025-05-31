package com.example.correos_pacientes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.correos_pacientes.model.Reminder;
import java.util.List;

public interface IReminder extends JpaRepository<Reminder, Integer> {
    List<Reminder> findBySuspendedFalse();
}
