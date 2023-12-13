import { NextResponse, NextRequest } from 'next/server';
import {join} from "path";
import fs from 'fs';

//NFT 리스트
export async function GET(request : NextRequest) {
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

    return NextResponse.json({ jsonArray })
}