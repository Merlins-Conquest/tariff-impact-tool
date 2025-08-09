package com.example.tariff_impact_tool.service;

import com.example.tariff_impact_tool.model.*;
import com.example.tariff_impact_tool.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TariffService {

    private final TariffRepository tariffRepository;
    private final ShipmentRepository shipmentRepository;
    private final ImpactResultRepository impactResultRepository;

    public TariffService(TariffRepository tariffRepository,
                         ShipmentRepository shipmentRepository,
                         ImpactResultRepository impactResultRepository) {
        this.tariffRepository = tariffRepository;
        this.shipmentRepository = shipmentRepository;
        this.impactResultRepository = impactResultRepository;
    }

    public void applyTariff(Tariff tariff) {
        // Save the new tariff record
        tariffRepository.save(tariff);
        // Recalculate impacts for all shipments with matching commodity
        List<Shipment> shipments = shipmentRepository.findByCommodity(tariff.getCommodity());
        for (Shipment s : shipments) {
            double oldCost = s.getBaseCost();
            double newCost = oldCost * (1 + tariff.getRate());
            ImpactResult result = new ImpactResult();
            result.setShipmentId(s.getId());
            result.setOldCost(oldCost);
            result.setNewCost(newCost);
            result.setImpactPercent(tariff.getRate() * 100);
            impactResultRepository.save(result);
        }
        // Simulated Kafka output (log)
        System.out.println("Simulated Kafka: Tariff applied for commodity " + tariff.getCommodity());
    }

    public List<ImpactResult> getAllImpacts() {
        return impactResultRepository.findAll();
    }
}
