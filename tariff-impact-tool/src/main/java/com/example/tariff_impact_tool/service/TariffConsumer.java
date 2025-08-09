package com.example.tariff_impact_tool.service;



import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class TariffConsumer {

    @KafkaListener(topics = "tariff-updates", groupId = "tariff-group")
    public void consume(String message) {
        System.out.println("Received Kafka message: " + message);
    }
}