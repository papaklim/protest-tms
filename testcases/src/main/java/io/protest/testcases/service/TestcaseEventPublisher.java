package io.protest.testcases.service;

import java.util.UUID;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import io.protest.webutils.event.TestcaseEvent;

@Service
public class TestcaseEventPublisher {
    private static final String TOPIC = "testcase-events";
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public TestcaseEventPublisher(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishCreate(UUID id, UUID projectId, String title) {
        TestcaseEvent event = new TestcaseEvent(id, projectId, title, "CREATE");
        kafkaTemplate.send(TOPIC, id.toString(), event);
    }

    public void publishUpdate(UUID id, UUID projectId, String title) {
        TestcaseEvent event = new TestcaseEvent(id, projectId, title, "UPDATE");
        kafkaTemplate.send(TOPIC, id.toString(), event);
    }

    public void publishDelete(UUID id) {
        TestcaseEvent event = new TestcaseEvent(id, null, null, "DELETE");
        kafkaTemplate.send(TOPIC, id.toString(), event);
    }
}
