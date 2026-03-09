package com.example.demo.controller;

import com.example.demo.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/assist")
public Map<String, String> assist(@RequestBody Map<String, String> request) {
    String action = request.getOrDefault("action", "summarize");
    String context = request.getOrDefault("context", "");

    String prompt;
    if ("breakdown".equals(action)) {
        prompt = "Break this goal into 5 clear, actionable tasks: " + context;
    } else if ("prioritize".equals(action)) {
        prompt = "Given these tasks, which should I do first and why? Be concise: " + context;
    } else {
        prompt = "Summarize these tasks concisely in 3-4 sentences: " + context;
    }

    String result = aiService.ask(prompt);
    return Map.of("response", result);
    }
}