import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Welcome from './components/Pages/Welcome';
import Home from './components/Pages/Home';
import Conversation from './components/Pages/Conversation';
import Tasks from './components/Pages/Tasks';
import Settings from './components/Pages/Settings';
import Notes from './components/Pages/Notes';

function App() {
  return (
    <Router>
      <Routes>
        {/* Welcome screen */}
        <Route path="/welcome" element={<Welcome />} />
        
        {/* Main app with layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/conversation" element={<Conversation />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;