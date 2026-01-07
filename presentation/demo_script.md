# Cafe24 CRM AI 프로토타입 - 데모 시나리오 스크립트

## 데모 개요
- **소요 시간**: 약 15-20분
- **목표**: 온톨로지 + RAG + LLM 융합 시스템의 가치 시연
- **청중**: 기술 리더, PM, 개발자

---

## 사전 준비

### 브라우저 탭 준비 (순서대로)
1. Neo4j Browser: https://neo4j.saemiro.com
2. Qdrant Dashboard: https://qdrant.saemiro.com/dashboard
3. LiteLLM: https://llm.saemiro.com
4. Grafana: https://grafana.saemiro.com

### 터미널 준비
```bash
# 테스트용 터미널 열기
cd /Users/admin/cafe24-crm-prototype
```

---

## 데모 시나리오 1: 온톨로지 시각화 (3분)

### 스크립트
> "먼저 CRM 도메인 온톨로지를 살펴보겠습니다. Neo4j에 구축된 고객-주문-상품 관계를 확인합니다."

### 단계

1. **Neo4j 브라우저 접속**
   - URL: https://neo4j.saemiro.com
   - ID: `neo4j` / PW: `ontology2025!`

2. **전체 CRM 그래프 조회**
```cypher
MATCH (n:CRM_Customer)-[r]->(m)
RETURN n, r, m LIMIT 30
```

3. **설명 포인트**
   - "고객 노드와 주문, 상품 간의 관계를 시각적으로 볼 수 있습니다."
   - "이 관계 정보가 LLM의 답변 품질을 높이는 핵심입니다."

4. **고객 세그먼트 조회**
```cypher
MATCH (s:CRM_CustomerSegment)<-[:BELONGS_TO]-(c:CRM_Customer)
RETURN s.name as segment, count(c) as customer_count
ORDER BY customer_count DESC
```

---

## 데모 시나리오 2: 벡터 검색 (3분)

### 스크립트
> "다음으로 Qdrant 벡터 DB에 저장된 CRM 지식을 검색해보겠습니다."

### 단계

1. **Qdrant 대시보드 접속**
   - URL: https://qdrant.saemiro.com/dashboard

2. **컬렉션 확인**
   - `cafe24_crm_knowledge`: 33개 Q&A 포인트
   - `cafe24_insights`: 10개 인사이트

3. **터미널에서 검색 테스트**
```bash
cd /Users/admin/cafe24-crm-prototype
source venv/bin/activate

python3 << 'EOF'
from sentence_transformers import SentenceTransformer
import requests

model = SentenceTransformer('all-MiniLM-L6-v2')
query = "고객 등급 자동화 전략"
vector = model.encode(query).tolist()

response = requests.post(
    "https://qdrant.saemiro.com/collections/cafe24_insights/points/search",
    headers={
        "Content-Type": "application/json",
        "CF-Access-Client-Id": "33fc2fac58bf5237d16ac159db51b46b.access",
        "CF-Access-Client-Secret": "7251ba3d0093523b81898e1df292ba8531b48db96d981224c8612fb1f3c1183c"
    },
    json={"vector": vector, "limit": 3, "with_payload": True}
)

for r in response.json().get("result", []):
    print(f"Score: {r['score']:.4f} - {r['payload']['title']}")
EOF
```

4. **설명 포인트**
   - "자연어 질의가 벡터로 변환되어 유사한 문서를 찾습니다."
   - "이 검색 결과가 LLM에 컨텍스트로 제공됩니다."

---

## 데모 시나리오 3: LLM 통합 질의 (5분)

### 스크립트
> "이제 LiteLLM 게이트웨이를 통해 AI 모델에 질문해보겠습니다."

### 단계

1. **A 그룹: 기본 LLM 질의 (베이스라인)**
```bash
curl -s "https://llm.saemiro.com/v1/chat/completions" \
  -H "Authorization: Bearer sk-litellm-master-key" \
  -H "CF-Access-Client-Id: 33fc2fac58bf5237d16ac159db51b46b.access" \
  -H "CF-Access-Client-Secret: 7251ba3d0093523b81898e1df292ba8531b48db96d981224c8612fb1f3c1183c" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "cafe24-crm-llama",
    "messages": [
      {"role": "user", "content": "Cafe24 주문 API의 주요 엔드포인트를 설명해줘"}
    ],
    "max_tokens": 300
  }' | jq '.choices[0].message.content'
```

2. **B 그룹: RAG 컨텍스트 추가**
```bash
# 먼저 관련 문서 검색 (시뮬레이션)
echo "📚 RAG 검색 결과:"
echo "- /api/v2/admin/orders (주문 목록 조회)"
echo "- /api/v2/admin/orders/{order_id} (주문 상세)"

# RAG 컨텍스트와 함께 질의
curl -s "https://llm.saemiro.com/v1/chat/completions" \
  -H "Authorization: Bearer sk-litellm-master-key" \
  -H "CF-Access-Client-Id: 33fc2fac58bf5237d16ac159db51b46b.access" \
  -H "CF-Access-Client-Secret: 7251ba3d0093523b81898e1df292ba8531b48db96d981224c8612fb1f3c1183c" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "cafe24-crm-llama",
    "messages": [
      {"role": "system", "content": "Cafe24 API 문서 참고:\n- /api/v2/admin/orders: 주문 목록 조회, limit/offset 파라미터 지원\n- /api/v2/admin/orders/{order_id}: 주문 상세 조회"},
      {"role": "user", "content": "Cafe24 주문 API의 주요 엔드포인트를 설명해줘"}
    ],
    "max_tokens": 300
  }' | jq '.choices[0].message.content'
```

3. **C 그룹: 온톨로지 + RAG**
```bash
# 온톨로지 관계 정보 추가 (시뮬레이션)
echo "🔗 온톨로지 관계:"
echo "- Customer -[PLACES_ORDER]-> Order"
echo "- Order -[INCLUDES]-> Product"
echo "- Customer -[BELONGS_TO]-> CustomerSegment"

# 풀 컨텍스트 질의
curl -s "https://llm.saemiro.com/v1/chat/completions" \
  -H "Authorization: Bearer sk-litellm-master-key" \
  -H "CF-Access-Client-Id: 33fc2fac58bf5237d16ac159db51b46b.access" \
  -H "CF-Access-Client-Secret: 7251ba3d0093523b81898e1df292ba8531b48db96d981224c8612fb1f3c1183c" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "cafe24-crm-llama",
    "messages": [
      {"role": "system", "content": "Cafe24 CRM 전문가입니다.\n\n[API 문서]\n- /api/v2/admin/orders: 주문 목록\n- /api/v2/admin/orders/{id}: 주문 상세\n\n[온톨로지 관계]\n- Customer -[PLACES_ORDER]-> Order\n- Order -[INCLUDES]-> Product\n- Customer -[BELONGS_TO]-> CustomerSegment"},
      {"role": "user", "content": "VIP 고객의 주문 패턴을 분석하려면 어떤 API를 어떤 순서로 호출해야 해?"}
    ],
    "max_tokens": 400
  }' | jq '.choices[0].message.content'
```

4. **설명 포인트**
   - "A, B, C 순서대로 응답 품질이 향상됨을 확인"
   - "온톨로지 관계 정보가 추가되면 더 정확한 워크플로우 제안"

---

## 데모 시나리오 4: 모니터링 (2분)

### 스크립트
> "마지막으로 시스템 모니터링 현황을 확인하겠습니다."

### 단계

1. **Grafana 대시보드 접속**
   - URL: https://grafana.saemiro.com
   - ID: `admin` / PW: `grafana_admin_2025`

2. **인프라 현황 확인**
   - CPU, Memory, Disk 사용률
   - Docker 컨테이너 상태
   - 서비스 가동 시간

3. **설명 포인트**
   - "프로덕션 환경을 위한 모니터링 체계 구축 완료"
   - "Slack 알림 연동으로 실시간 모니터링"

---

## Q&A 대비 자료

### Q: Fine-tuning 모델은 어디에?
> A: Together AI에서 Llama 3 8B 기반으로 fine-tuning 완료. 전용 엔드포인트 배포를 위해서는 추가 비용이 발생하여 현재 데모에서는 serverless Llama 3.1 8B 사용 중.

### Q: 온톨로지 업데이트는 어떻게?
> A: n8n 워크플로우로 자동화 가능. Cafe24 API에서 새 데이터 수집 시 Neo4j에 자동 반영.

### Q: 성능은?
> A: 현재 응답 시간 2-3초. 프로덕션에서는 캐싱 및 병렬 처리로 1초 이하 목표.

### Q: 보안은?
> A: Cloudflare Access로 모든 서비스 인증. API 키는 환경 변수로 관리.

---

## 데모 후 체크리스트

- [ ] 브라우저 탭 정리
- [ ] 터미널 히스토리 클리어
- [ ] 피드백 수집
- [ ] 다음 단계 논의

---

## 비상 시나리오

### 서비스 접속 불가 시
```bash
# 서비스 상태 확인
sshpass -p 'Dbwlsl12#$' ssh yrseo@100.108.110.57 "docker ps"

# 재시작
sshpass -p 'Dbwlsl12#$' ssh yrseo@100.108.110.57 "cd ~/ai-stack && docker compose restart"
```

### Neo4j 인증 실패 시
```bash
# Neo4j 재시작
sshpass -p 'Dbwlsl12#$' ssh yrseo@100.108.110.57 "docker restart neo4j"
# 30초 대기 후 재접속
```

### LLM 응답 없음 시
```bash
# LiteLLM 로그 확인
sshpass -p 'Dbwlsl12#$' ssh yrseo@100.108.110.57 "docker logs litellm --tail 20"

# 재시작
sshpass -p 'Dbwlsl12#$' ssh yrseo@100.108.110.57 "cd ~/ai-stack && docker compose restart litellm"
```
