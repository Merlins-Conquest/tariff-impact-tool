package com.example.tariff_impact_tool.repository;

import com.example.tariff_impact_tool.model.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findByCommodity(String commodity);
}
