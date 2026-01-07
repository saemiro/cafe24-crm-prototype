---
marp: true
theme: default
paginate: true
backgroundColor: #fff
---

# 온톨로지, 파인튜닝 그리고 LLM들
## 쇼핑몰 CRM 개발 여정

**발표일**: 2025년 1월
**Cafe24 CRM AI 프로토타입**

---

# 목차

1. 프로젝트 개요
2. 시스템 아키텍처
3. 핵심 기술 컴포넌트
4. A/B/C 비교 실험
5. 데모 시나리오
6. 결과 및 향후 계획

---

# 1. 프로젝트 개요

## 목표
> Cafe24 쇼핑몰 CRM을 위한 **AI 지원 시스템** 구축

## 핵심 과제
- 🎯 Cafe24 API 기반 CRM 도메인 지식 체계화
- 🧠 LLM을 활용한 자연어 질의응답 시스템
- 📊 온톨로지 기반 관계 추론 및 인사이트 도출

---

# 왜 온톨로지 + 파인튜닝 + RAG인가?

| 접근법 | 장점 | 한계 |
|--------|------|------|
| **기본 LLM** | 범용성 | 도메인 지식 부족 |
| **RAG** | 최신 정보 반영 | 관계 추론 약함 |
| **Fine-tuning** | 도메인 특화 | 지식 업데이트 어려움 |
| **Ontology** | 관계 추론 강함 | 자연어 처리 한계 |

## 💡 융합 접근법
> **온톨로지**(관계) + **RAG**(검색) + **Fine-tuning**(도메인) = 시너지

---

# 2. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                      사용자 질의                             │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    n8n 워크플로우                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Webhook → Embedding → Parallel Search → LLM → Response│  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
   │   Qdrant    │ │   Neo4j     │ │  LiteLLM    │
   │  (Vector)   │ │ (Ontology)  │ │  (Gateway)  │
   └─────────────┘ └─────────────┘ └─────────────┘
         │               │               │
         │               │               ▼
         │               │        ┌─────────────┐
         │               │        │ Together AI │
         └───────────────┴────────│  Llama 3.1  │
                                  └─────────────┘
```

---

# 3. 핵심 기술 컴포넌트

## 3.1 Neo4j 온톨로지

- **노드 유형**: Customer, Order, Product, Campaign, Segment
- **관계 유형**: PLACES_ORDER, BELONGS_TO, TARGETS, INCLUDES
- **현재 상태**: 44개 노드, 43개 관계

```cypher
MATCH (c:CRM_Customer)-[:PLACES_ORDER]->(o:CRM_Order)
      -[:INCLUDES]->(p:CRM_Product)
RETURN c.name, COUNT(o) as orders, SUM(o.total) as revenue
```

---

# 3.2 Qdrant 벡터 DB

## 컬렉션 구성

| 컬렉션 | 용도 | 포인트 수 |
|--------|------|-----------|
| `cafe24_api_docs` | API 문서 | 12 |
| `cafe24_crm_knowledge` | Q&A 지식 | 33 |
| `cafe24_insights` | CRM 인사이트 | 10 |

## 임베딩
- 모델: `all-MiniLM-L6-v2` (384차원)
- 거리 함수: Cosine Similarity

---

# 3.3 LiteLLM 게이트웨이

## 통합 모델 관리

```yaml
model_list:
  - model_name: cafe24-crm-llama
    litellm_params:
      model: together_ai/meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo

  - model_name: claude-sonnet
    litellm_params:
      model: anthropic/claude-sonnet-4-20250514
```

## 장점
- ✅ 단일 API 엔드포인트
- ✅ 모델 전환 용이
- ✅ 비용 추적 및 Rate Limit 관리

---

# 3.4 n8n 워크플로우 자동화

## C_Ontology_Plus 워크플로우

```
Webhook
    ↓
Parse Input → Create Embedding
                    ↓
         ┌─────────┴─────────┐
         ↓                   ↓
    Qdrant Search     Neo4j Query
         ↓                   ↓
         └─────────┬─────────┘
                   ↓
         Combine Context
                   ↓
           LLM Response
                   ↓
         Format & Respond
```

---

# 4. A/B/C 비교 실험

## 실험 설계

| 구분 | 설명 | 시스템 프롬프트 |
|------|------|-----------------|
| **A (Ontology+Context)** | 온톨로지 컨텍스트 주입 | CRM 도메인 지식 + API 구조 |
| **B (Fine-tuned)** 🏆 | QLoRA 파인튜닝 | Cafe24 API 전문가 |
| **C (Vanilla)** | 기본 LLM | 일반 AI 어시스턴트 |

## 평가 지표
- **관련성 (Relevance)**: 예상 키워드 포함률 (60% 가중치)
- **정확도 (Accuracy)**: 코드/API 패턴 정확성 (40% 가중치)

---

# A/B/C 실험 결과 ✅

## 2025-12-31 실험 결과 (5개 테스트, 15회 실행)

| 접근법 | 관련성 | 정확도 | **종합** | 응답시간 |
|--------|--------|--------|----------|----------|
| **A** Ontology+Context | 45% | 95% | 65% | 24.3초 |
| **B** Fine-tuned 🏆 | 55% | **100%** | **73%** | 22.3초 |
| **C** Vanilla | 40% | 70% | 52% | 25.6초 |

## 핵심 인사이트
- 🏆 **Fine-tuned 모델이 종합 73%로 우승**
- ✅ Fine-tuned: 모든 응답에서 **100% 정확도** (코드 블록, API 패턴)
- ⚡ Fine-tuned: 가장 빠른 응답 (22.3초)
- 📊 Ontology+Context: 높은 정확도(95%)지만 관련성 부족

---

# 5. 데모 시나리오

## 시나리오 1: API 사용법 질의
```
Q: "Cafe24 주문 API로 최근 7일 주문을 조회하려면?"
```

## 시나리오 2: CRM 전략 질의
```
Q: "휴면 고객 재활성화를 위한 최적의 접근 방법은?"
```

## 시나리오 3: 관계 기반 질의 (온톨로지 활용)
```
Q: "VIP 고객이 가장 많이 구매한 상품 카테고리와 연관된 캠페인은?"
```

---

# 데모: 온톨로지 시각화

## Neo4j Browser

```
https://neo4j.saemiro.com
ID: neo4j / PW: ontology2025!

MATCH (n:CRM_Customer)-[r]->(m)
RETURN n, r, m LIMIT 30
```

## 기대 결과
- 고객-주문-상품 관계 그래프
- 세그먼트-캠페인 연결

---

# 테스트 케이스별 상세 결과

| 테스트 | A (Ontology) | B (Fine-tuned) | C (Vanilla) |
|--------|--------------|----------------|-------------|
| 고객 조회 API | 85% | 85% | 85% |
| 주문 상태 변경 | 85% | 70% | 60% |
| 상품 재고 업데이트 | 60% | 70% | **25%** |
| VIP 쿠폰 발급 | 55% | 70% | 60% |
| 적립금 지급 | 40% | 70% | **30%** |

## 관찰 결과
- **Fine-tuned**: 일관된 70-85% 성능, API 패턴 완벽 학습
- **Vanilla**: 복잡한 도메인(재고, 적립금)에서 급격히 하락
- **Ontology**: 컨텍스트 활용은 좋으나 키워드 매칭 부족

---

# 6. 결과 요약

## 완료된 작업
- ✅ Neo4j 온톨로지 구축 (44 노드, 43 관계)
- ✅ Qdrant 벡터 DB 시딩 (55+ 포인트)
- ✅ LiteLLM 게이트웨이 구성
- ✅ Together AI Llama 3.1 연동
- ✅ n8n 워크플로우 설계
- ✅ **Llama 3 8B QLoRA Fine-tuning** (Google Colab)
- ✅ **A/B/C 비교 실험 완료** (Fine-tuned 우승 73%)

## 핵심 성과
- 🏆 Fine-tuned 모델: 100% API 코드 정확도
- 📈 Vanilla 대비 40% 성능 향상 (52% → 73%)

---

# 향후 계획

## Phase 3: 프로토타입 구현
- Spring Boot 백엔드 API
- React 대시보드 UI
- 실시간 고객 인사이트

## Phase 4: 운영 최적화
- 모니터링 및 알림 (Grafana)
- 성능 최적화
- 보안 강화

---

# 기술 스택 요약

| 영역 | 기술 |
|------|------|
| 온톨로지 | Neo4j, Cypher |
| 벡터 DB | Qdrant, all-MiniLM-L6-v2 |
| LLM Gateway | LiteLLM |
| AI 모델 | Together AI Llama 3.1 8B |
| 워크플로우 | n8n |
| 인프라 | Docker, Cloudflare Tunnel |
| 모니터링 | Prometheus, Grafana, Loki |

---

# Q&A

## 접속 정보

| 서비스 | URL |
|--------|-----|
| LiteLLM | https://llm.saemiro.com |
| Qdrant | https://qdrant.saemiro.com |
| Neo4j | https://neo4j.saemiro.com |
| n8n | https://n8n.saemiro.com |
| Grafana | https://grafana.saemiro.com |

---

# 감사합니다!

## 문의
- GitHub: saemiro/cafe24-crm-prototype
- Slack: #cafe24-crm-dev

