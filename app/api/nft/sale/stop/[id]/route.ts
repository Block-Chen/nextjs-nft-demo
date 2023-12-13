import fs from 'fs';
import path, { join } from 'path';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id;
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

    delete specificData.price

    const updatedJsonData = jsonArray.map((item) => JSON.stringify(item)).join('\n');
    fs.writeFileSync(filePath, updatedJsonData, 'utf-8');

    if (specificData) {
        return NextResponse.json({ specificData });
    } else {
        return NextResponse.json({ error: 'Data not found' });
    }
}
