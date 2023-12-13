import fs from 'fs';
import path, {join} from 'path';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id
    const url = process.env.NEXT_PUBLIC_URL as string
    const net = process.env.NEXT_PUBLIC_NET
    const api_token = process.env.NEXT_PUBLIC_BLOCKSDK_TOKEN
    const contract = process.env.NEXT_PUBLIC_CONTRACT

    const filePath = join(process.cwd(), 'public', 'data.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');

    const jsonArray = [];
    const regex = /{[^}]*}/g;
    const matches = jsonData.match(regex);

    if (matches) {
        for (const match of matches) {
            jsonArray.push(JSON.parse(match));
        }
    }

    // 특정 ID에 해당하는 데이터 찾기
    const specificData = jsonArray.find(item => item.id === id);

    if (!specificData.token_id) {
        try {
            const res = await fetch(url + net + `/transaction/${specificData.tx_hash}?api_token=` + api_token, {
                method: 'GET',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const tx_data = await res.json()
            const token_id = tx_data.payload.logs[0].topics

            specificData.token_id = parseInt(token_id[token_id.length - 1]);
        } catch (error) {
            console.error('Error calling API:', error);
        }
    }

    if (specificData.tx_hash) {
        try {
            const res = await fetch(url + net + `/single-nft/${contract}/${specificData.token_id}/info?api_token=` + api_token, {
                method: 'GET',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const nft_data = await res.json()

            specificData.walletAddress = nft_data.payload.owner;
            specificData.createrAddress = nft_data.payload.creator;

            const updatedJsonData = jsonArray.map((item) => JSON.stringify(item)).join('\n');
            fs.writeFileSync(filePath, updatedJsonData, 'utf-8');

            const listed = await fetch(url + net + `/contract/${contract}/read?api_token=` + api_token, {
                method: 'POST',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    method : "listedMap",
                    return_type : "bool",
                    contract_address : contract,
                    parameter_type : ["uint256"],
                    parameter_data : [specificData.token_id]
                }),
            }).then(listed => listed.json())

            if(listed.payload.result){
                const price = await fetch(url + net + `/contract/${contract}/read?api_token=` + api_token, {
                    method: 'POST',
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        method : "price",
                        return_type : "uint256",
                        contract_address : contract,
                        parameter_type : ["uint256"],
                        parameter_data : [specificData.token_id]
                    }),
                }).then(price => price.json())
                specificData.price = price.payload.result / 1000000000000000000
            }

            const transfer = await fetch(url + net + `/single-nft/${contract}/${specificData.token_id}/nft-transactions?includeRawTx=true&api_token=` + api_token, {
                method: 'GET',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const transfer_data = await transfer.json()

            const transfers: string[] = [];

            transfer_data.payload.data.forEach((element: any) => {
                if(element.rawtx.input.substring(0, 10) == '0x7e8816b9'){
                    element.method = 'mint'
                    element.price = parseInt(element.rawtx.input.substr(138, 64),16) / 1000000000000000000;
                }else if(element.rawtx.input.substring(0, 10) == '0xd96a094a'){
                    element.method = 'buy'
                    element.price = element.rawtx.value / 1000000000000000000
                }
                transfers.push(element)
            });
            specificData.transfers = transfers;

        } catch (error) {
            console.error('Error calling API:', error);
        }
    }

    if (specificData) {
        return NextResponse.json({ specificData })
    } else {
        return NextResponse.json({ error: 'Data not found' })
    }
}

