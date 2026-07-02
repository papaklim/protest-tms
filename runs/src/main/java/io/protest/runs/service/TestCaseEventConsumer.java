package io.protest.runs.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import io.protest.runs.data.entity.CachedTestcaseEntity;
import io.protest.runs.data.repository.CachedTestcaseRepository;
import io.protest.webutils.event.TestcaseEvent;

@Service
public class TestCaseEventConsumer {
    private final CachedTestcaseRepository cachedTestcaseRepository;

    public TestCaseEventConsumer(CachedTestcaseRepository cachedTestcaseRepository) {
        this.cachedTestcaseRepository = cachedTestcaseRepository;
    }

    @KafkaListener(topics = "testcase-events", groupId = "protest-runs-group")
    public void consume(TestcaseEvent event) {
        if ("DELETE".equals(event.actionType())) {
            cachedTestcaseRepository.deleteById(event.id());
        } else {
            CachedTestcaseEntity cached = new CachedTestcaseEntity();
            cached.setId(event.id());
            cached.setTitle(event.title());
            cachedTestcaseRepository.save(cached);
        }
    }
}
