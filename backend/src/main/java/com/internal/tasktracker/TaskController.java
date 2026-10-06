package com.internal.tasktracker;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private static final int MAX_PAGE_SIZE = 100;

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping("/api/tasks")
    public ResponseEntity<Map<String, Object>> searchTasks(
            @RequestParam(required = false, defaultValue = "") String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize) {

        String query = q == null ? "" : q.trim();
        String searchTerm = "%" + query.toLowerCase(Locale.ROOT) + "%";

        // Unknown status is a client error (400), not a server error (500).
        String normalizedStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                normalizedStatus = TaskStatus.valueOf(status.trim().toUpperCase(Locale.ROOT)).name();
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: " + status);
            }
        }

        // Clamp paging input so page=0, pageSize=-5 or pageSize=1000000 can't break or hammer the API.
        int safePage = Math.max(page, 1);
        int safePageSize = Math.min(Math.max(pageSize, 1), MAX_PAGE_SIZE);

        // id is a tie-breaker so pages are stable when created_at values are equal.
        Pageable pageable = PageRequest.of(safePage - 1, safePageSize,
                Sort.by(Sort.Direction.DESC, "createdAt").and(Sort.by(Sort.Direction.DESC, "id")));

        Page<Task> result = taskRepository.searchTasks(searchTerm, normalizedStatus, pageable);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("items", result.getContent());
        response.put("total", result.getTotalElements());
        response.put("page", safePage);
        response.put("pageSize", safePageSize);

        return ResponseEntity.ok(response);
    }
}
