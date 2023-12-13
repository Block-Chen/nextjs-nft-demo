import fs from 'fs';
import path, { join } from 'path';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    const data = await req.json()
    const url = process.env.NEXT_PUBLIC_URL as string;
    const net = process.env.NEXT_PUBLIC_NET;
    const api_token = process.env.NEXT_PUBLIC_BLOCKSDK_TOKEN;

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
    const specificData = jsonArray.find((item) => item.id === id);

    if (data.tx_hash) {
        try {
            const res = await fetch(url + net + `/transaction/${data.tx_hash}?api_token=` + api_token, {
                method: 'GET',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            // 여기서 apiResponse를 활용하여 필요한 로직을 수행합니다.
            const tx_data = await res.json()
            const token_id = tx_data.payload.logs[0].topics

            specificData.token_id = parseInt(token_id[token_id.length - 1]);
        } catch (error) {
            console.error('Error calling API:', error);
        }
    }

    specificData.price = data.price;
    specificData.tx_hash = data.tx_hash;

    const updatedJsonData = jsonArray.map((item) => JSON.stringify(item)).join('\n');
    fs.writeFileSync(filePath, updatedJsonData, 'utf-8');

    if (specificData) {
        return NextResponse.json({ specificData });
    } else {
        return NextResponse.json({ error: 'Data not found' });
    }
}
