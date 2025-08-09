package com.example.tariff_impact_tool.service;

import com.example.tariff_impact_tool.model.Tariff;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

@Service
public class TariffConsumer {

    private final LinkedList<String> recent = new LinkedList<>();
    private final ObjectMapper mapper = new ObjectMapper();
    private final TariffService tariffService;

    public TariffConsumer(TariffService tariffService) {
        this.tariffService = tariffService;
    }

    @KafkaListener(
        topics = "${EH_TOPIC:tariffs-events}",
        groupId = "${GROUP_ID:tracking-ui}"
    )
    public void consume(String message) {
        // keep raw for /feed/latest
        synchronized (recent) {
            recent.addFirst(message);
            if (recent.size() > 100) recent.removeLast();
        }

        // parse JSON into Tariff and apply
        try {
            Tariff t = mapper.readValue(message, Tariff.class);

            // basic validation + defaults
            if (t.getCommodity() == null || t.getCommodity().isBlank()) {
                System.err.println("Tariff event missing commodity: " + message);
                return;
            }
            if (t.getRate() == null) {
                System.err.println("Tariff event missing rate: " + message);
                return;
            }
            if (t.getEffectiveDate() == null) {
                t.setEffectiveDate(LocalDate.now());
            }

            tariffService.applyTariff(t);
            System.out.println("Applied tariff from event for commodity " + t.getCommodity());
        } catch (Exception e) {
            System.err.println("Failed to parse tariff event: " + e.getMessage());
        }
    }

    public List<String> latest() {
        synchronized (recent) {
            return Collections.unmodifiableList(new LinkedList<>(recent));
        }
    }
}
