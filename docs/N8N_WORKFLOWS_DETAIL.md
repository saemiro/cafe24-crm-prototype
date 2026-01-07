# Cafe24 CRM n8n 워크플로우 상세 문서

> **최종 업데이트**: 2025-01-07
> **총 워크플로우**: 22개 (활성: 21, 비활성: 1)
> **API 수집 기준**: n8n REST API v1

---

## 목차

1. [개요](#개요)
2. [워크플로우 분류](#워크플로우-분류)
3. [AB 테스트 워크플로우](#1-ab-테스트-워크플로우)
4. [대시보드 워크플로우](#2-대시보드-워크플로우)
5. [자동 발견 워크플로우](#3-자동-발견-워크플로우)
6. [지능형 워크플로우](#4-지능형-워크플로우)
7. [인프라 워크플로우](#5-인프라-워크플로우)
8. [외부 서비스 연동](#외부-서비스-연동)
9. [문서 동기화 규칙](#문서-동기화-규칙)

---

## 개요

이 문서는 Cafe24 CRM 프로토타입의 n8n 워크플로우들의 역할과 노드 구조를 상세히 기록합니다.
워크플로우 변경 시 이 문서와 CLAUDE.md를 함께 업데이트해야 합니다.

### 워크플로우 목록 요약

| ID | 이름 | 상태 | 카테고리 | 트리거 |
|----|------|------|----------|--------|
| WKwsXkLxj8UBqDGP | Cafe24_CRM_A_Baseline | ✅ Active | AB Test | Webhook |
| ffih9DNnARcqmnjJ | Cafe24_CRM_B_RAG_Only | ✅ Active | AB Test | Webhook |
| cafe24-crm-ontology-plus | Cafe24_CRM_C_Ontology_Plus | ✅ Active | AB Test | Webhook |
| 6YzXkCPVgs41UPjO | Cafe24_CRM_Code_Generator | ✅ Active | AB Test | Webhook |
| 7ZdwZNiBvC9bE22E | Cafe24_CRM_Dashboard_API | ✅ Active | Dashboard | Webhook |
| j85dAYFnlZsU39oJ | Cafe24_CRM_Dashboard_UI | ✅ Active | Dashboard | Webhook |
| OpUQAqrO09SiP4FL | Cafe24_CRM_Morning_Research | ✅ Active | Auto Discovery | Schedule (09:00, 14:00) |
| gYJjzMLuIFK33HIx | Cafe24_CRM_Evening_Analysis | ✅ Active | Auto Discovery | Schedule (12:00, 18:00) |
| wCoa6XtXCmzp9SDA | Cafe24_CRM_Weekly_Retrospective | ✅ Active | Auto Discovery | Schedule (매일 17:00) |
| aq6TS7wXbi1yFNYm | Cafe24_CRM_Code_Analyzer | ✅ Active | Auto Discovery | Schedule (10:00, 15:00) |
| NL8Xn2vNBKxRdmDs | Cafe24_CRM_Ontology_Health | ✅ Active | Auto Discovery | Schedule (10:30, 14:30, 17:30) |
| C35FWbzj3Holtc8Q | Cafe24_CRM_Cross_Pattern | ✅ Active | Intelligent | Schedule (11:00, 16:00) |
| dVKynoD9NDc4uvcE | Cafe24_CRM_Learning_Loop | ✅ Active | Intelligent | Webhook |
| otjfwc4Pvkx1OOJi | Cafe24_CRM_Insight_Publisher | ✅ Active | Intelligent | Schedule (12:30, 18:30) |
| 8oyzf15NlKcx4BTs | CRM_Feature_Auto_Improver | ✅ Active | Intelligent | Schedule/Webhook |
| Jt642lsgyUIUXooY | Cafe24_CRM_Ontology_Builder | ✅ Active | Infrastructure | Webhook |
| pjaVXVKXNBF95sdI | Cafe24_CRM_OAuth_Start | ✅ Active | Infrastructure | Webhook |
| wp2XOTomCHBgZ93y | Cafe24_CRM_Shop_Sync | ✅ Active | Infrastructure | Schedule |
| zNvrnpkFgWRtVmC4 | Cafe24_CRM_User_Onboarding | ✅ Active | Infrastructure | Webhook |
| anSEfPH5CGjPB2qp | Cafe24_CRM_Subscription | ✅ Active | Infrastructure | Webhook |
| CRM_PROTO_COMP_01 | Cafe24_CRM_Prototype_Completion | ✅ Active | Infrastructure | Schedule/Webhook |
| ebqdt6PoQMIGORBI | Cafe24_CRM_DB_Setup | ❌ Inactive | Infrastructure | - |

---

## 워크플로우 분류

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cafe24 CRM 워크플로우 아키텍처                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐     ┌──────────────────┐                  │
│  │   AB Test (4)    │     │  Dashboard (2)   │                  │
│  │  ├ A_Baseline    │     │  ├ Dashboard_API │                  │
│  │  ├ B_RAG_Only    │     │  └ Dashboard_UI  │                  │
│  │  ├ C_Ontology+   │     │                  │                  │
│  │  └ Code_Generator│     │                  │                  │
│  └──────────────────┘     └──────────────────┘                  │
│           │                        │                            │
│           ▼                        ▼                            │
│  ┌──────────────────────────────────────────────────────┐       │
│  │              Auto Discovery (5) - 오전/오후 사이클     │       │
│  │  ├ Morning_Research (09:00, 14:00) → 리서치           │       │
│  │  ├ Evening_Analysis (12:00, 18:00) → 종합분석         │       │
│  │  ├ Weekly_Retrospective (매일 17:00) → 일일회고       │       │
│  │  ├ Code_Analyzer (10:00, 15:00) → 코드패턴            │       │
│  │  └ Ontology_Health (10:30, 14:30, 17:30) → 건강체크   │       │
│  └──────────────────────────────────────────────────────┘       │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────────────────────────────────────────┐       │
│  │              Intelligent (4) - 오전/오후 사이클        │       │
│  │  ├ Cross_Pattern (11:00, 16:00) → 패턴 발견           │       │
│  │  ├ Learning_Loop (Webhook) → 피드백 학습              │       │
│  │  ├ Insight_Publisher (12:30, 18:30) → 다이제스트      │       │
│  │  └ Feature_Auto_Improver → 자동 개선                  │       │
│  └──────────────────────────────────────────────────────┘       │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────────────────────────────────────────┐       │
│  │              Infrastructure (6)                       │       │
│  │  ├ Ontology_Builder → Neo4j 구축                     │       │
│  │  ├ OAuth_Start → Cafe24 인증                         │       │
│  │  ├ Shop_Sync → 쇼핑몰 동기화                          │       │
│  │  ├ User_Onboarding → 사용자 온보딩                    │       │
│  │  ├ Subscription → 구독 관리                           │       │
│  │  └ Prototype_Completion → 프로토타입 완성             │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. AB 테스트 워크플로우

LLM 접근법 성능을 비교하는 워크플로우들입니다.

### 1.1 Cafe24_CRM_A_Baseline

| 항목 | 값 |
|------|-----|
| **ID** | WKwsXkLxj8UBqDGP |
| **목적** | LLM 기본 성능 측정 (컨텍스트 없음) |
| **트리거** | Webhook: `POST /cafe24-crm/baseline` |
| **노드 수** | 4 |

**노드 흐름**:
```
Webhook → LLM Baseline → Format Response → Respond to Webhook
```

| 순서 | 노드명 | 타입 | 역할 |
|------|--------|------|------|
| 1 | Webhook | webhook | 요청 수신 |
| 2 | LLM Baseline | httpRequest | LiteLLM API 호출 (컨텍스트 없이) |
| 3 | Format Response | code | 응답 포맷팅 |
| 4 | Respond to Webhook | respondToWebhook | 결과 반환 |

---

### 1.2 Cafe24_CRM_B_RAG_Only

| 항목 | 값 |
|------|-----|
| **ID** | ffih9DNnARcqmnjJ |
| **목적** | RAG 방식 성능 측정 |
| **트리거** | Webhook: `POST /cafe24-crm/rag` |
| **노드 수** | 7 |

**노드 흐름**:
```
Webhook → Generate Embedding → Qdrant Search → Build Prompt → LLM with RAG → Format Response → Respond to Webhook
```

| 순서 | 노드명 | 타입 | 역할 |
|------|--------|------|------|
| 1 | Webhook | webhook | 요청 수신 |
| 2 | Generate Embedding | httpRequest | 질문 임베딩 생성 (LiteLLM) |
| 3 | Qdrant Search | httpRequest | 벡터 검색 (cafe24_api_docs) |
| 4 | Build Prompt | code | RAG 컨텍스트로 프롬프트 구성 |
| 5 | LLM with RAG | httpRequest | LiteLLM API 호출 (RAG 컨텍스트 포함) |
| 6 | Format Response | code | 응답 포맷팅 |
| 7 | Respond to Webhook | respondToWebhook | 결과 반환 |

---

### 1.3 Cafe24_CRM_C_Ontology_Plus

| 항목 | 값 |
|------|-----|
| **ID** | cafe24-crm-ontology-plus |
| **목적** | 온톨로지 + RAG 통합 접근법 (최적) |
| **트리거** | Webhook: `POST /cafe24-crm/ontology-plus` |
| **노드 수** | 9 |

**노드 흐름**:
```
Webhook → Parse Input → Create Embedding → Extract Embedding → Qdrant RAG Search → Combine RAG Context → LLM Response → Format Response → Respond to Webhook
```

| 순서 | 노드명 | 타입 | 역할 |
|------|--------|------|------|
| 1 | Webhook | webhook | 요청 수신 |
| 2 | Parse Input | code | 입력 파싱 |
| 3 | Create Embedding | httpRequest | 임베딩 생성 |
| 4 | Extract Embedding | code | 임베딩 추출 |
| 5 | Qdrant RAG Search | httpRequest | 벡터 검색 |
| 6 | Combine RAG Context | code | 컨텍스트 결합 |
| 7 | LLM Response | httpRequest | LLM 호출 |
| 8 | Format Response | code | 응답 포맷팅 |
| 9 | Respond to Webhook | respondToWebhook | 결과 반환 |

---

### 1.4 Cafe24_CRM_Code_Generator

| 항목 | 값 |
|------|-----|
| **ID** | 6YzXkCPVgs41UPjO |
| **목적** | 코드 생성 (온톨로지 + RAG 통합) |
| **트리거** | Webhook: `POST /cafe24-crm/generate` |
| **노드 수** | 8 |

**노드 흐름**:
```
Webhook → [Qdrant Search, Neo4j Context, Generate Embedding] → Merge Context → LLM Generate → Format Response → Respond to Webhook
```

| 순서 | 노드명 | 타입 | 역할 |
|------|--------|------|------|
| 1 | Webhook | webhook | 요청 수신 |
| 2 | Qdrant Search | httpRequest | 벡터 검색 |
| 3 | Neo4j Context | httpRequest | 온톨로지 컨텍스트 조회 |
| 4 | Generate Embedding | httpRequest | 임베딩 생성 |
| 5 | Merge Context | code | RAG + 온톨로지 컨텍스트 병합 |
| 6 | LLM Generate | httpRequest | 코드 생성 |
| 7 | Format Response | code | 응답 포맷팅 |
| 8 | Respond to Webhook | respondToWebhook | 결과 반환 |

---

## 2. 대시보드 워크플로우

### 2.1 Cafe24_CRM_Dashboard_API

| 항목 | 값 |
|------|-----|
| **ID** | 7ZdwZNiBvC9bE22E |
| **목적** | 대시보드 API 제공 (통계, 비교, 인사이트) |
| **트리거** | 3개의 Webhook 엔드포인트 |
| **노드 수** | 16 |

**엔드포인트별 흐름**:

#### GET /cafe24-crm/dashboard
```
GET Dashboard → [Neo4j Stats, Qdrant Stats] → Build Dashboard → Respond Dashboard
```

#### POST /cafe24-crm/compare
```
POST Compare → Prepare Compare → [Call Baseline, Call RAG, Call Ontology] → Merge Results → Respond Compare
```

#### GET /cafe24-crm/insights
```
GET Insights → Get Insights → Format Insights → Respond Insights
```

| 순서 | 노드명 | 타입 | 역할 |
|------|--------|------|------|
| 1 | GET Dashboard | webhook | 대시보드 데이터 요청 |
| 2 | POST Compare | webhook | 방식 비교 요청 |
| 3 | GET Insights | webhook | 인사이트 조회 요청 |
| 4 | Neo4j Stats | httpRequest | Neo4j 통계 조회 |
| 5 | Qdrant Stats | httpRequest | Qdrant 통계 조회 |
| 6 | Build Dashboard | code | 대시보드 데이터 구성 |
| 7 | Respond Dashboard | respondToWebhook | 대시보드 응답 |
| 8 | Prepare Compare | code | 비교 준비 |
| 9 | Call Baseline | httpRequest | Baseline 워크플로우 호출 |
| 10 | Call RAG | httpRequest | RAG 워크플로우 호출 |
| 11 | Call Ontology | httpRequest | Ontology+ 워크플로우 호출 |
| 12 | Merge Results | code | 비교 결과 병합 |
| 13 | Respond Compare | respondToWebhook | 비교 응답 |
| 14 | Get Insights | httpRequest | 인사이트 조회 |
| 15 | Format Insights | code | 인사이트 포맷팅 |
| 16 | Respond Insights | respondToWebhook | 인사이트 응답 |

---

### 2.2 Cafe24_CRM_Dashboard_UI

| 항목 | 값 |
|------|-----|
| **ID** | j85dAYFnlZsU39oJ |
| **목적** | 대시보드 UI 렌더링 지원 |
| **트리거** | Webhook |
| **노드 수** | 3 |

**노드 흐름**:
```
Webhook → Code in JavaScript → Respond to Webhook
```

---

## 3. 자동 발견 워크플로우

정기적으로 실행되어 인사이트를 발굴하는 워크플로우들입니다.

### 3.1 Cafe24_CRM_Morning_Research

| 항목 | 값 |
|------|-----|
| **ID** | OpUQAqrO09SiP4FL |
| **목적** | 시장 조사 및 인사이트 수집 (오전/오후 2회) |
| **트리거** | Schedule: 매일 09:00, 14:00 |
| **노드 수** | 10 |

**노드 흐름**:
```
Research 9AM & 2PM → Define Research Topics → Split Topics → Research Topic → Format Insight → Aggregate Insights → Build Report → [Slack Notify, Embed Report] → Store in Qdrant
```

| 순서 | 노드명 | 타입 | 역할 |
|------|--------|------|------|
| 1 | Research 9AM & 2PM | scheduleTrigger | 매일 09:00, 14:00 실행 |
| 2 | Define Research Topics | code | 연구 주제 정의 (경쟁사, 트렌드, Cafe24) |
| 3 | Split Topics | splitInBatches | 주제별 분할 처리 |
| 4 | Research Topic | httpRequest | LLM으로 주제 조사 |
| 5 | Format Insight | code | 인사이트 포맷팅 |
| 6 | Aggregate Insights | aggregate | 인사이트 집계 |
| 7 | Build Report | code | 리포트 생성 |
| 8 | Slack Notify | httpRequest | Slack 알림 발송 |
| 9 | Embed Report | httpRequest | 임베딩 생성 |
| 10 | Store in Qdrant | httpRequest | Qdrant 저장 |

**연구 주제 카테고리**:
- Competitor: Shopify, WooCommerce 분석
- Trend: E-commerce CRM AI 트렌드
- Cafe24: API 및 LLM RAG 패턴

---

### 3.2 Cafe24_CRM_Evening_Analysis

| 항목 | 값 |
|------|-----|
| **ID** | gYJjzMLuIFK33HIx |
| **목적** | 피드백과 조사 결과 종합 분석 (오전/오후 2회) |
| **트리거** | Schedule: 매일 12:00, 18:00 |
| **노드 수** | 7 |

**노드 흐름**:
```
Synthesis 12PM & 6PM → [Get Daily Feedback, Get Morning Insights] → Prepare Analysis → Analyze Patterns → Format Report → Slack Notify
```

| 순서 | 노드명 | 타입 | 역할 |
|------|--------|------|------|
| 1 | Synthesis 12PM & 6PM | scheduleTrigger | 매일 12:00, 18:00 실행 |
| 2 | Get Daily Feedback | httpRequest | 일일 피드백 조회 |
| 3 | Get Morning Insights | httpRequest | 아침 인사이트 조회 |
| 4 | Prepare Analysis | code | 분석 준비 |
| 5 | Analyze Patterns | httpRequest | 패턴 분석 |
| 6 | Format Report | code | 리포트 포맷팅 |
| 7 | Slack Notify | httpRequest | Slack 알림 |

---

### 3.3 Cafe24_CRM_Weekly_Retrospective

| 항목 | 값 |
|------|-----|
| **ID** | wCoa6XtXCmzp9SDA |
| **목적** | 일일 회고 및 종합 리포트 (매일 오후) |
| **트리거** | Schedule: 매일 17:00 |
| **노드 수** | 7 |

**노드 흐름**:
```
Daily Retrospective 5PM → [Get Daily Stats, Get Daily Insights] → Compile Metrics → Generate Retrospective → Format Report → Slack Notify
```

| 순서 | 노드명 | 타입 | 역할 |
|------|--------|------|------|
| 1 | Daily Retrospective 5PM | scheduleTrigger | 매일 17:00 실행 |
| 2 | Get Weekly Stats | httpRequest | 주간 통계 조회 |
| 3 | Get Weekly Insights | httpRequest | 주간 인사이트 조회 |
| 4 | Compile Metrics | code | 메트릭 집계 |
| 5 | Generate Retrospective | httpRequest | 회고 생성 |
| 6 | Format Report | code | 리포트 포맷팅 |
| 7 | Slack Notify | httpRequest | Slack 알림 |

---

### 3.4 Cafe24_CRM_Code_Analyzer

| 항목 | 값 |
|------|-----|
| **ID** | aq6TS7wXbi1yFNYm |
| **목적** | 코드 패턴 분석 및 재사용성 발굴 (오전/오후 2회) |
| **트리거** | Schedule: 매일 10:00, 15:00 |
| **노드 수** | 10 |

**노드 흐름**:
```
Analyze 10AM & 3PM → [Get Entity Patterns, Get Existing Code Patterns] → Prepare Analysis → Analyze Patterns → Extract Patterns → Has New Patterns? → [Store New Patterns / Skip Storage] → Call 'CRM_Feature_Auto_Improver'
```

| 순서 | 노드명 | 타입 | 역할 |
|------|--------|------|------|
| 1 | Analyze 10AM & 3PM | scheduleTrigger | 매일 10:00, 15:00 실행 |
| 2 | Get Entity Patterns | httpRequest | 엔티티 패턴 조회 |
| 3 | Get Existing Code Patterns | httpRequest | 기존 코드 패턴 조회 |
| 4 | Prepare Analysis | code | 분석 준비 |
| 5 | Analyze Patterns | httpRequest | 패턴 분석 |
| 6 | Extract Patterns | code | 패턴 추출 |
| 7 | Has New Patterns? | if | 새 패턴 여부 확인 |
| 8 | Store New Patterns | httpRequest | 새 패턴 저장 |
| 9 | Skip Storage | code | 저장 건너뛰기 |
| 10 | Call 'CRM_Feature_Auto_Improver' | executeWorkflow | 자동 개선 워크플로우 호출 |

---

### 3.5 Cafe24_CRM_Ontology_Health

| 항목 | 값 |
|------|-----|
| **ID** | NL8Xn2vNBKxRdmDs |
| **목적** | 온톨로지 건강도 모니터링 (하루 3회) |
| **트리거** | Schedule: 매일 10:30, 14:30, 17:30 |
| **노드 수** | 8 |

**노드 흐름**:
```
Health 10:30AM 2:30PM 5:30PM → Check Ontology Stats → Calculate Health Metrics → Health Check → [Get Recommendations → Format Alert → Slack Alert] → Store Health Log
```

| 순서 | 노드명 | 타입 | 역할 |
|------|--------|------|------|
| 1 | Health 10:30AM 2:30PM 5:30PM | scheduleTrigger | 매일 10:30, 14:30, 17:30 실행 |
| 2 | Check Ontology Stats | httpRequest | Neo4j 통계 조회 |
| 3 | Calculate Health Metrics | code | 건강도 계산 (고아 노드, 관계 수) |
| 4 | Health Check | if | 건강도 상태 확인 |
| 5 | Get Recommendations | httpRequest | 개선 권고사항 조회 |
| 6 | Format Alert | code | 알림 포맷팅 |
| 7 | Slack Alert | httpRequest | Slack 경고 발송 |
| 8 | Store Health Log | httpRequest | 건강도 로그 저장 |

---

## 4. 지능형 워크플로우

학습과 패턴 발견을 수행하는 고급 워크플로우들입니다.

### 4.1 Cafe24_CRM_Cross_Pattern

| 항목 | 값 |
|------|-----|
| **ID** | C35FWbzj3Holtc8Q |
| **목적** | 도메인 간 숨겨진 연결 발견 (오전/오후 2회) |
| **트리거** | Schedule: 매일 11:00, 16:00 |
| **노드 수** | 11 |

**노드 흐름**:
```
Pattern 11AM & 4PM → [Get All Insights, Get Entity Connections] → Analyze Cross Patterns → Discover Hidden Patterns → Format Discovery → Significant Discovery? → [Store Discovery, Update Ontology / Skip Storage] → Merge
```

| 순서 | 노드명 | 타입 | 역할 |
|------|--------|------|------|
| 1 | Pattern 11AM & 4PM | scheduleTrigger | 매일 11:00, 16:00 실행 |
| 2 | Get All Insights | httpRequest | 모든 인사이트 조회 |
| 3 | Get Entity Connections | httpRequest | 엔티티 연결 조회 |
| 4 | Analyze Cross Patterns | code | 교차 패턴 분석 |
| 5 | Discover Hidden Patterns | httpRequest | 숨겨진 패턴 발견 (LLM) |
| 6 | Format Discovery | code | 발견 포맷팅 |
| 7 | Significant Discovery? | if | 유의미한 발견 여부 |
| 8 | Store Discovery | httpRequest | Qdrant에 발견 저장 |
| 9 | Update Ontology | httpRequest | Neo4j 온톨로지 업데이트 (CRM_Pattern) |
| 10 | Skip Storage | code | 저장 건너뛰기 |
| 11 | Merge | merge | 흐름 병합 |

---

### 4.2 Cafe24_CRM_Learning_Loop

| 항목 | 값 |
|------|-----|
| **ID** | dVKynoD9NDc4uvcE |
| **목적** | 사용자 피드백 기반 학습 |
| **트리거** | Webhook: `POST /cafe24-crm/feedback` |
| **노드 수** | 11 |

**노드 흐름**:
```
Feedback Webhook → Feedback Router → [Process Positive / Process Negative / Process Correction] → Store Feedback → Check Fine-tune → Fine-tune Check → [Notify Fine-tune] → Respond Webhook
```

| 순서 | 노드명 | 타입 | 역할 |
|------|--------|------|------|
| 1 | Feedback Webhook | webhook | 피드백 수신 |
| 2 | Feedback Router | switch | 피드백 타입별 분기 |
| 3 | Process Positive | code | 긍정 피드백 처리 |
| 4 | Process Negative | code | 부정 피드백 처리 |
| 5 | Process Correction | code | 수정 피드백 처리 |
| 6 | Store Feedback | httpRequest | Neo4j에 피드백 저장 |
| 7 | Check Fine-tune | code | Fine-tuning 필요성 확인 |
| 8 | Fine-tune Check | if | score_delta > 0.15 확인 |
| 9 | Notify Fine-tune | httpRequest | Fine-tuning 트리거 알림 |
| 10 | HTTP Request | httpRequest | 추가 처리 |
| 11 | Respond Webhook | respondToWebhook | 응답 반환 |

---

### 4.3 Cafe24_CRM_Insight_Publisher

| 항목 | 값 |
|------|-----|
| **ID** | otjfwc4Pvkx1OOJi |
| **목적** | 인사이트 다이제스트 발행 (오전/오후 2회) |
| **트리거** | Schedule: 매일 12:30, 18:30 |
| **노드 수** | 8 |

**노드 흐름**:
```
Digest 12:30PM & 6:30PM → [Get All Insights, Get Ontology Summary] → Compile Daily Digest → Generate Digest → Format Publication → Publish to Slack → Archive Digest
```

| 순서 | 노드명 | 타입 | 역할 |
|------|--------|------|------|
| 1 | Digest 12:30PM & 6:30PM | scheduleTrigger | 매일 12:30, 18:30 실행 |
| 2 | Get All Insights | httpRequest | 모든 인사이트 조회 |
| 3 | Get Ontology Summary | httpRequest | 온톨로지 요약 조회 |
| 4 | Compile Daily Digest | code | 일일 다이제스트 컴파일 |
| 5 | Generate Digest | httpRequest | 다이제스트 생성 (LLM) |
| 6 | Format Publication | code | 발행 포맷팅 |
| 7 | Publish to Slack | httpRequest | Slack에 발행 |
| 8 | Archive Digest | httpRequest | Qdrant에 아카이브 |

---

### 4.4 CRM_Feature_Auto_Improver

| 항목 | 값 |
|------|-----|
| **ID** | 8oyzf15NlKcx4BTs |
| **목적** | CRM 기능 자동 개선 |
| **트리거** | Schedule/Webhook |
| **노드 수** | 5 |

**노드 흐름**:
```
[Schedule Trigger / Webhook] → HTTP Request → Code in JavaScript → Execute a command (SSH)
```

| 순서 | 노드명 | 타입 | 역할 |
|------|--------|------|------|
| 1 | Schedule Trigger | scheduleTrigger | 정기 실행 |
| 2 | Webhook | webhook | 외부 호출 |
| 3 | HTTP Request | httpRequest | API 호출 |
| 4 | Code in JavaScript | code | 개선 로직 |
| 5 | Execute a command | ssh | SSH 명령 실행 |

---

## 5. 인프라 워크플로우

시스템 구축 및 운영을 지원하는 워크플로우들입니다.

### 5.1 Cafe24_CRM_Ontology_Builder

| 항목 | 값 |
|------|-----|
| **ID** | Jt642lsgyUIUXooY |
| **목적** | YAML 정의 기반 Neo4j 온톨로지 구축 |
| **트리거** | Webhook |
| **노드 수** | 6 |

**노드 흐름**:
```
Webhook → Fetch Domain YAML → Parse YAML to Cypher → Execute Cypher → Format Result → Respond to Webhook
```

| 순서 | 노드명 | 타입 | 역할 |
|------|--------|------|------|
| 1 | Webhook | webhook | 요청 수신 |
| 2 | Fetch Domain YAML | httpRequest | domain.yaml 조회 |
| 3 | Parse YAML to Cypher | code | YAML → Cypher 변환 |
| 4 | Execute Cypher | httpRequest | Neo4j 쿼리 실행 |
| 5 | Format Result | code | 결과 포맷팅 |
| 6 | Respond to Webhook | respondToWebhook | 응답 반환 |

---

### 5.2 Cafe24_CRM_OAuth_Start

| 항목 | 값 |
|------|-----|
| **ID** | pjaVXVKXNBF95sdI |
| **목적** | Cafe24 OAuth 인증 시작 |
| **트리거** | Webhook |
| **노드 수** | 3 |

**노드 흐름**:
```
Webhook → Code in JavaScript → Respond to Webhook
```

---

### 5.3 Cafe24_CRM_Shop_Sync

| 항목 | 값 |
|------|-----|
| **ID** | wp2XOTomCHBgZ93y |
| **목적** | 쇼핑몰 데이터 동기화 |
| **트리거** | Schedule |
| **노드 수** | 4 |

**노드 흐름**:
```
Schedule Trigger → Get Active Shops → Process Shop Sync → Notify Sync Complete
```

| 순서 | 노드명 | 타입 | 역할 |
|------|--------|------|------|
| 1 | Schedule Trigger | scheduleTrigger | 정기 실행 |
| 2 | Get Active Shops | code | 활성 쇼핑몰 목록 |
| 3 | Process Shop Sync | code | 동기화 처리 |
| 4 | Notify Sync Complete | slack | Slack 완료 알림 |

---

### 5.4 Cafe24_CRM_User_Onboarding

| 항목 | 값 |
|------|-----|
| **ID** | zNvrnpkFgWRtVmC4 |
| **목적** | 사용자 온보딩 처리 |
| **트리거** | Webhook |
| **노드 수** | 3 |

---

### 5.5 Cafe24_CRM_Subscription

| 항목 | 값 |
|------|-----|
| **ID** | anSEfPH5CGjPB2qp |
| **목적** | 구독 관리 |
| **트리거** | Webhook |
| **노드 수** | 4 |

**노드 흐름**:
```
Webhook → Code in JavaScript → Switch → Respond to Webhook
```

---

### 5.6 Cafe24_CRM_Prototype_Completion

| 항목 | 값 |
|------|-----|
| **ID** | CRM_PROTO_COMP_01 |
| **목적** | 프로토타입 완성 지원 (Jira/Confluence 연동) |
| **트리거** | Schedule (매시간) / Webhook |
| **노드 수** | 12 |

**노드 흐름**:
```
[매시간 실행 / 수동실행Webhook] → Jira태스크조회 → 태스크분석 → 액션분기 → Claude분석 → 응답파싱 → [Confluence문서생성, Jira코멘트추가] → [Slack완료알림 / Slack대기알림] → WebhookResponse
```

| 순서 | 노드명 | 타입 | 역할 |
|------|--------|------|------|
| 1 | 매시간 실행 | scheduleTrigger | 매시간 실행 |
| 2 | 수동실행Webhook | webhook | 수동 트리거 |
| 3 | Jira태스크조회 | httpRequest | Jira 태스크 조회 |
| 4 | 태스크분석 | code | 태스크 분석 |
| 5 | 액션분기 | if | 액션 분기 |
| 6 | Claude분석 | httpRequest | Claude API 호출 |
| 7 | 응답파싱 | code | 응답 파싱 |
| 8 | Confluence문서생성 | httpRequest | Confluence 문서 생성 |
| 9 | Jira코멘트추가 | httpRequest | Jira 코멘트 추가 |
| 10 | Slack완료알림 | httpRequest | 완료 알림 |
| 11 | Slack대기알림 | httpRequest | 대기 알림 |
| 12 | WebhookResponse | respondToWebhook | 응답 반환 |

---

### 5.7 Cafe24_CRM_DB_Setup (비활성)

| 항목 | 값 |
|------|-----|
| **ID** | ebqdt6PoQMIGORBI |
| **목적** | 1회성 DB 설정 |
| **상태** | ❌ Inactive |
| **노드 수** | 0 (빈 워크플로우) |

---

## 외부 서비스 연동

### LiteLLM (LLM Gateway)
- **내부 URL**: `http://litellm:4000/v1/chat/completions`
- **일반 URL**: `http://claude-wrapper:4001/v1/chat/completions`
- **모델**: `claude-3-5-sonnet-20241022`, `cafe24-crm-llama` (Fine-tuned)
- **인증**: `Bearer sk-litellm-master-key`

### Qdrant (Vector DB)
- **내부 URL**: `http://qdrant:6333`
- **컬렉션**:
  - `cafe24_api_docs` (37 points) - API 문서
  - `cafe24_insights` (10+ points) - 수집된 인사이트
  - `cafe24_crm_knowledge` (16+ points) - CRM 지식

### Neo4j (Graph DB)
- **내부 URL**: `http://neo4j:7474/db/neo4j/tx/commit`
- **인증**: `Basic bmVvNGo6b250b2xvZ3kyMDI1`
- **레이블**: `CRM_Entity`, `CRM_Customer`, `CRM_Order`, `CRM_Product`, `CRM_Campaign`, `CRM_Pattern`

### Slack (알림)
- **Webhook**: `$env.SLACK_WEBHOOK`
- **용도**: Morning/Evening/Weekly 리포트, 알림

---

## 문서 동기화 규칙

### 워크플로우 변경 시 업데이트 체크리스트

워크플로우에 변경사항이 발생하면 다음 문서들을 함께 업데이트해야 합니다:

1. **이 문서 (N8N_WORKFLOWS_DETAIL.md)**
   - [ ] 해당 워크플로우 섹션 업데이트
   - [ ] 노드 흐름 다이어그램 수정
   - [ ] 노드 테이블 수정
   - [ ] 변경 이력 추가

2. **CLAUDE.md (cafe24-crm-prototype 섹션)**
   - [ ] 워크플로우 요약 테이블 업데이트
   - [ ] 트리거/스케줄 정보 수정

3. **SYSTEM_STATUS.md**
   - [ ] n8n 워크플로우 상태 업데이트
   - [ ] 변경 이력 추가

### 변경 유형별 업데이트 범위

| 변경 유형 | N8N_WORKFLOWS_DETAIL.md | CLAUDE.md | SYSTEM_STATUS.md |
|-----------|-------------------------|-----------|------------------|
| 새 워크플로우 추가 | 전체 섹션 추가 | 테이블 행 추가 | 워크플로우 수 업데이트 |
| 워크플로우 삭제 | 섹션 삭제 | 테이블 행 삭제 | 워크플로우 수 업데이트 |
| 노드 추가/삭제 | 노드 테이블 수정 | - | - |
| 트리거 변경 | 트리거 정보 수정 | 트리거 컬럼 수정 | - |
| 활성화 상태 변경 | 상태 표시 수정 | 상태 컬럼 수정 | 활성/비활성 수 업데이트 |

### 자동 동기화 스크립트 (권장)

```bash
# n8n API로 워크플로우 목록 조회 후 문서 검증
curl -s "http://localhost:5678/api/v1/workflows" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" | \
  jq '[.data[] | select(.name | startswith("Cafe24") or startswith("CRM_"))]'
```

---

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2025-01-07 | 초기 문서 작성, 22개 워크플로우 상세 분석 |
| 2025-01-07 | **오전/오후 사이클로 스케줄 변경** - 주간 사이클에서 빠른 반복 사이클로 전환 |

### 2025-01-07 스케줄 변경 상세

**변경 목적**: 주간(weekly) 사이클에서 오전/오후(morning/afternoon) 빠른 반복 사이클로 전환

| 워크플로우 | 이전 스케줄 | 새 스케줄 | 변경 이유 |
|------------|-------------|-----------|-----------|
| Morning_Research | 09:00 (1회) | 09:00, 14:00 (2회) | 오전/오후 리서치 |
| Evening_Analysis | 21:00 (1회) | 12:00, 18:00 (2회) | 점심/저녁 종합분석 |
| Weekly_Retrospective | 일요일 10:00 | 매일 17:00 | 주간→일일 회고 |
| Code_Analyzer | 4시간마다 | 10:00, 15:00 | 오전/오후 코드분석 |
| Ontology_Health | 6시간마다 | 10:30, 14:30, 17:30 | 하루 3회 건강체크 |
| Cross_Pattern | 8시간마다 | 11:00, 16:00 | 오전/오후 패턴발견 |
| Insight_Publisher | 18:00 (1회) | 12:30, 18:30 (2회) | 점심/저녁 다이제스트 |

**예상 효과**:
- 인사이트 발굴 속도 2-3배 향상
- 피드백 루프 단축 (24시간 → 6-8시간)
- 더 빠른 온톨로지 진화
- 실시간에 가까운 패턴 발견
