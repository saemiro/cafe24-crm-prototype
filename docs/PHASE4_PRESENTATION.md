# Cafe24 CRM Prototype - Phase 4 프레젠테이션

## 프로젝트 개요

**목적**: AI 기반 CRM 시스템 프로토타입 개발
**기간**: 2025-12 ~ 2026-01
**상태**: Phase 4 완료 (프레젠테이션 준비)

---

## 아키텍처 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cafe24 CRM Prototype                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Qdrant     │  │   Neo4j      │  │  LiteLLM     │          │
│  │  (Vector DB) │  │ (Graph DB)   │  │ (AI Gateway) │          │
│  │  63 points   │  │ 165 nodes    │  │ fine-tuned   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                 │                 │                   │
│         └─────────────────┴─────────────────┘                   │
│                           │                                      │
│                   ┌───────┴───────┐                             │
│                   │     n8n       │                             │
│                   │ 24 workflows  │                             │
│                   └───────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 핵심 성과

### 1. AI 기반 온톨로지 구축
| 지표 | 값 |
|------|-----|
| Neo4j 노드 | 165개 |
| Neo4j 관계 | 1,104개 |
| 엔티티 타입 | Customer, Order, Product, Pattern 등 |

### 2. 벡터 임베딩 시스템
| 컬렉션 | 포인트 수 | 용도 |
|--------|-----------|------|
| cafe24_api_docs | 37 | API 문서 임베딩 |
| cafe24_crm_knowledge | 10 | CRM 지식 |
| cafe24_insights | 16 | 발견된 인사이트 |

### 3. Fine-tuned 모델
- **Base Model**: Meta-Llama-3-8B
- **학습 데이터**: 17,540 tokens
- **특화 영역**: Cafe24 CRM 도메인

### 4. 자동화 워크플로우 (24개)
| 카테고리 | 워크플로우 수 | 주요 기능 |
|----------|--------------|-----------|
| AB Test | 4 | LLM 성능 비교 |
| Dashboard | 2 | API 및 UI |
| Auto Discovery | 5 | 자동 연구/분석 |
| Intelligent | 4 | 크로스 패턴, 학습 |
| Infrastructure | 6 | 온톨로지, OAuth |
| Model Warmup | 1 | cold start 방지 |
| Cross Pattern | 2 | 패턴 발견 v1/v2 |

---

## 발견된 CRM 패턴 (9개)

### Web Research 패턴 (3개)
1. **황금 비율 이탈 패턴**
   - Customer:Product:Order 비율 분석
   - 재구매율 지표 도출

2. **엔티티 희소성 격차 패턴**
   - Product vs Customer 수 격차
   - 니치 마켓 전략 시사점

3. **비대칭 엔티티 밀도 패턴**
   - Order > Customer + Product
   - 높은 재구매율 지표

### Cross-Domain 패턴 (6개)
1. Customer 중심 생태계 허브
2. 데이터 밀도 불균형
3. 관계 복잡도 패턴
4. 시계열 연관성
5. 세그먼트 클러스터링
6. 이탈 예측 신호

---

## 기술 스택

| 계층 | 기술 |
|------|------|
| AI/ML | Together AI, LiteLLM, Claude |
| Graph DB | Neo4j 5.x |
| Vector DB | Qdrant |
| Workflow | n8n |
| Monitoring | Grafana, Prometheus |
| Infrastructure | Docker, Cloudflare |

---

## 데모 시나리오

### 시나리오 1: RAG 기반 CRM 질의
1. 사용자가 "고객 이탈 예측 방법" 질의
2. Qdrant에서 관련 문서 검색
3. Neo4j에서 온톨로지 컨텍스트 추출
4. Fine-tuned 모델이 도메인 특화 응답 생성

### 시나리오 2: 자동 패턴 발견
1. Cross_Pattern v2 워크플로우 실행
2. 웹 연구 결과와 내부 데이터 비교
3. 신규 패턴 자동 발견 및 저장
4. Slack 알림 및 대시보드 업데이트

### 시나리오 3: AB Test 비교
1. A_Baseline: 순수 LLM (컨텍스트 없음)
2. B_RAG_Only: RAG 방식
3. C_Ontology_Plus: 온톨로지 + RAG (최적)
4. 품질 점수 비교 분석

---

## 접속 정보

| 서비스 | URL |
|--------|-----|
| n8n | https://n8n.saemiro.com |
| Grafana | https://grafana.saemiro.com/d/cafe24-crm |
| Neo4j | http://100.108.110.57:7474/browser/ |
| Qdrant | http://100.108.110.57:6333/dashboard |

---

## 다음 단계 (Phase 5 계획)

1. **프로덕션 배포**
   - Kubernetes 클러스터 구성
   - CI/CD 파이프라인 구축

2. **확장성 개선**
   - Multi-tenant 지원
   - API Rate Limiting

3. **모니터링 강화**
   - 실시간 알림 시스템
   - 비용 최적화 대시보드

---

## 문서 목록

| 문서 | 위치 |
|------|------|
| 워크플로우 상세 | docs/N8N_WORKFLOWS_DETAIL.md |
| Neo4j 시각화 | docs/NEO4J_VISUALIZATION_QUERIES.md |
| 시스템 상태 | docs/SYSTEM_STATUS.md |

---

**최종 업데이트**: 2026-01-08
**작성**: Claude Code (Automated)
