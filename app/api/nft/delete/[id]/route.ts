import fs from 'fs';
import path, { join } from 'path';
import { NextResponse, NextRequest } from 'next/server';

// NFT 삭제
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    const filePath = join(process.cwd(), 'public', 'data.json');
    let jsonData = fs.readFileSync(filePath, 'utf-8');

    const jsonArray = [];
    const regex = /{[^}]*}/g;
    const matches = jsonData.match(regex);

    if (matches) {
        for (const match of matches) {
            jsonArray.push(JSON.parse(match));
        }
    }

    // 특정 ID에 해당하는 데이터 찾기
    const specificIndex = jsonArray.findIndex((item) => item.id === id);

    if (specificIndex !== -1) {
        // 특정 ID의 데이터를 배열에서 제거
        const removedData = jsonArray.splice(specificIndex, 1);

        // 제거한 데이터를 로그에 출력 (실제로 파일에서 제거되는 것은 아님)
        console.log('Removed Data:', removedData);

        // 수정된 데이터를 JSON 형태로 문자열로 변환
        const updatedJsonData = jsonArray.map((item) => JSON.stringify(item)).join('\n');

        // 파일에 수정된 데이터를 쓰기
        fs.writeFileSync(filePath, updatedJsonData);

        // 파일 삭제
        const imageFilePath = join(process.cwd(), 'public/tmp', removedData[0].file);
        fs.unlinkSync(imageFilePath);

        return NextResponse.json({ success: true, message: 'Data and file deleted successfully' });
    } else {
        return NextResponse.json({ error: 'Data not found' });
    }
}
