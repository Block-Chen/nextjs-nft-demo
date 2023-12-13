import React, { useState } from 'react';
import Modal from 'react-modal';

interface PriceUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdatePrice: (price: string) => void;
}

const PriceUpdateModal: React.FC<PriceUpdateModalProps> = ({ isOpen, onClose, onUpdatePrice }) => {
    const [priceInput, setPriceInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdatePrice(priceInput);
        setPriceInput('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose}>
            <h2>가격 변경</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    가격 입력:
                    <input
                        type="number"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                    />
                </label>
                <button type="submit">가격 변경</button>
            </form>
            <button onClick={onClose}>닫기</button>
        </Modal>
    );
};

export default PriceUpdateModal;
