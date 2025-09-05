package com.example.notes.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.notes.model.Note;
import com.example.notes.services.NoteService;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")  // later restrict to your Vercel frontend
public class NoteController {
    @Autowired
    private NoteService service;

    @GetMapping
    public List<Note> listNotes() {
        return service.getAllNotes();
    }

    @PostMapping
    public Note create(@RequestBody Note note) {
        return service.create(note);
    }

    @GetMapping("/{id}")
    public Note getNote(@PathVariable Long id) {
        return service.update(id, new Note());
    }

    @PutMapping("/{id}")
    public Note update(@PathVariable Long id, @RequestBody Note note) {
        return service.update(id, note);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PostMapping("/{id}/share")
    public Note share(@PathVariable Long id) {
        
        return service.share(id);

    }

    @PostMapping("/{id}/unshare")
    public Note unshare(@PathVariable Long id) {
        return service.unshare(id);
    }
}

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")  // later restrict to your Vercel frontend
class ShareController {
    @Autowired
    private NoteService service;

    @GetMapping("/share/{slug}")
    public Note getShared(@PathVariable String slug) {
        return service.getSharedNote(slug);
    }
}

@RestController
class HealthController {
    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}
