package com.internal.tasktracker;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Search non-archived tasks by term (title OR description) and optional status.
    // The title/description match is parenthesised so that "archived" and "status"
    // apply to BOTH branches (AND binds tighter than OR in SQL).
    // Paging and the total count are done in the database, not in Java.
    @Query("SELECT t FROM Task t "
         + "WHERE t.archived = false "
         + "AND (:status IS NULL OR t.status = :status) "
         + "AND (LOWER(t.title) LIKE :term OR LOWER(t.description) LIKE :term)")
    Page<Task> searchTasks(@Param("term") String term,
                           @Param("status") String status,
                           Pageable pageable);
}
