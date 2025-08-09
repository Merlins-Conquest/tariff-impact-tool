package com.example.tariff_impact_tool.repository;

import com.example.tariff_impact_tool.model.ImpactResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImpactResultRepository extends JpaRepository<ImpactResult, Long> {
}
