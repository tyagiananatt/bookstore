import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiBookOpen, FiPlay, FiPercent } from 'react-icons/fi';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Profile.css';

const formatDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

const Profile = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    const uid = user?.username || 'guest';
    const storeKey = `readingProgressByUser:${uid}`;
    try {
      const raw = localStorage.getItem(storeKey);
      const map = raw ? JSON.parse(raw) : {};
      setProgressMap(map);
    } catch {
      setProgressMap({});
    }
  }, [user]);

  const entries = Object.values(progressMap || {});
  const totalTime = entries.reduce((acc, e) => acc + (e.timeMsTotal || 0), 0);

  return (
    <div className={`profile-page ${darkMode ? 'dark' : ''}`}>
      <Header />
      <div className="profile-container">
        <motion.div
          className="profile-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Hi {user?.username}, keep up the great learning!</h1>
          <p>Your reading journey at a glance</p>
        </motion.div>

        <div className="profile-stats">
          <motion.div className="stat-card" whileHover={{ scale: 1.04 }}>
            <FiClock className="stat-icon" />
            <div>
              <h3>Total Learning Time</h3>
              <p>{formatDuration(totalTime)}</p>
            </div>
          </motion.div>
          <motion.div className="stat-card" whileHover={{ scale: 1.04 }}>
            <FiBookOpen className="stat-icon" />
            <div>
              <h3>Books Started</h3>
              <p>{entries.length}</p>
            </div>
          </motion.div>
        </div>

        <section className="progress-section">
          <div className="section-header">
            <h2>Your Reading Progress</h2>
          </div>
          {entries.length === 0 ? (
            <div className="empty-state">
              <p>No reading data yet. Open a book from your Library and start reading!</p>
              <button className="cta-btn" onClick={() => navigate('/library')}>Go to Library</button>
            </div>
          ) : (
            <div className="progress-list">
              {entries.map((e) => {
                const pct = Math.min(100, Math.round(((e.pagesReadCount || 0) / (e.numPages || 1)) * 100));
                return (
                  <motion.div key={e.bookId} className="progress-item" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="item-header">
                      <div>
                        <h3 className="book-title">{e.title || 'Untitled Book'}</h3>
                        <p className="book-author">by {e.author || 'Unknown'}</p>
                      </div>
                      <button className="continue-btn" onClick={() => navigate(`/library/read/${e.bookId}`)}>
                        <FiPlay /> Continue Reading (Page {e.lastPage || 1})
                      </button>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="item-meta">
                      <span className="meta"><FiPercent /> {pct}%</span>
                      <span className="meta">Pages: {e.pagesReadCount || 0} / {e.numPages || '?'}</span>
                      <span className="meta">Time: {formatDuration(e.timeMsTotal || 0)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;

