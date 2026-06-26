package io.protest.testcases.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.protest.testcases.data.entity.TestcaseEntity;
import io.protest.testcases.data.repository.TestcaseRepository;
import io.protest.testcases.model.dto.TestcaseDto;
import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class TestcaseService {
    private final TestcaseRepository testcaseRepository;
    private final TestcaseEventPublisher testcaseEventPublisher;

    public TestcaseService(TestcaseRepository testcaseRepository, TestcaseEventPublisher testcaseEventPublisher) {
        this.testcaseRepository = testcaseRepository;
        this.testcaseEventPublisher = testcaseEventPublisher;
    }

    public TestcaseDto createTestcase(TestcaseDto testcase) {
        if (testcaseRepository.existsByProjectIdAndTitle(testcase.projectId(), testcase.title())) {
            throw new IllegalArgumentException("Testcase with this title already exists in the project");
        }
        TestcaseEntity testcaseEntity = new TestcaseEntity();
        testcaseEntity.setProjectId(testcase.projectId());
        testcaseEntity.setTitle(testcase.title());
        testcaseEntity.setDescription(testcase.description());
        testcaseEntity.setExpectedResult(testcase.expectedResult());
        testcaseEntity.setTestType(testcase.testType());
        testcaseEntity.setPreconditions(testcase.preconditions());
        testcaseEntity.setPostconditions(testcase.postconditions());
        testcaseEntity.setLayer(testcase.layer());
        testcaseEntity.setAutomated(testcase.isAutomated());
        testcaseEntity.setStatus(testcase.status());
        testcaseEntity.setAuthorId(testcase.authorId());
        testcaseEntity.setCreatedAt(testcase.createdAt());
        testcaseEntity.setLastModifiedAt(testcase.lastModifiedAt());
        testcaseRepository.save(testcaseEntity);

        TestcaseEntity saved = testcaseRepository.save(testcaseEntity);

        testcaseEventPublisher.publishCreate(saved.getId(), saved.getProjectId(), saved.getTitle());

        return TestcaseDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public TestcaseDto getTestcaseById(UUID id) {
        return testcaseRepository.findById(id).map(TestcaseDto::fromEntity).orElseThrow(
                () -> new EntityNotFoundException("Testcase not found"));
    }

    public TestcaseDto updateTestcase(UUID id, TestcaseDto testcase) {
        TestcaseEntity testcaseEntity = testcaseRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Testcase not found"));

        testcaseEntity.setTitle(testcase.title());
        testcaseEntity.setDescription(testcase.description());
        testcaseEntity.setExpectedResult(testcase.expectedResult());
        testcaseEntity.setTestType(testcase.testType());
        testcaseEntity.setPreconditions(testcase.preconditions());
        testcaseEntity.setPostconditions(testcase.postconditions());
        testcaseEntity.setLayer(testcase.layer());
        testcaseEntity.setAutomated(testcase.isAutomated());
        testcaseEntity.setStatus(testcase.status());
        testcaseEntity.setAuthorId(testcase.authorId());
        testcaseEntity.setCreatedAt(testcase.createdAt());
        testcaseEntity.setLastModifiedAt(testcase.lastModifiedAt());

        TestcaseEntity updated = testcaseRepository.save(testcaseEntity);

        testcaseEventPublisher.publishUpdate(updated.getId(), updated.getProjectId(), updated.getTitle());

        return TestcaseDto.fromEntity(updated);
    }

    public void deleteTestcase(UUID id) {
        if (!testcaseRepository.existsById(id)) {
            throw new EntityNotFoundException("Testcase not found");
        }
        testcaseRepository.deleteById(id);

        testcaseEventPublisher.publishDelete(id);
    }

    @Transactional(readOnly = true)
    public List<TestcaseDto> getAllTestcasesByProjectId(UUID projectId) {
        return testcaseRepository.findAllByProjectId(projectId).stream().map(TestcaseDto::fromEntity).toList();
    }
}
