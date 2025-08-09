package com.example.tariff_impact_tool.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/demo")
@CrossOrigin(origins = "*") // ok for demo
public class DemoProducerController {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final String topic;

    public DemoProducerController(
            KafkaTemplate<String, String> kafkaTemplate,
            @Value("${EH_TOPIC:tariffs-events}") String topic) {
        this.kafkaTemplate = kafkaTemplate;
        this.topic = topic;
    }

    @PostMapping("/send")
    public String send(@RequestBody String payload) {
        kafkaTemplate.send(topic, payload);
        return "Sent to " + topic;
    }
}
