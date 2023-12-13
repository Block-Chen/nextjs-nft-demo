"use client";

import React, { useState, FormEvent, useEffect  } from 'react'
import Header from "@/app/components/header";

interface Data {
    id: string
    name: string
    price: number | string
    subject: string
    file: string
    tx_hash : string
    token_id : number
    walletAddress: string
}
function Home({ params }: { params: { address: string } }) {
    const address = params.address
    const [data, setData] = useState<Data[]>([])

    useEffect(() => {
        // API로부터 데이터를 가져오는 함수
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/nft/list/${address}` , {
                    method: 'GET',
                    cache: 'no-store',
                })
                const result = await response.json();
                // 데이터가 배열인지 확인
                if (Array.isArray(result.filteredData)) {
                    setData(result.filteredData);
                } else {
                    console.error('Fetched data is not an array:', result.filteredData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData() // 데이터 가져오기
    }, [address])

    return (
        <div>
            <Header />
            <h1>{address}가 소유한 NFT 리스트</h1>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>
                        <strong>ID:</strong> <a href={`/nft/details/${item.id}`}>{item.id}</a>,{' '}
                        <strong>Name:</strong> {item.name}, <strong>Subject:</strong> {item.subject}, <strong>File:</strong>{' '}
                        <img src={process.cwd()+'tmp/'+item.file} alt={`Image ${index}`} style={{ maxWidth: '200px', maxHeight: '200px' }} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Home
