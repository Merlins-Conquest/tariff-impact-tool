package com.example.tariff_impact_tool.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

@Service
public class TariffConsumer {

    // simple in-memory buffer so you can see messages at /feed/latest
    private final LinkedList<String> recent = new LinkedList<>();

    // Use env-driven topic & group:
    // EH_TOPIC (e.g., tariffs-events), GROUP_ID (e.g., tracking-ui)
    @KafkaListener(topics = "${EH_TOPIC}", groupId = "${GROUP_ID:tracking-ui}")
    public void consume(String message) {
        System.out.println("Received Kafka message: " + message); // ok for demo
        synchronized (recent) {
            recent.addFirst(message);
            if (recent.size() > 100) recent.removeLast();
        }
    }

    public List<String> latest() {
        synchronized (recent) {
            return Collections.unmodifiableList(new LinkedList<>(recent));
        }
    }
}
