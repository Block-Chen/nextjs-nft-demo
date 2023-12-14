import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<string | null>(null);
    const net = process.env.NEXT_PUBLIC_NET;
    const router = useRouter();

    const handleCreateNFT = () => {
        // NFT 생성 페이지로 이동
        router.push('/nft/create');
    };

    useEffect(() => {
        const checkMetamaskConnection = async () => {
            try {
                // Metamask 연결 확인
                if (window.ethereum) {
                    // Metamask에 연결된 계정 가져오기
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

                    if (accounts.length > 0) {
                        // 연결된 계정이 있는 경우 지갑 주소 설정
                        setWalletAddress(accounts[0]);

                        // 지갑 잔액 조회
                        const balance = await window.ethereum.request({
                            method: "eth_getBalance",
                            params: [accounts[0], "latest"],
                        });
                        const formattedBalance : any = parseInt(balance, 16) / Math.pow(10,18)
                        setWalletBalance(formattedBalance.toFixed(4));
                    }
                }
            } catch (error) {
                console.error('Error checking Metamask connection:', error);
            }
        };

        checkMetamaskConnection();
    }, []);

    const getWalletBalance = async (address: string) => {
        try {
            // Metamask에서 잔액 조회
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [address, 'latest'],
            });

            const formattedBalance : any = parseInt(balance, 16) / Math.pow(10,18)
            const  etherBalance = formattedBalance.toFixed(4)

            return etherBalance;
        } catch (error) {
            console.error('Error getting wallet balance:', error);
            return null;
        }
    };

    const handleConnectWallet = async () => {
        try {
            // Metamask 연결 요청
            if (window.ethereum) {
                // Metamask에 연결된 계정 가져오기
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    // 연결된 계정이 있는 경우 지갑 주소 및 잔액 설정
                    setWalletAddress(accounts[0]);

                    // 지갑 잔액 조회
                    const balance = await getWalletBalance(accounts[0]);
                    setWalletBalance(balance);
                } else {
                    // Metamask가 잠금 상태인 경우
                    await window.ethereum.request({
                        method: 'wallet_requestPermissions',
                        params: [
                            {
                                "eth_accounts": {}
                            }
                        ]
                    });
                    // 다시 연결 시도
                    handleConnectWallet();
                }
            } else {
                console.log('Metamask not detected.');

                // Metamask 설치 페이지로 이동하는 경고창
                const installMetamaskConfirmation = window.confirm(
                    'Metamask is not installed. Do you want to install it now?'
                );

                if (installMetamaskConfirmation) {
                    // Metamask 설치 페이지를 새 창으로 열기
                    window.open('https://metamask.io/download.html', '_blank');
                }
            }
        } catch (error) {
            console.error('Error connecting Metamask wallet:', error);
        }
    };

    const handleDisconnectWallet = () => {
        // 지갑 주소 및 잔액 해제
        setWalletAddress(null);
        setWalletBalance(null);
    };

    return (
        <header>
            {/* 헤더 내용 */}
            <div>
                <h1>연결된 지갑 주소</h1>
                {/* 지갑 정보 및 잔액 표시 */}
                {walletAddress ? (
                    <>
                        <p>연결된 지갑: {walletAddress}</p>
                        {walletBalance && <p>지갑 잔액: {walletBalance} {net}</p>}
                        <button onClick={handleDisconnectWallet}>Disconnect Wallet</button>
                        {walletAddress && (
                            <div>
                                <button onClick={handleCreateNFT}>Create NFT</button>
                            </div>
                        )}
                    </>
                ) : (
                    <button onClick={handleConnectWallet}>Connect Wallet</button>
                )}
            </div>
        </header>
    );
};

export default Header;
