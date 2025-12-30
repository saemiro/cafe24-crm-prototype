# API 키 설정 가이드

## 1. Together AI API Key (Fine-tuning 실험용)

1. https://api.together.ai 접속
2. 로그인 또는 회원가입
3. API Keys 메뉴에서 새 키 생성
4. `.env` 파일에 추가:
   ```
   TOGETHER_API_KEY=your_key_here
   ```

## 2. Cafe24 API (CRM 데이터 연동)

### 2.1 Developer 계정 설정
1. https://developers.cafe24.com 접속
2. 앱 등록 (테스트용)
3. OAuth 인증 정보 획득

### 2.2 필요한 권한 (Scope)
- `mall.read_product` - 상품 조회
- `mall.read_order` - 주문 조회
- `mall.read_customer` - 고객 조회
- `mall.read_category` - 카테고리 조회

### 2.3 .env 설정
```
CAFE24_CLIENT_ID=your_client_id
CAFE24_CLIENT_SECRET=your_client_secret
CAFE24_MALL_ID=your_mall_id
```

## 3. 기존 인프라 (이미 설정됨)

다음 항목들은 이미 설정되어 있으므로 수정 불필요:
- Cloudflare Access 토큰
- Slack Webhook URL
- Qdrant/Neo4j 연결 정보

## 4. 설정 검증

```bash
# 연결 테스트 실행
./scripts/test-connections.sh
```

## 5. n8n Credential 설정

n8n에서 다음 Credential을 추가해야 합니다:

### Together AI
- Type: Header Auth
- Name: `Together AI API`
- Header Name: `Authorization`
- Header Value: `Bearer YOUR_TOGETHER_API_KEY`

### Cafe24 API
- Type: OAuth2
- Name: `Cafe24 OAuth`
- Client ID: `YOUR_CLIENT_ID`
- Client Secret: `YOUR_CLIENT_SECRET`
- Auth URL: `https://YOUR_MALL_ID.cafe24api.com/api/v2/oauth/authorize`
- Token URL: `https://YOUR_MALL_ID.cafe24api.com/api/v2/oauth/token`
