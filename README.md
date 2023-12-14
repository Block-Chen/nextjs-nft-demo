# BLOCKSDK NFT DEMO

## API 키 발행 방법
[BLOCKSDK 홈페이지 회원가입](https://blocksdk.com/register)

토큰 목록 WEB3 API 토큰 사용

### 1. 시작하기
1. 터미널 실행
2. `git clone https://github.com/Block-Chen/nextjs-nft-demo.git` 실행하여 저장소 복제
3. 프로젝트 디렉토리로 이동하여 `npm install` 실행
4. 빌드 `next build` , 시작 `next start`.
5. `next dev`로 개발모드로 진행 가능

## 디렉토리 구조

```bash
├── app/
│   ├── api/ //api 목록
│   │   └── nft/
│   │   │   ├── buy/
│   │   │   ├── create/
│   │   │   ├── delete/
│   │   │   ├── details/
│   │   │   ├── list/
│   │   │   └── sale/
│   │   └── solc/
│   ├── components // 모달창 및 헤더
│   ├── nft //페이지 목록
│   │   ├── create/
│   │   ├── details/
│   │   └── list/
│   └── page.tsx
├── public/ //api 목록
│   ├── tmp // 이미지 업로드 폴더
│   └── data.json // nft 정보 로컬 저장
└── .env
```

### 4. env 파일 설정
````
NEXT_PUBLIC_BLOCKSDK_TOKEN     // blocksdk api 토큰
NEXT_PUBLIC_URL                // WEB3 테스트넷 or 메인넷 엔드포인트
NEXT_PUBLIC_NET                // 사용할 메인넷(eth,bsc,klay,matic)
NEXT_PUBLIC_CONTRACT           // 사용할 NFT_CONTRACT(eth,bsc,klay,matic)         

````

### 라이센스
````
배포 및 변형하여 판매하는 행위가 금지 됩니다
````
