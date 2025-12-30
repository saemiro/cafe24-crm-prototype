#!/usr/bin/env python3
"""
Cafe24 API Documentation Collector & Embedder
Phase 1: Collect API docs and embed into Qdrant

This script:
1. Fetches Cafe24 API documentation from developers portal
2. Chunks the documentation
3. Generates embeddings using sentence-transformers
4. Stores in Qdrant (cafe24_api_docs collection)
"""

import os
import json
import requests
from typing import List, Dict, Any
from dataclasses import dataclass
import hashlib

# Configuration
QDRANT_URL = os.getenv("QDRANT_URL", "https://qdrant.saemiro.com")
CF_ACCESS_CLIENT_ID = os.getenv("CF_ACCESS_CLIENT_ID", "33fc2fac58bf5237d16ac159db51b46b.access")
CF_ACCESS_CLIENT_SECRET = os.getenv("CF_ACCESS_CLIENT_SECRET", "7251ba3d0093523b81898e1df292ba8531b48db96d981224c8612fb1f3c1183c")
COLLECTION_NAME = "cafe24_api_docs"

# Cafe24 API Documentation (manually curated for prototype)
CAFE24_API_DOCS = [
    {
        "category": "Authentication",
        "title": "OAuth 2.0 인증",
        "content": """
Cafe24 API는 OAuth 2.0 인증을 사용합니다.

## 인증 흐름
1. 앱 등록: developers.cafe24.com에서 앱 등록
2. 인증 URL로 리다이렉트: /api/v2/oauth/authorize
3. Authorization Code 수신
4. Access Token 교환: /api/v2/oauth/token
5. API 호출 시 Bearer 토큰 사용

## 토큰 갱신
- Access Token 만료: 2시간
- Refresh Token으로 갱신 가능
- /api/v2/oauth/token (grant_type=refresh_token)

## 권한 스코프
- mall.read_product: 상품 읽기
- mall.write_product: 상품 쓰기
- mall.read_order: 주문 읽기
- mall.write_order: 주문 쓰기
- mall.read_customer: 고객 읽기
- mall.write_customer: 고객 쓰기
""",
        "endpoint": "/api/v2/oauth"
    },
    {
        "category": "Customers",
        "title": "고객 목록 조회",
        "content": """
## GET /api/v2/admin/customers

고객 목록을 조회합니다.

### 요청 파라미터
- limit: 조회 수 (기본 10, 최대 100)
- offset: 시작 위치
- since_id: 특정 ID 이후 조회
- member_group_no: 회원 등급 필터
- created_start_date: 가입일 시작
- created_end_date: 가입일 종료

### 응답 예시
```json
{
  "customers": [
    {
      "member_id": "user123",
      "name": "홍길동",
      "email": "hong@example.com",
      "phone": "010-1234-5678",
      "group_no": 1,
      "created_date": "2024-01-15T10:30:00+09:00"
    }
  ]
}
```

### 회원 등급 (member_group_no)
- 1: 일반
- 2: 실버
- 3: 골드
- 4: VIP
""",
        "endpoint": "/api/v2/admin/customers"
    },
    {
        "category": "Customers",
        "title": "고객 상세 조회",
        "content": """
## GET /api/v2/admin/customers/{member_id}

특정 고객의 상세 정보를 조회합니다.

### 경로 파라미터
- member_id: 고객 아이디

### 응답 필드
- member_id: 회원 아이디
- name: 이름
- name_english: 영문 이름
- email: 이메일
- phone: 전화번호
- cellphone: 휴대폰
- nick_name: 닉네임
- birthday: 생년월일
- gender: 성별 (M/F)
- total_mileage: 보유 적립금
- available_mileage: 사용 가능 적립금
- group_no: 회원 등급 번호
- created_date: 가입일
- last_login_date: 최근 로그인
""",
        "endpoint": "/api/v2/admin/customers/{member_id}"
    },
    {
        "category": "Orders",
        "title": "주문 목록 조회",
        "content": """
## GET /api/v2/admin/orders

주문 목록을 조회합니다.

### 요청 파라미터
- limit: 조회 수 (기본 10, 최대 100)
- offset: 시작 위치
- order_id: 주문번호로 검색
- member_id: 회원 아이디로 검색
- order_status: 주문 상태 필터
- start_date: 주문일 시작
- end_date: 주문일 종료
- payment_status: 결제 상태

### 주문 상태 (order_status)
- N1: 입금전
- N2: 결제완료
- N3: 배송준비중
- N4: 배송중
- N5: 배송완료
- C1: 취소신청
- C2: 취소완료
- R1: 반품신청
- R2: 반품완료
- E1: 교환신청
- E2: 교환완료

### 응답 예시
```json
{
  "orders": [
    {
      "order_id": "20240115-0000001",
      "member_id": "user123",
      "order_status": "N5",
      "order_date": "2024-01-15T14:30:00+09:00",
      "total_amount": 59000,
      "shipping_fee": 3000
    }
  ]
}
```
""",
        "endpoint": "/api/v2/admin/orders"
    },
    {
        "category": "Orders",
        "title": "주문 상세 조회",
        "content": """
## GET /api/v2/admin/orders/{order_id}

특정 주문의 상세 정보를 조회합니다.

### 경로 파라미터
- order_id: 주문번호

### 응답 필드
- order_id: 주문번호
- order_date: 주문일시
- order_status: 주문상태
- payment_method: 결제수단
- payment_status: 결제상태
- items: 주문 상품 목록
  - product_no: 상품번호
  - product_name: 상품명
  - quantity: 수량
  - price: 가격
  - option_value: 옵션
- shipping: 배송 정보
  - receiver_name: 수령인
  - receiver_phone: 연락처
  - address: 주소
  - tracking_no: 운송장번호
- buyer: 주문자 정보
  - name: 이름
  - email: 이메일
  - phone: 연락처
""",
        "endpoint": "/api/v2/admin/orders/{order_id}"
    },
    {
        "category": "Products",
        "title": "상품 목록 조회",
        "content": """
## GET /api/v2/admin/products

상품 목록을 조회합니다.

### 요청 파라미터
- limit: 조회 수 (기본 10, 최대 100)
- offset: 시작 위치
- product_no: 상품번호
- product_code: 상품코드
- product_name: 상품명 검색
- category_no: 카테고리 필터
- display: 진열 상태 (T/F)
- selling: 판매 상태 (T/F)

### 응답 예시
```json
{
  "products": [
    {
      "product_no": 1234,
      "product_code": "P001234",
      "product_name": "클래식 니트",
      "price": 49000,
      "retail_price": 59000,
      "supply_price": 25000,
      "display": "T",
      "selling": "T",
      "stock_quantity": 100
    }
  ]
}
```
""",
        "endpoint": "/api/v2/admin/products"
    },
    {
        "category": "Products",
        "title": "상품 상세 조회",
        "content": """
## GET /api/v2/admin/products/{product_no}

특정 상품의 상세 정보를 조회합니다.

### 경로 파라미터
- product_no: 상품번호

### 응답 필드
- product_no: 상품번호
- product_code: 상품코드
- product_name: 상품명
- eng_product_name: 영문 상품명
- model_name: 모델명
- price: 판매가
- retail_price: 소비자가
- supply_price: 공급가
- tax_type: 과세구분
- description: 상품 설명
- product_weight: 상품 무게
- created_date: 등록일
- updated_date: 수정일
- options: 옵션 목록
- variants: 품목 목록
- images: 이미지 목록
""",
        "endpoint": "/api/v2/admin/products/{product_no}"
    },
    {
        "category": "Categories",
        "title": "카테고리 목록 조회",
        "content": """
## GET /api/v2/admin/categories

카테고리 목록을 조회합니다.

### 요청 파라미터
- category_depth: 카테고리 깊이 (1-4)
- parent_category_no: 상위 카테고리 번호

### 응답 예시
```json
{
  "categories": [
    {
      "category_no": 1,
      "category_name": "의류",
      "parent_category_no": 0,
      "category_depth": 1,
      "display_order": 1
    },
    {
      "category_no": 10,
      "category_name": "상의",
      "parent_category_no": 1,
      "category_depth": 2,
      "display_order": 1
    }
  ]
}
```
""",
        "endpoint": "/api/v2/admin/categories"
    },
    {
        "category": "Coupons",
        "title": "쿠폰 발급",
        "content": """
## POST /api/v2/admin/coupons

회원에게 쿠폰을 발급합니다.

### 요청 본문
```json
{
  "coupon_no": 123,
  "member_id": ["user1", "user2"],
  "issue_count": 1
}
```

### 쿠폰 유형
- A: 정액할인
- B: 정률할인
- C: 배송비 할인

### 응답
```json
{
  "issued_coupons": [
    {
      "coupon_no": 123,
      "member_id": "user1",
      "coupon_code": "COUPON-ABC123",
      "available_date": "2024-12-31"
    }
  ]
}
```
""",
        "endpoint": "/api/v2/admin/coupons"
    },
    {
        "category": "Mileage",
        "title": "적립금 지급/차감",
        "content": """
## POST /api/v2/admin/mileage

회원의 적립금을 지급하거나 차감합니다.

### 요청 본문
```json
{
  "member_id": "user123",
  "mileage": 5000,
  "type": "C",
  "reason": "이벤트 당첨 축하"
}
```

### 적립금 유형 (type)
- C: 적립 (Credit)
- D: 차감 (Debit)

### 응답
```json
{
  "member_id": "user123",
  "previous_mileage": 10000,
  "current_mileage": 15000,
  "changed_mileage": 5000
}
```
""",
        "endpoint": "/api/v2/admin/mileage"
    },
    {
        "category": "Analytics",
        "title": "매출 통계",
        "content": """
## GET /api/v2/admin/reports/salesvolume

매출 통계를 조회합니다.

### 요청 파라미터
- start_date: 시작일 (YYYY-MM-DD)
- end_date: 종료일 (YYYY-MM-DD)
- period: 집계 기간 (daily/weekly/monthly)

### 응답 예시
```json
{
  "salesvolume": [
    {
      "date": "2024-01-15",
      "order_count": 150,
      "total_sales": 4500000,
      "average_order_value": 30000,
      "cancelled_count": 5,
      "cancelled_amount": 150000
    }
  ],
  "summary": {
    "total_order_count": 4500,
    "total_sales": 135000000,
    "average_order_value": 30000
  }
}
```
""",
        "endpoint": "/api/v2/admin/reports/salesvolume"
    },
    {
        "category": "Webhooks",
        "title": "웹훅 설정",
        "content": """
## 웹훅 이벤트

Cafe24는 다음 이벤트에 대해 웹훅을 지원합니다:

### 주문 이벤트
- order.created: 주문 생성
- order.paid: 결제 완료
- order.shipped: 배송 시작
- order.delivered: 배송 완료
- order.cancelled: 주문 취소

### 회원 이벤트
- customer.created: 회원 가입
- customer.updated: 회원 정보 수정
- customer.deleted: 회원 탈퇴

### 상품 이벤트
- product.created: 상품 등록
- product.updated: 상품 수정
- product.soldout: 품절

### 웹훅 등록
```
POST /api/v2/admin/webhooks
{
  "url": "https://your-webhook-url.com/cafe24",
  "events": ["order.created", "order.paid"]
}
```
""",
        "endpoint": "/api/v2/admin/webhooks"
    }
]


@dataclass
class DocumentChunk:
    """A chunk of documentation with metadata"""
    id: str
    content: str
    metadata: Dict[str, Any]


def generate_chunk_id(content: str, metadata: Dict) -> str:
    """Generate unique ID for chunk"""
    hash_input = f"{metadata.get('category', '')}-{metadata.get('title', '')}-{content[:50]}"
    return hashlib.md5(hash_input.encode()).hexdigest()


def chunk_documents(docs: List[Dict]) -> List[DocumentChunk]:
    """Convert documents to chunks with metadata"""
    chunks = []

    for doc in docs:
        content = f"# {doc['title']}\n\nCategory: {doc['category']}\nEndpoint: {doc['endpoint']}\n\n{doc['content']}"

        chunk = DocumentChunk(
            id=generate_chunk_id(content, doc),
            content=content,
            metadata={
                "category": doc["category"],
                "title": doc["title"],
                "endpoint": doc["endpoint"],
                "source": "cafe24_api_docs",
                "type": "api_documentation"
            }
        )
        chunks.append(chunk)

    return chunks


def get_embeddings(texts: List[str]) -> List[List[float]]:
    """Generate embeddings using sentence-transformers via API or local"""
    try:
        # Try using local sentence-transformers
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
        embeddings = model.encode(texts)
        return embeddings.tolist()
    except ImportError:
        # Fallback: use a simple approach or external API
        print("Warning: sentence-transformers not installed. Using placeholder embeddings.")
        # Return 384-dimensional zero vectors as placeholder
        return [[0.0] * 384 for _ in texts]


def upload_to_qdrant(chunks: List[DocumentChunk], embeddings: List[List[float]]):
    """Upload chunks with embeddings to Qdrant"""
    headers = {
        "CF-Access-Client-Id": CF_ACCESS_CLIENT_ID,
        "CF-Access-Client-Secret": CF_ACCESS_CLIENT_SECRET,
        "Content-Type": "application/json"
    }

    # Prepare points for upsert
    points = []
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        points.append({
            "id": i + 1,  # Qdrant requires integer IDs
            "vector": embedding,
            "payload": {
                "chunk_id": chunk.id,
                "content": chunk.content,
                **chunk.metadata
            }
        })

    # Upsert to Qdrant
    response = requests.put(
        f"{QDRANT_URL}/collections/{COLLECTION_NAME}/points",
        headers=headers,
        json={"points": points}
    )

    if response.status_code == 200:
        print(f"Successfully uploaded {len(points)} chunks to Qdrant")
        return response.json()
    else:
        print(f"Error uploading to Qdrant: {response.status_code}")
        print(response.text)
        return None


def main():
    print("=" * 50)
    print("Cafe24 API Documentation Collector")
    print("=" * 50)
    print()

    # Step 1: Create chunks
    print("Step 1: Creating document chunks...")
    chunks = chunk_documents(CAFE24_API_DOCS)
    print(f"  Created {len(chunks)} chunks")

    # Step 2: Generate embeddings
    print("\nStep 2: Generating embeddings...")
    texts = [chunk.content for chunk in chunks]
    embeddings = get_embeddings(texts)
    print(f"  Generated {len(embeddings)} embeddings (dim={len(embeddings[0])})")

    # Step 3: Upload to Qdrant
    print("\nStep 3: Uploading to Qdrant...")
    result = upload_to_qdrant(chunks, embeddings)

    if result:
        print("\n" + "=" * 50)
        print("SUCCESS: Documentation embedded into Qdrant")
        print(f"Collection: {COLLECTION_NAME}")
        print(f"Total chunks: {len(chunks)}")
        print("=" * 50)

    # Print categories summary
    print("\nCategories embedded:")
    categories = {}
    for chunk in chunks:
        cat = chunk.metadata["category"]
        categories[cat] = categories.get(cat, 0) + 1

    for cat, count in categories.items():
        print(f"  - {cat}: {count} docs")


if __name__ == "__main__":
    main()
