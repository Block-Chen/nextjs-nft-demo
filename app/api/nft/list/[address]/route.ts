import { NextResponse, NextRequest } from 'next/server';
import { join } from 'path';
import fs from 'fs';

export async function GET(
    req: NextRequest,
    { params }: { params: { address: string } }
) {
    // URL에서 address 파라미터 추출
    const address  = params.address;

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

    // address 파라미터와 일치하는 데이터만 필터링
    const filteredData = jsonArray.filter(item => item.walletAddress && item.walletAddress.toLowerCase() === address.toLowerCase());

    return NextResponse.json({  filteredData });
}
