package com.example.notes.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.notes.model.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    Optional<Note> findBySlugAndIsPublicTrue(String slug);
}
