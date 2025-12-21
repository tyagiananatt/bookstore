import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiClock } from 'react-icons/fi';
import { bookRequestService } from '../services/api';
import Header from '../components/Header';
import './AdminRequests.css';

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await bookRequestService.getAllRequests();
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'status-approved';
            case 'rejected': return 'status-rejected';
            case 'fulfilled': return 'status-fulfilled';
            default: return 'status-pending';
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await bookRequestService.updateRequestStatus(id, newStatus);
            setRequests(requests.map(req =>
                req._id === id ? { ...req, status: newStatus } : req
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            // Optionally show a toast error here
        }
    };

    return (
        <div className="admin-requests-page">
            <Header />
            <div className="admin-container">
                <h1 className="page-title">Book Requests</h1>

                {loading ? (
                    <div className="loading">Loading requests...</div>
                ) : (
                    <div className="requests-table-container">
                        <table className="requests-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>User</th>
                                    <th>Book Title</th>
                                    <th>Author</th>
                                    <th>Additional Info</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request) => (
                                    <motion.tr
                                        key={request._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="user-info">
                                                <span className="user-name">{request.user?.username || 'Unknown'}</span>
                                                <span className="user-email">{request.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="book-title">{request.title}</td>
                                        <td>{request.author}</td>
                                        <td className="info-cell">{request.additionalInfo || '-'}</td>
                                        <td>
                                            <select
                                                className={`status-select ${getStatusColor(request.status)}`}
                                                value={request.status}
                                                onChange={(e) => handleStatusChange(request._id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="fulfilled">Fulfilled</option>
                                            </select>
                                        </td>
                                    </motion.tr>
                                ))}
                                {requests.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="no-requests">No book requests found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminRequests;
