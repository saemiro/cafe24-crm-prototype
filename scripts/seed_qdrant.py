#!/usr/bin/env python3
"""
Qdrant Collection Seeder for Cafe24 CRM Prototype
Seeds cafe24_crm_knowledge and cafe24_insights collections
"""

import json
import requests
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
import hashlib

# Configuration
QDRANT_URL = "https://qdrant.saemiro.com"
CF_ACCESS_CLIENT_ID = "33fc2fac58bf5237d16ac159db51b46b.access"
CF_ACCESS_CLIENT_SECRET = "7251ba3d0093523b81898e1df292ba8531b48db96d981224c8612fb1f3c1183c"

# Initialize embedding model (384-dim output)
print("🔄 Loading embedding model...")
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_headers():
    return {
        "Content-Type": "application/json",
        "CF-Access-Client-Id": CF_ACCESS_CLIENT_ID,
        "CF-Access-Client-Secret": CF_ACCESS_CLIENT_SECRET
    }

def generate_id(text: str) -> int:
    """Generate a stable numeric ID from text"""
    return int(hashlib.md5(text.encode()).hexdigest()[:8], 16)

def create_embedding(text: str) -> List[float]:
    """Create embedding for text"""
    return model.encode(text).tolist()

def upsert_points(collection_name: str, points: List[Dict[str, Any]]):
    """Upsert points to Qdrant collection"""
    url = f"{QDRANT_URL}/collections/{collection_name}/points"

    payload = {"points": points}

    response = requests.put(
        url,
        headers=get_headers(),
        json=payload
    )

    if response.status_code == 200:
        print(f"✅ Upserted {len(points)} points to {collection_name}")
    else:
        print(f"❌ Error upserting to {collection_name}: {response.status_code}")
        print(response.text)

    return response.status_code == 200

def load_training_data(filepath: str) -> List[Dict]:
    """Load JSONL training data"""
    data = []
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                data.append(json.loads(line))
    return data

def seed_crm_knowledge():
    """Seed cafe24_crm_knowledge collection with Q&A pairs"""
    print("\n📚 Seeding cafe24_crm_knowledge collection...")

    # Load training data
    data = load_training_data("/Users/admin/cafe24-crm-prototype/data/cafe24_finetuning_dataset.jsonl")
    print(f"📄 Loaded {len(data)} training examples")

    points = []
    for item in data:
        messages = item.get("messages", [])
        if len(messages) >= 3:
            question = messages[1].get("content", "")
            answer = messages[2].get("content", "")

            # Create combined text for embedding
            combined_text = f"질문: {question}\n답변: {answer[:500]}"

            point = {
                "id": generate_id(question),
                "vector": create_embedding(combined_text),
                "payload": {
                    "question": question,
                    "answer": answer,
                    "category": "cafe24_api",
                    "source": "finetuning_dataset"
                }
            }
            points.append(point)

    # Upsert in batches of 100
    batch_size = 100
    for i in range(0, len(points), batch_size):
        batch = points[i:i+batch_size]
        upsert_points("cafe24_crm_knowledge", batch)

    print(f"✅ Seeded {len(points)} Q&A pairs to cafe24_crm_knowledge")
    return len(points)

def seed_insights():
    """Seed cafe24_insights collection with CRM insights"""
    print("\n💡 Seeding cafe24_insights collection...")

    # CRM domain insights based on domain.yaml
    insights = [
        {
            "title": "고객 세그멘테이션 전략",
            "content": "Cafe24 CRM에서 고객을 VIP, 일반, 휴면 등으로 세분화하여 맞춤형 마케팅 전략을 수립합니다. RFM(Recency, Frequency, Monetary) 분석을 활용하여 고객 가치를 측정합니다.",
            "category": "customer_segmentation",
            "tags": ["고객관리", "세그멘테이션", "RFM", "VIP"]
        },
        {
            "title": "주문 라이프사이클 관리",
            "content": "주문 상태(pending, processing, shipped, delivered, cancelled)별 자동화된 커뮤니케이션을 설정합니다. 주문 완료 후 리뷰 요청, 재구매 유도 등의 워크플로우를 구성합니다.",
            "category": "order_management",
            "tags": ["주문관리", "자동화", "워크플로우"]
        },
        {
            "title": "캠페인 효과 측정",
            "content": "마케팅 캠페인의 성과를 측정하기 위해 전환율, CTR, ROI 등의 KPI를 추적합니다. A/B 테스트를 통해 최적의 캠페인 전략을 도출합니다.",
            "category": "campaign_analytics",
            "tags": ["캠페인", "분석", "KPI", "A/B테스트"]
        },
        {
            "title": "고객 360 뷰 구축",
            "content": "주문 이력, 상품 조회 기록, 문의 내역, 리뷰 등 모든 고객 접점 데이터를 통합하여 360도 고객 뷰를 구축합니다. 이를 통해 개인화된 고객 경험을 제공합니다.",
            "category": "customer_360",
            "tags": ["고객뷰", "데이터통합", "개인화"]
        },
        {
            "title": "휴면 고객 재활성화",
            "content": "90일 이상 구매 이력이 없는 휴면 고객을 대상으로 재활성화 캠페인을 진행합니다. 개인화된 쿠폰, 맞춤 상품 추천 등을 활용합니다.",
            "category": "customer_retention",
            "tags": ["휴면고객", "재활성화", "리텐션"]
        },
        {
            "title": "AI 기반 상품 추천",
            "content": "고객의 구매 패턴, 조회 이력, 유사 고객 분석을 통해 AI 기반 상품 추천 시스템을 구축합니다. 협업 필터링과 컨텐츠 기반 필터링을 조합하여 정확도를 높입니다.",
            "category": "recommendation",
            "tags": ["AI", "추천시스템", "개인화"]
        },
        {
            "title": "Cafe24 API 연동 베스트 프랙티스",
            "content": "Cafe24 API 연동 시 Rate Limit(분당 100회) 준수, 토큰 갱신 자동화, 에러 핸들링 전략 등을 고려해야 합니다. OAuth 2.0 인증 플로우를 정확히 구현합니다.",
            "category": "api_integration",
            "tags": ["API", "연동", "베스트프랙티스"]
        },
        {
            "title": "실시간 재고 동기화",
            "content": "Cafe24 상품 API를 통해 실시간으로 재고를 동기화하고, 품절 시 자동 알림을 발송합니다. 재고 부족 상품에 대한 자동 발주 시스템을 구축할 수 있습니다.",
            "category": "inventory_management",
            "tags": ["재고관리", "동기화", "자동화"]
        },
        {
            "title": "고객 등급 자동화",
            "content": "구매 금액, 구매 횟수, 리뷰 작성 등의 기준으로 고객 등급을 자동으로 관리합니다. 등급별 차별화된 혜택(할인율, 적립률)을 제공합니다.",
            "category": "customer_tier",
            "tags": ["고객등급", "자동화", "혜택"]
        },
        {
            "title": "온톨로지 기반 CRM",
            "content": "CRM 도메인 온톨로지를 Neo4j 그래프 데이터베이스에 구축하여 고객-주문-상품-캠페인 간의 관계를 시각화하고 분석합니다. 관계 기반 인사이트를 도출합니다.",
            "category": "ontology",
            "tags": ["온톨로지", "Neo4j", "그래프DB"]
        }
    ]

    points = []
    for insight in insights:
        text = f"{insight['title']}: {insight['content']}"
        point = {
            "id": generate_id(insight['title']),
            "vector": create_embedding(text),
            "payload": {
                "title": insight["title"],
                "content": insight["content"],
                "category": insight["category"],
                "tags": insight["tags"]
            }
        }
        points.append(point)

    upsert_points("cafe24_insights", points)
    print(f"✅ Seeded {len(points)} insights to cafe24_insights")
    return len(points)

def verify_collections():
    """Verify collection counts"""
    print("\n🔍 Verifying collections...")

    for collection in ["cafe24_crm_knowledge", "cafe24_insights"]:
        url = f"{QDRANT_URL}/collections/{collection}"
        response = requests.get(url, headers=get_headers())
        if response.status_code == 200:
            count = response.json().get("result", {}).get("points_count", 0)
            print(f"  📊 {collection}: {count} points")
        else:
            print(f"  ❌ Failed to get {collection} info")

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Qdrant Seeder for Cafe24 CRM Prototype")
    print("=" * 60)

    # Seed collections
    knowledge_count = seed_crm_knowledge()
    insights_count = seed_insights()

    # Verify
    verify_collections()

    print("\n" + "=" * 60)
    print(f"✅ Seeding complete!")
    print(f"   - cafe24_crm_knowledge: {knowledge_count} points")
    print(f"   - cafe24_insights: {insights_count} points")
    print("=" * 60)
