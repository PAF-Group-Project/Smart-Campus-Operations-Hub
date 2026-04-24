import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X } from 'lucide-react';
import './Modal.css';

export default function QRCodeModal({ token, booking, onClose }) {
    if (!token) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                </button>
                
                <div className="qr-container">
                    <h2 className="gradient-text">Check-in Pass</h2>
                    <p className="qr-subtitle">Scan at the venue to check in</p>
                    
                    <div className="qr-box">
                        <QRCodeCanvas 
                            value={token} 
                            size={200}
                            bgColor={"#ffffff"}
                            fgColor={"#0a0e17"}
                            level={"H"}
                        />
                    </div>
                    
                    {booking && (
                        <div className="qr-details">
                            <p><strong>Resource:</strong> {booking.resourceId}</p>
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
