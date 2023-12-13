import { NextResponse, NextRequest } from 'next/server';

export async function POST(request : NextRequest) {
    const api_token = process.env.NEXT_PUBLIC_BLOCKSDK_TOKEN
    const url = process.env.NEXT_PUBLIC_URL as string
    const payload = await request.json()

    const res = await fetch(url + `solc/encodefunction?api_token=` + api_token, {
        method: 'POST',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            method : payload.method,
            parameter_type : payload.parameter_type,
            parameter_data : payload.parameter_data
        }),
    })

    const data = await res.json()

    return NextResponse.json({data})
}