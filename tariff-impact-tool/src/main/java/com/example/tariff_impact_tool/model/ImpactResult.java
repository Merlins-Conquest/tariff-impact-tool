package com.example.tariff_impact_tool.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ImpactResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long shipmentId;
    private Double oldCost;
    private Double newCost;
    private Double impactPercent;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Long getShipmentId() {
        return shipmentId;
    }
    public void setShipmentId(Long shipmentId) {
        this.shipmentId = shipmentId;
    }
    public Double getOldCost() {
        return oldCost;
    }
    public void setOldCost(Double oldCost) {
        this.oldCost = oldCost;
    }
    public Double getNewCost() {
        return newCost;
    }
    public void setNewCost(Double newCost) {
        this.newCost = newCost;
    }
    public Double getImpactPercent() {
        return impactPercent;
    }
    public void setImpactPercent(Double impactPercent) {
        this.impactPercent = impactPercent;
    }
}
