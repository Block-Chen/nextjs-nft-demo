import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

interface SaleStopModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStopSale: () => void;
}

const SaleStopModal: React.FC<SaleStopModalProps> = ({ isOpen, onClose, onStopSale }) => {
    useEffect(() => {
        Modal.setAppElement('body'); // Set the app element to the body
    }, []);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="SaleStop Modal"
        >
            <h2>경고</h2>
            <p>판매를 중지하시겠습니까?</p>
            <button onClick={onStopSale}>중지</button>
            <button onClick={onClose}>취소</button>
        </Modal>
    );
};

export default SaleStopModal;
