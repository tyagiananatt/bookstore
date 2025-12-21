import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiBook, FiUser, FiInfo } from 'react-icons/fi';
import { bookRequestService } from '../services/api';
import './RequestBookForm.css';

const RequestBookForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        additionalInfo: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const payload = {
                title: formData.title.trim(),
                author: formData.author.trim(),
                additionalInfo: formData.additionalInfo?.trim() || ''
            };
            await bookRequestService.createRequest(payload);
            setStatus({ type: 'success', message: 'Book request submitted successfully! We will notify you when it becomes available.' });
            setFormData({ title: '', author: '', additionalInfo: '' });
        } catch (error) {
            const msg =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                (error?.message?.includes('Network') ? 'Server unavailable. Please try again later.' : 'Failed to submit request. Please try again.');
            setStatus({ type: 'error', message: msg });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            className="request-book-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="request-book-header">
                <h3>Request a Book</h3>
                <p>Can't find what you're looking for? Let us know!</p>
            </div>

            <form onSubmit={handleSubmit} className="request-book-form">
                {status.message && (
                    <div className={`status-message ${status.type}`}>
                        {status.message}
                    </div>
                )}

                <div className="form-group">
                    <div className="input-icon-wrapper">
                        <FiBook className="input-icon" />
                        <input
                            type="text"
                            name="title"
                            placeholder="Book Title *"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <div className="input-icon-wrapper">
                        <FiUser className="input-icon" />
                        <input
                            type="text"
                            name="author"
                            placeholder="Author *"
                            value={formData.author}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <div className="input-icon-wrapper">
                        <FiInfo className="input-icon" />
                        <textarea
                            name="additionalInfo"
                            placeholder="Additional Information (Edition, ISBN, etc.)"
                            value={formData.additionalInfo}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Sending...' : (
                        <>
                            Submit Request <FiSend className="btn-icon" />
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
};

export default RequestBookForm;
