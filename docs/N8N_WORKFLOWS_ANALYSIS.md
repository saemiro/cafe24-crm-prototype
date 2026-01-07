# Cafe24 CRM n8n 워크플로우 분석

> 분석일: 2025-01-07
> 총 워크플로우: 13개

## 개요

Cafe24 CRM 프로토타입은 4가지 카테고리의 자동화 워크플로우로 구성됩니다:

| 카테고리 | 워크플로우 수 | 설명 |
|----------|--------------|------|
| AB 테스트 | 3개 | 성능 비교 (Baseline/RAG/Ontology) |
| 대시보드 API | 1개 | 통합 관리 인터페이스 |
| 자동 발견 | 5개 | 정기 시장 분석 및 보고 |
| 지능형 워크플로우 | 4개 | 패턴 발견 및 학습 |

---

## 1. AB 테스트 워크플로우

### 1.1 Cafe24_CRM_A_Baseline (`04_baseline.json`)

| 항목 | 값 |
|------|-----|
| 트리거 | Webhook: `POST /cafe24-crm/baseline` |
| 목적 | LLM 기본 성능 측정 (컨텍스트 없음) |
| 외부 서비스 | LiteLLM |
| 상태 | 활성화 가능 |

### 1.2 Cafe24_CRM_B_RAG_Only (`05_rag_only.json`)

| 항목 | 값 |
|------|-----|
| 트리거 | Webhook: `POST /cafe24-crm/rag` |
| 목적 | RAG 성능 측정 |
| 외부 서비스 | LiteLLM, Qdrant (`cafe24_api_docs`) |
| 상태 | 활성화 가능 |

### 1.3 Cafe24_CRM_Code_Generator (`03_code_generator.json`)

| 항목 | 값 |
|------|-----|
| 트리거 | Webhook: `POST /cafe24-crm/generate` |
| 목적 | 최적 접근법: 온톨로지 + RAG |
| 외부 서비스 | LiteLLM, Qdrant, Neo4j |
| 상태 | 활성화 가능 |

---

## 2. 대시보드 API (`07_dashboard_api.json`)

| 엔드포인트 | 메서드 | 기능 |
|-----------|--------|------|
| `/cafe24-crm/dashboard` | GET | 온톨로지 + Qdrant 통계 |
| `/cafe24-crm/compare` | POST | 3가지 방식 비교 |
| `/cafe24-crm/insights` | GET | 저장된 인사이트 조회 |

---

## 3. 자동 발견 워크플로우 (정기 스케줄)

### 3.1 Morning Research (`08_morning_research.json`)

| 항목 | 값 |
|------|-----|
| 스케줄 | 매일 09:00 |
| 분석 주제 | Shopify, WooCommerce, E-commerce CRM AI, Cafe24 API, LLM RAG |
| 출력 | Slack 알림 + Qdrant 저장 |

### 3.2 Evening Analysis (`09_evening_analysis.json`)

| 항목 | 값 |
|------|-----|
| 스케줄 | 매일 21:00 |
| 입력 | 아침 조사 + 일일 피드백 |
| 출력 | Slack 알림 |

### 3.3 Weekly Retrospective (`10_weekly_retrospective.json`)

| 항목 | 값 |
|------|-----|
| 스케줄 | 매주 일요일 10:00 |
| 분석 | 주간 피드백 + 온톨로지 + 인사이트 종합 |
| 출력 | Slack 보고서 |

### 3.4 Code Analyzer (`11_code_analyzer.json`)

| 항목 | 값 |
|------|-----|
| 스케줄 | 4시간마다 |
| 분석 | 코드 패턴 발견 및 재사용성 |
| 조건 | 새 패턴 발견 시에만 저장 |

### 3.5 Ontology Health (`12_ontology_health.json`)

| 항목 | 값 |
|------|-----|
| 스케줄 | 6시간마다 |
| 분석 | 온톨로지 건강도 (고아 노드, 관계 수) |
| 알림 | 비정상(warning/critical) 시 Slack |

---

## 4. 지능형 워크플로우

### 4.1 Cross Pattern (`13_cross_pattern.json`)

| 항목 | 값 |
|------|-----|
| 스케줄 | 8시간마다 |
| 목적 | 도메인 간 숨겨진 연결 발견 |
| 저장 | Qdrant + Neo4j (CRM_Pattern) |

### 4.2 Learning Loop (`14_learning_loop.json`)

| 항목 | 값 |
|------|-----|
| 트리거 | Webhook: `POST /cafe24-crm/feedback` |
| 목적 | 사용자 피드백 기반 학습 |
| 조건 | score_delta > 0.15 시 미세조정 트리거 |

### 4.3 Insight Publisher (`15_insight_publisher.json`)

| 항목 | 값 |
|------|-----|
| 스케줄 | 매일 18:00 |
| 목적 | 일일 인사이트 다이제스트 발행 |
| 출력 | Slack 블록 + Qdrant 아카이브 |

---

## 5. 외부 서비스 연동

### 5.1 LiteLLM
- URL: `http://litellm:4000/v1/`
- 모델: `claude-3-5-sonnet-20241022`
- 용도: 생성, 분석, 학습

### 5.2 Qdrant
- URL: `https://qdrant.saemiro.com`
- 컬렉션:
  - `cafe24_api_docs` (12 chunks)
  - `cafe24_insights` (분석 결과)
- 인증: CF-Access 헤더

### 5.3 Neo4j
- URL: `https://neo4j.saemiro.com`
- 인증: `neo4j:ontology2025`
- 라벨: `CRM_Entity`, `CRM_Customer`, `CRM_Order`, `CRM_Feedback`, `CRM_Pattern`

### 5.4 Slack
- 웹훅: `$env.SLACK_WEBHOOK`
- 알림: Morning/Evening/Weekly/Health/Digest

---

## 6. 활성화 상태

### Webhook (수동) - 즉시 사용 가능
- [x] Ontology Builder
- [x] Baseline
- [x] RAG Only
- [x] Code Generator
- [x] Dashboard API
- [x] Learning Loop

### Schedule (자동) - n8n UI 활성화 필요
- [ ] Morning Research (09:00)
- [ ] Evening Analysis (21:00)
- [ ] Weekly Retrospective (일요일 10:00)
- [ ] Code Analyzer (4시간마다)
- [ ] Ontology Health (6시간마다)
- [ ] Cross Pattern (8시간마다)
- [ ] Insight Publisher (18:00)

---

## 7. 데이터 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                      데이터 입력 레이어                          │
├─────────────────────────────────────────────────────────────────┤
│  사용자 요청 (Webhook)    │    스케줄 트리거 (Cron)             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      컨텍스트 수집 레이어                        │
├─────────────────────────────────────────────────────────────────┤
│  Qdrant 검색              │    Neo4j 온톨로지                   │
│  (RAG 문서)               │    (엔티티 관계)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LLM 처리 레이어                             │
├─────────────────────────────────────────────────────────────────┤
│  생성 (Code Generator)    │    분석 (Morning/Evening)           │
│  패턴 발견 (Cross Pattern)│    요약 (Insight Publisher)         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      저장/알림 레이어                            │
├─────────────────────────────────────────────────────────────────┤
│  Qdrant 저장              │    Neo4j 저장                       │
│  (인사이트)               │    (피드백, 패턴)                   │
│                           │    Slack 알림                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. 운영 권장사항

### 즉시 활성화
1. Dashboard API - 대시보드 기능 제공
2. Code Generator - 최적 방식 테스트

### 점진적 활성화
1. Morning Research + Evening Analysis (일일 루프)
2. Ontology Health (모니터링)
3. Weekly Retrospective (주간 검토)
4. Insight Publisher (일일 다이제스트)
5. Cross Pattern + Learning Loop (고급 학습)

### 사전 검증 필요
- [ ] Slack 웹훅 연결 확인
- [ ] Neo4j 인증 정보 검증
- [ ] Qdrant 컬렉션 상태 확인
- [ ] LiteLLM 모델 availability 확인

---

## 9. 알려진 이슈

1. **벡터 ID 충돌** - Code Analyzer에서 `Math.random()` 사용
2. **에러 처리 부재** - 재시도 로직 없음
3. **미세조정 미구현** - Learning Loop 트리거만 있음
4. **롤백 메커니즘 없음** - 피드백 반영 후 복구 불가

---

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2025-01-07 | 초기 분석 문서 작성 |
