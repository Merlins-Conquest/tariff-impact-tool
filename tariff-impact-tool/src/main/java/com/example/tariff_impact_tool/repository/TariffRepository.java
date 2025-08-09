package com.example.tariff_impact_tool.repository;

import com.example.tariff_impact_tool.model.Tariff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TariffRepository extends JpaRepository<Tariff, Long> {
}
