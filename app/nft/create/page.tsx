"use client";

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';

const Home = () => {
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [file, setFile] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter()

    const handleSubmit = async (e : any) => {
        e.preventDefault();

        try {
            // 폼 데이터를 FormData 객체로 만듦
            const formData = new FormData();
            formData.append('name', name);
            formData.append('subject', subject);
            formData.append('file', file);

            // 메타마스크에서 지갑 주소 가져오기
            const ethereum = (window as any).ethereum;
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });

            const sign = await window.ethereum.request({
                method: 'personal_sign',
                params: [`Sign this request`,accounts[0]],
            });

            if (accounts.length > 0) {
                formData.append('walletAddress', accounts[0]);
            }else {
                console.error('MetaMask not connected');
                return;
            }

            // API에 POST 요청 보냄
            const response = await fetch('/api/nft/create', {
                method: 'POST',
                cache: 'no-store',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                const page = JSON.parse(result.jsonString)

                // 성공 메시지 표시
                setSuccessMessage('Form submitted successfully.');

                // 메인 페이지로 이동
                router.push(`/nft/details/${page.id}`);
            } else {
                console.error('API Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleFileChange = (e : any) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    return (
        <div>
            <h1>이미지 업로드 폼</h1>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <br />
                <label>
                    Subject:
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </label>
                <br />
                <label>
                    File:
                    <input type="file" onChange={handleFileChange} />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Home;
