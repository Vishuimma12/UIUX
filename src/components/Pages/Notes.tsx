import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  FileText, 
  Mic, 
  Edit3, 
  Trash2,
  Calendar,
  Tag
} from 'lucide-react';
import Card from '../UI/Card';
import VoiceButton from '../UI/VoiceButton';
import { useVoice } from '../../hooks/useVoice';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isVoiceNote: boolean;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Meeting Notes - Q3 Review',
      content: 'Key points from the quarterly business review: Revenue up 15%, need to focus on customer retention, launch new product line in Q4.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      tags: ['work', 'meeting'],
      isVoiceNote: false
    },
    {
      id: '2',
      title: 'Weekend Recipe Ideas',
      content: 'Try making homemade pasta with mushroom cream sauce. Also consider making fresh bread and a seasonal salad.',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      tags: ['personal', 'cooking'],
      isVoiceNote: true
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    isVoiceNote: false
  });

  const { isListening, startListening, stopListening } = useVoice();

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addNote = () => {
    if (!newNote.title.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: newNote.tags,
      isVoiceNote: newNote.isVoiceNote
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: '', content: '', tags: [], isVoiceNote: false });
    setShowAddNote(false);
  };

  const updateNote = () => {
    if (!editingNote || !newNote.title.trim()) return;

    setNotes(prev => prev.map(note =>
      note.id === editingNote.id
        ? {
            ...note,
            title: newNote.title,
            content: newNote.content,
            tags: newNote.tags,
            updatedAt: new Date()
          }
        : note
    ));

    setEditingNote(null);
    setNewNote({ title: '', content: '', tags: [], isVoiceNote: false });
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const startEdit = (note: Note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      tags: note.tags,
      isVoiceNote: note.isVoiceNote
    });
    setShowAddNote(true);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      setNewNote(prev => ({ ...prev, isVoiceNote: true }));
    }
  };

  const addTag = (tagText: string) => {
    const tags = tagText.split(',').map(tag => tag.trim()).filter(tag => tag);
    setNewNote(prev => ({ ...prev, tags }));
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <motion.div 
        className="text-center mb-8 pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center space-x-2 mb-2">
          <FileText className="text-purple-400" size={24} />
          <h1 className="text-3xl font-bold text-white">Notes</h1>
        </div>
        <p className="text-white/70">{notes.length} notes saved</p>
      </motion.div>

      {/* Search */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="flex items-center space-x-3">
            <Search className="text-white/50" size={20} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
            />
          </div>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        className="grid grid-cols-2 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={() => setShowAddNote(true)}
          className="backdrop-blur-xl bg-gradient-to-r from-purple-500/30 to-cyan-500/30 border border-white/20 rounded-xl py-4 px-6 text-white font-semibold flex items-center justify-center space-x-2 hover:from-purple-500/40 hover:to-cyan-500/40 transition-all duration-300"
        >
          <Plus size={20} />
          <span>New Note</span>
        </button>

        <div className="flex items-center justify-center">
          <VoiceButton
            isListening={isListening}
            onToggle={handleVoiceToggle}
            size="md"
          />
          <span className="ml-3 text-white/80 text-sm">
            {isListening ? "Recording..." : "Voice Note"}
          </span>
        </div>
      </motion.div>

      {/* Add/Edit Note Modal */}
      <AnimatePresence>
        {showAddNote && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowAddNote(false);
              setEditingNote(null);
              setNewNote({ title: '', content: '', tags: [], isVoiceNote: false });
            }}
          >
            <motion.div
              className="w-full max-w-md max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {editingNote ? 'Edit Note' : 'Add New Note'}
                </h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Note title"
                    value={newNote.title}
                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                  />
                  
                  <textarea
                    placeholder="Write your note here..."
                    value={newNote.content}
                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none"
                    rows={6}
                  />
                  
                  <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={newNote.tags.join(', ')}
                    onChange={(e) => addTag(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                  />

                  {newNote.isVoiceNote && (
                    <div className="flex items-center space-x-2 text-purple-400">
                      <Mic size={16} />
                      <span className="text-sm">Voice Note</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAddNote(false);
                      setEditingNote(null);
                      setNewNote({ title: '', content: '', tags: [], isVoiceNote: false });
                    }}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg py-3 text-white hover:bg-white/15 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingNote ? updateNote : addNote}
                    className="flex-1 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 border border-white/20 rounded-lg py-3 text-white hover:from-purple-500/40 hover:to-cyan-500/40 transition-all duration-300"
                  >
                    {editingNote ? 'Update' : 'Save'}
                  </button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-white font-semibold">{note.title}</h3>
                      {note.isVoiceNote && (
                        <Mic size={16} className="text-purple-400" />
                      )}
                    </div>
                    <p className="text-white/70 text-sm line-clamp-2 mb-3">
                      {note.content}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => startEdit(note)}
                      className="text-white/40 hover:text-cyan-400 transition-colors duration-300"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-white/40 hover:text-red-400 transition-colors duration-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {note.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center justify-between text-xs text-white/50">
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>Created {note.createdAt.toLocaleDateString()}</span>
                  </div>
                  {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                    <span>Updated {note.updatedAt.toLocaleDateString()}</span>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredNotes.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FileText size={48} className="text-white/30 mx-auto mb-4" />
            <p className="text-white/60">
              {searchQuery ? 'No notes found matching your search.' : 'No notes yet. Create your first note!'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notes;