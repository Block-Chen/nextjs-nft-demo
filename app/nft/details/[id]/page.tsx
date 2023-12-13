"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Modal from 'react-modal';
import DeleteModal from "@/app/components/DeleteModal";
import PriceUpdateModal from "@/app/components/PriceUpdateModal";
import SaleStopModal from "@/app/components/SaleStopModal";
import Link from "next/link";

interface Data {
    specificData: string;
    id: string;
    name: string;
    price: number;
    subject: string;
    file: string;
    tx_hash : string;
    token_id : number;
    walletAddress: string;
    createrAddress: string;
}

function Page({ params }: { params: { id: string } }) {
    const id = params.id
    const [data, setData] = useState<Data | string>('');
    const [nft, setNft] = useState('');
    const [priceInput, setPriceInput] = useState('');
    const router = useRouter()
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [isStopSaleModalOpen, setStopSaleModalOpen] = useState(false);
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT
    const api_token = process.env.NEXT_PUBLIC_BLOCKSDK_TOKEN

    const handlePriceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const hex_price = Math.round(parseFloat(priceInput) * Math.pow(10,18))
            let abi;

            if (typeof data === 'string') {

            }else {
                if(data.tx_hash){
                    abi = await fetch(`/api/solc`, {
                        method: 'POST',
                        cache: 'no-store',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            method : 'updateSale',
                            parameter_type : ['uint256','uint256'],
                            parameter_data : [data.token_id,'0x' + hex_price.toString(16)]
                        }),
                    }).then(abi=>abi.json())
                }else{
                    abi = await fetch(`/api/solc`, {
                        method: 'POST',
                        cache: 'no-store',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            method : 'mint',
                            parameter_type : ['string','address','uint256'],
                            parameter_data : [data.id,accounts[0],'0x' + hex_price.toString(16)]
                        }),
                    }).then(abi=>abi.json())
                }
            }


            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        "to": contractAddress,
                        "from": accounts[0],
                        "value": "0x0",
                        "data": '0x' + abi.data.payload.data
                    }
                ]
            })

            if (txHash) {
                const response = await fetch(`/api/nft/sale/${id}`, {
                    method: 'POST',
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        price: priceInput,
                        tx_hash: txHash
                    }),
                });

                if (response.ok) {
                    console.log('Price submitted successfully.');
                    window.location.reload();
                } else {
                    console.error('Error submitting price:', response.statusText);
                }
            } else {
                console.error('Error submitting price:', txHash);
            }
        } catch (error) {
            console.error('Error submitting price:', error);
        }
    };

    const handleOpenUpdateModal = () => {
        setUpdateModalOpen(true);
    };

    const handleUpdatePrice = async (newPrice: string) => {
        // 가격을 업데이트하는 로직 구현
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const hex_price = Math.round(parseFloat(newPrice) * Math.pow(10,18))
            let abi

            if (typeof data === 'string') {

            }else {
                abi = await fetch(`/api/solc`, {
                    method: 'POST',
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        method : 'updatePrice',
                        parameter_type : ['uint256','uint256'],
                        parameter_data : [data.token_id,'0x' + hex_price.toString(16)]
                    }),
                }).then(abi=>abi.json())
            }

            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        "to": contractAddress,
                        "from": accounts[0],
                        "value": "0x0",
                        "data": '0x' + abi.data.payload.data
                    }
                ]
            })

            const response = await fetch(`/api/nft/sale/${id}`, {
                method: 'POST',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    price: newPrice,
                    tx_hash: txHash
                }),
            });

            if (response.ok) {
                console.log('가격이 성공적으로 업데이트되었습니다.');
                window.location.reload();
            } else {
                console.error('가격 업데이트 중 오류 발생:', response.statusText);
            }
        } catch (error) {
            console.error('가격 업데이트 중 오류 발생:', error);
        }
    };

    const handleCloseUpdateModal = () => {
        setUpdateModalOpen(false);
    };

    const handleDelete = () => {
        setDeleteModalOpen(true);
    };

    const handleOpenStopSaleModal = () => {
        setStopSaleModalOpen(true);
    };

    const handleCloseStopSaleModal = () => {
        setStopSaleModalOpen(false);
    };

    const handleStopSale = async () => {
        // 판매 중지 로직 구현
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            let abi

            if (typeof data === 'string') {

            }else {
                abi = await fetch(`/api/solc`, {
                    method: 'POST',
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        method : 'updateListingStatus',
                        parameter_type : ['uint256','bool'],
                        parameter_data : [data.token_id,0]
                    }),
                }).then(abi=>abi.json())
            }

            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        "to": contractAddress,
                        "from": accounts[0],
                        "value": "0x0",
                        "data": '0x' + abi.data.payload.data
                    }
                ]
            })

            const response = await fetch(`/api/nft/sale/stop/${id}`, {
                method: 'POST',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('판매가 성공적으로 중지되었습니다.');
                window.location.reload();
            } else {
                console.error('판매 중지 중 오류 발생:', response.statusText);
            }
        } catch (error) {
            console.error('판매 중지 중 오류 발생:', error);
        }
    };

    const handleBuy = async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            let abi : any
            let nft_price : any

            if (typeof data === 'string') {

            }else {
                const abi = await fetch(`/api/solc`, {
                    method: 'POST',
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        method : 'buy',
                        parameter_type : ['uint256'],
                        parameter_data : [data.token_id]
                    }),
                }).then(abi=>abi.json())
                nft_price = data?.price * Math.pow(10,18)
            }

            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        "to": contractAddress,
                        "from": accounts[0],
                        "value": '0x' + nft_price.toString(16),
                        "data": '0x' + abi.data.payload.data
                    }
                ]
            })

            const response = await fetch(`/api/nft/buy/${id}`, {
                method: 'POST',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account: accounts[0]
                }),
            });

            if (response.ok) {
                console.log('구매가 성공적으로 완료되었습니다..');
                //window.location.reload();
            } else {
                console.error('구매 중 오류 발생:', response.statusText);
            }
        } catch (error) {
            console.error('구매 중 오류 발생:', error);
        }
    };

    const handleConfirmDelete = async () => {
        // 실제 삭제 로직을 수행
        try {
            const response = await fetch(`/api/nft/delete/${id}`, {
                method: 'DELETE',
                cache: 'no-store',
            });

            if (response.ok) {
                console.log('Data deleted successfully.');
                // 페이지 새로 고침
                router.push(`/nft/list/${id}`);
            } else {
                console.error('Error deleting data:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }

        setDeleteModalOpen(false);
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
    };

    useEffect(() => {
        // ID가 변경될 때마다 데이터를 가져오는 함수
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/nft/details/${id}`, {
                    method: 'GET',
                    cache: 'no-store',
                });

                if (response.ok) {
                    const result: Data = await response.json();
                    setData(result.specificData);
                } else {
                    console.error('Error fetching data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const nftData = async () => {
            try {
                const response = await fetch(`/api/nft/details/${id}`, {
                    method: 'GET',
                    cache: 'no-store',
                });

                if (response.ok) {
                    const result: Data = await response.json();
                    setNft(result.specificData);
                } else {
                    console.error('Error fetching data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (!data) {
        return <p>Loading...</p>;
    }

    // MetaMask 연결 상태 확인
    const ethereum = (window as any).ethereum;
    const isMetaMaskConnected = ethereum && ethereum.selectedAddress;
    let isWalletMatch

    // 지갑 주소 비교
    if (typeof data === 'string') {

    }else {
        isWalletMatch = isMetaMaskConnected && data.walletAddress === ethereum.selectedAddress;

        return (
            <div>
                <h1>NFT 상세 정보</h1>
                <Link href={{pathname: '/nft/list',}}>전체 NFT 리스트</Link>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '20px' }}>
                        <img
                            src={process.cwd() + 'tmp/' + data.file}
                            alt={`Image ${data.id}`}
                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                    </div>
                    <div>
                        {/* 제작자 주소 */}
                        {data.createrAddress ? (
                            <p><strong>Creator Address</strong>: <a href={`/nft/list/${data.createrAddress}`}>{data.createrAddress}</a></p>
                        ) : data.walletAddress ? (
                            <p><strong>Creator Address</strong>: <a href={`/nft/list/${data.walletAddress}`}>{data.walletAddress}</a></p>
                        ) : null}
                        {/* 소유자 주소 */}
                        {data.walletAddress && <p><strong>Owner Address</strong>: <a href={`/nft/list/${data.walletAddress}`}>{data.walletAddress}</a></p>}

                        <p>
                            <strong>NFT ID:</strong> {data.id}
                        </p>
                        <p>
                            <strong>Name:</strong> {data.name}
                        </p>
                        <p>
                            <strong>Subject:</strong> {data.subject}
                        </p>
                        <p>
                            <strong>Price:</strong> {data.price}
                        </p>
                        {isWalletMatch ? (
                            <>
                                {/* 이미 가격이 존재하는지 확인 */}
                                {data.price ? (
                                    <>
                                        {/* 가격 업데이트 및 판매 중지 버튼을 표시 */}
                                        <button onClick={handleOpenUpdateModal}>가격 변경</button>
                                        {/* 모달 컴포넌트 */}
                                        <PriceUpdateModal
                                            isOpen={isUpdateModalOpen}
                                            onClose={handleCloseUpdateModal}
                                            onUpdatePrice={handleUpdatePrice}
                                        />
                                        <button onClick={handleOpenStopSaleModal}>판매 중지</button>
                                        {/* 모달 컴포넌트 */}
                                        <SaleStopModal
                                            isOpen={isStopSaleModalOpen}
                                            onClose={handleCloseStopSaleModal}
                                            onStopSale={handleStopSale}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {/* 가격 입력 폼 */}
                                        <form onSubmit={handlePriceSubmit}>
                                            <label>
                                                Enter Price:
                                                <input
                                                    type="text"
                                                    value={priceInput}
                                                    onChange={(e) => setPriceInput(e.target.value)}
                                                />
                                            </label>
                                            <button type="submit">Submit Price</button>
                                        </form>
                                        {/* 삭제 버튼 */}
                                        <button onClick={handleDelete}>Delete Data</button>
                                        <DeleteModal
                                            isOpen={isDeleteModalOpen}
                                            onClose={handleCancelDelete}
                                            onConfirm={handleConfirmDelete}
                                        />
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {data.price ? (
                                    <button onClick={handleBuy}>Buy NFT</button>
                                ) : (
                                    <p style={{ color: 'red' }}>판매중인 NFT가 아닙니다.</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }


}

export default Page;