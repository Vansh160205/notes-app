package com.example.notes.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.notes.Repositories.NoteRepository;
import com.example.notes.model.Note;

@Service
public class NoteService {
    @Autowired
    private NoteRepository repo;

    public List<Note> getAllNotes() { return repo.findAll(); }

    public Note create(Note note) { return repo.save(note); }

    public Note update(Long id, Note newNote) {
        return repo.findById(id).map(note -> {
            note.setTitle(newNote.getTitle());
            note.setContent(newNote.getContent());
            note.setSlug(newNote.getSlug());
            note.setUpdatedAt(LocalDateTime.now());
            return repo.save(note);
        }).orElseThrow(() -> new RuntimeException("Note not found"));
    }

    public void delete(Long id) { repo.deleteById(id); }

    public Note share(Long id) {
        return repo.findById(id).map(note -> {
            if (note.getSlug() == null) {
                note.setSlug(UUID.randomUUID().toString().substring(0, 10));
            }
            note.setPublic(true);
            return repo.save(note);
        }).orElseThrow(() -> new RuntimeException("Note not found"));
    }

    public Note unshare(Long id) {
        return repo.findById(id).map(note -> {
            note.setPublic(false);
            return repo.save(note);
        }).orElseThrow(() -> new RuntimeException("Note not found"));
    }

    public Note getSharedNote(String slug) {
        return repo.findBySlugAndIsPublicTrue(slug)
                   .orElseThrow(() -> new RuntimeException("Note not found"));
    }
}
