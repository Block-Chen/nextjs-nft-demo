import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
    useEffect(() => {
        Modal.setAppElement('body'); // Set the app element to the body
    }, []);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Delete Modal"
        >
            <h2>경고</h2>
            <p>삭제하시겠습니까?</p>
            <button onClick={onConfirm}>삭제</button>
            <button onClick={onClose}>취소</button>
        </Modal>
    );
};

export default DeleteModal;
