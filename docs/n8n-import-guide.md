# Cafe24 CRM Prototype - n8n 워크플로우 임포트 가이드

## 개요

이 문서는 Cafe24 CRM Prototype의 n8n 워크플로우를 안전하게 임포트하는 방법을 설명합니다.

> **중요**: 모든 워크플로우는 `Cafe24_CRM_*` 네이밍 규칙을 따릅니다.
> 기존 뉴스레터/Datarize 워크플로우와 충돌하지 않습니다.

---

## 1. 사전 요구사항

### 1.1 환경변수 설정

n8n Settings → Variables에서 다음 환경변수를 설정해야 합니다:

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `CF_ACCESS_CLIENT_ID` | Cloudflare Access Service Token ID | `33fc2fac...access` |
| `CF_ACCESS_CLIENT_SECRET` | Cloudflare Access Service Token Secret | `7251ba3d...` |
| `NEO4J_USER` | Neo4j 사용자명 | `neo4j` |
| `NEO4J_PASSWORD` | Neo4j 비밀번호 | `your_password` |
| `LITELLM_API_KEY` | LiteLLM Master Key | `sk-litellm-master-key` |
| `SLACK_WEBHOOK` | Slack Incoming Webhook URL | `https://hooks.slack.com/...` |

### 1.2 필요 서비스

- Neo4j (neo4j.saemiro.com) - CRM 온톨로지 저장
- Qdrant (qdrant.saemiro.com) - 벡터 인사이트 저장
- LiteLLM (llm.saemiro.com 또는 litellm:4000) - LLM API 프록시

---

## 2. 워크플로우 목록

### Layer 1: Core Intelligence (핵심 기능)
| 파일 | 워크플로우명 | 트리거 | 설명 |
|------|-------------|--------|------|
| 02_ontology_builder.json | Cafe24_CRM_Ontology_Builder | Webhook | 도메인 YAML → Neo4j 온톨로지 |
| 03_code_generator.json | Cafe24_CRM_Code_Generator | Webhook | 온톨로지+RAG 코드 생성 |
| 07_dashboard_api.json | Cafe24_CRM_Dashboard_API | Webhook | 대시보드 백엔드 API |

### Layer 2: A/B/C Comparison (비교 시스템)
| 파일 | 워크플로우명 | 트리거 | 설명 |
|------|-------------|--------|------|
| 04_baseline.json | Cafe24_CRM_Baseline | Webhook | 순수 LLM (A) |
| 05_rag_only.json | Cafe24_CRM_RAG_Only | Webhook | RAG만 사용 (B) |
| 03_code_generator.json | Cafe24_CRM_Code_Generator | Webhook | 온톨로지+RAG (C) |

### Layer 3: Auto Discovery (자동 발견)
| 파일 | 워크플로우명 | 스케줄 | 설명 |
|------|-------------|--------|------|
| 08_morning_research.json | Cafe24_CRM_Morning_Research | 매일 09:00 | 아침 시장 조사 |
| 09_evening_analysis.json | Cafe24_CRM_Evening_Analysis | 매일 21:00 | 저녁 일일 분석 |
| 10_weekly_retrospective.json | Cafe24_CRM_Weekly_Retrospective | 일요일 10:00 | 주간 회고 |

### Layer 4: Emergent Intelligence (창발적 지능)
| 파일 | 워크플로우명 | 스케줄 | 설명 |
|------|-------------|--------|------|
| 11_code_analyzer.json | Cafe24_CRM_Code_Analyzer | 4시간마다 | 코드 패턴 분석 |
| 12_ontology_health.json | Cafe24_CRM_Ontology_Health | 6시간마다 | 온톨로지 건강 체크 |
| 13_cross_pattern.json | Cafe24_CRM_Cross_Pattern | 8시간마다 | 크로스 패턴 발견 |
| 14_learning_loop.json | Cafe24_CRM_Learning_Loop | Webhook | 피드백 학습 루프 |
| 15_insight_publisher.json | Cafe24_CRM_Insight_Publisher | 매일 18:00 | 일일 인사이트 발행 |

---

## 3. 임포트 순서

### 3.1 권장 순서 (의존성 고려)

```
1단계 (기초):
  - 02_ontology_builder.json  ← 온톨로지 구축
  - 04_baseline.json          ← A 비교용

2단계 (RAG 연동):
  - 05_rag_only.json          ← B 비교용
  - 03_code_generator.json    ← C (메인 기능)

3단계 (자동화):
  - 08_morning_research.json
  - 09_evening_analysis.json
  - 10_weekly_retrospective.json

4단계 (고급 기능):
  - 11_code_analyzer.json
  - 12_ontology_health.json
  - 13_cross_pattern.json
  - 14_learning_loop.json
  - 15_insight_publisher.json

5단계 (API):
  - 07_dashboard_api.json     ← 대시보드 연동
```

### 3.2 임포트 방법

1. n8n 접속: https://n8n.saemiro.com
2. 좌측 메뉴 → Workflows
3. 우상단 "..." → Import from File
4. JSON 파일 선택 → Import
5. 워크플로우 활성화 (Active 토글)

---

## 4. 임포트 후 확인사항

### 4.1 Webhook 워크플로우

활성화 후 Production URL 확인:
```
https://n8n.saemiro.com/webhook/cafe24-crm/ontology/build
https://n8n.saemiro.com/webhook/cafe24-crm/code/generate
https://n8n.saemiro.com/webhook/cafe24-crm/baseline
https://n8n.saemiro.com/webhook/cafe24-crm/rag-only
https://n8n.saemiro.com/webhook/cafe24-crm/feedback
https://n8n.saemiro.com/webhook/cafe24-crm/api/*
```

### 4.2 스케줄 워크플로우

활성화 시 자동으로 스케줄 등록됨:
- Morning Research: 09:00 KST
- Evening Analysis: 21:00 KST
- Weekly Retrospective: 일요일 10:00 KST
- Code Analyzer: 매 4시간
- Ontology Health: 매 6시간
- Cross Pattern: 매 8시간
- Insight Publisher: 18:00 KST

### 4.3 테스트 실행

```bash
# Baseline 테스트
curl -X POST https://n8n.saemiro.com/webhook/cafe24-crm/baseline \
  -H "Content-Type: application/json" \
  -d '{"prompt": "고객 등급 조회 API 작성해줘"}'

# RAG Only 테스트
curl -X POST https://n8n.saemiro.com/webhook/cafe24-crm/rag-only \
  -H "Content-Type: application/json" \
  -d '{"prompt": "고객 등급 조회 API 작성해줘"}'

# Full (Ontology + RAG) 테스트
curl -X POST https://n8n.saemiro.com/webhook/cafe24-crm/code/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "고객 등급 조회 API 작성해줘"}'
```

---

## 5. 트러블슈팅

### 5.1 Cloudflare Access 오류

```
Error: 403 Forbidden
```

해결: CF_ACCESS_CLIENT_ID, CF_ACCESS_CLIENT_SECRET 환경변수 확인

### 5.2 Neo4j 연결 실패

```
Error: Failed to connect to Neo4j
```

해결:
1. NEO4J_USER, NEO4J_PASSWORD 확인
2. neo4j.saemiro.com 접근 가능 여부 확인

### 5.3 LiteLLM 오류

```
Error: Invalid API Key
```

해결: LITELLM_API_KEY = `sk-litellm-master-key` 확인

### 5.4 Slack 알림 실패

해결: SLACK_WEBHOOK URL 형식 확인
- 형식: `https://hooks.slack.com/services/T.../B.../...`

---

## 6. 태그 구조

모든 워크플로우에는 다음 태그가 적용됨:

- `Cafe24_CRM_Prototype` - 프로젝트 식별
- `Auto_Discovery` - 자동 발견 레이어
- `Emergent_Intelligence` - 창발적 지능 레이어

---

## 7. 주의사항

### 7.1 기존 워크플로우와 충돌 방지

- ❌ 뉴스레터 워크플로우 수정 금지
- ❌ Datarize 분석 워크플로우 수정 금지
- ✅ `Cafe24_CRM_*` 네이밍만 사용

### 7.2 네이밍 규칙

| 구분 | 접두사 | 예시 |
|------|--------|------|
| n8n 워크플로우 | `Cafe24_CRM_` | `Cafe24_CRM_Code_Generator` |
| Neo4j 라벨 | `CRM_` | `CRM_Entity`, `CRM_Feedback` |
| Qdrant 컬렉션 | `cafe24_` | `cafe24_insights`, `cafe24_docs` |
| Webhook 경로 | `cafe24-crm/` | `/webhook/cafe24-crm/...` |

---

## 8. 버전 정보

- 문서 버전: 1.0
- 생성일: 2024-12-30
- 워크플로우 수: 13개
- 필요 n8n 버전: 1.0+

---

*이 문서는 Cafe24 CRM Prototype 프로젝트의 일부입니다.*
