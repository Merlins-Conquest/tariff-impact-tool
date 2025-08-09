package com.example.tariff_impact_tool.controller;

import com.example.tariff_impact_tool.service.TariffConsumer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class FeedController {

    private final TariffConsumer consumer;

    public FeedController(TariffConsumer consumer) {
        this.consumer = consumer;
    }

    @GetMapping("/feed/latest")
    public List<String> latest() {
        return consumer.latest();
    }
}
