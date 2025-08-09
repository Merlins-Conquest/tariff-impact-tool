package com.example.tariff_impact_tool.controller;

import com.example.tariff_impact_tool.model.Tariff;
import com.example.tariff_impact_tool.service.TariffService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/tariffs")
@CrossOrigin(origins = "*")  // enable CORS for demo
public class TariffController {

    private final TariffService tariffService;

    public TariffController(TariffService tariffService) {
        this.tariffService = tariffService;
    }

    // Accept new tariffs from API (simulate event)
    @PostMapping("/update")
    public String updateTariff(@RequestBody Tariff tariff) {
        if (tariff.getEffectiveDate() == null) {
            tariff.setEffectiveDate(LocalDate.now());
        }
        tariffService.applyTariff(tariff);
        return "Tariff update applied";
    }

    // Fetch all impact results
    @GetMapping("/impact")
    public List<?> getImpacts() {
        return tariffService.getAllImpacts();
    }
}
