import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
        return NextResponse.json({ success: false })
    }

    const randomString = Math.random().toString(36).substring(2, 8) // 무작위 문자열 생성
    const hash = createHash('sha256').update(randomString).digest('hex') // 무작위 문자열을 해시화
    const fileExtension = file.name.split('.').pop() // 파일 확장자 추출

    const randomName = `${hash}.${fileExtension}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const path = join('./', 'public/tmp', randomName)
    await writeFile(path, buffer)

    const formDataJson: { [key: string]: any } = {};
    console.log(data)
    for (const [key, value] of data.entries()) {
        formDataJson[key] = value;
    }
    formDataJson['id'] = uuidv4()
    formDataJson['file'] = randomName
    const filePath = join(process.cwd(), 'public', 'data.json');
    const jsonString = JSON.stringify(formDataJson);

    return NextResponse.json({ success: true, jsonString })
}
