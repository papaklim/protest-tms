package io.protest.cases.service;

import java.util.List;
import java.util.UUID;

import org.apache.tomcat.util.http.parser.TE;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.protest.cases.data.entity.TestcaseEntity;
import io.protest.cases.data.repository.TestсaseRepository;
import io.protest.cases.model.dto.TestcaseDto;
import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class TestcaseService {
    private final TestсaseRepository testсaseRepository;

    public TestcaseService(TestсaseRepository testсaseRepository) {
        this.testсaseRepository = testсaseRepository;
    }

    public TestcaseEntity createTestcase(TestcaseDto testcase) {
        if (testсaseRepository.existsByProjectIdAndTitle(testcase.projectId(), testcase.title())) {
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
        return testсaseRepository.save(testcaseEntity);
    }

    @Transactional(readOnly = true)
    public TestcaseDto getTestcaseById(UUID id) {
        return testсaseRepository.findById(id).map(TestcaseDto::fromEntity).orElseThrow(
                () -> new EntityNotFoundException("Testcase not found"));
    }

    public TestcaseDto updateTestcase(UUID id, TestcaseDto testcase) {
        TestcaseEntity testcaseEntity = testсaseRepository.findById(id).orElseThrow(
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

        TestcaseEntity updated = testсaseRepository.save(testcaseEntity);
        return TestcaseDto.fromEntity(updated);
    }

    public void deleteTestcase(UUID id) {
        if (!testсaseRepository.existsById(id)) {
            throw new EntityNotFoundException("Testcase not found");
        }
        testсaseRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<TestcaseEntity> getAllTestcasesByProjectId(UUID projectId) {
        return testсaseRepository.findAllByProjectId(projectId);
    }
}
