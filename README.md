# Cafe24 CRM Dashboard Prototype

> **PROTOTYPE DISCLAIMER**
> This project is a **demonstration prototype** for AI technology showcase purposes.
> NOT intended for production use. 2-week development timeline.

## Project Overview

AI-powered CRM dashboard prototype demonstrating:
- **Ontology-based approach** vs Fine-tuning comparison
- **RAG (Retrieval Augmented Generation)** for domain knowledge
- **Emergent Intelligence** through automated learning cycles

## Project Structure

```
cafe24-crm-prototype/
├── docs/                 # API documentation, ontology definitions
├── n8n-workflows/        # Workflow JSON exports
├── scripts/              # Utility scripts
├── backend/              # Spring Boot API (Phase 3)
├── frontend/             # React dashboard (Phase 3)
├── data/                 # Collected data, embeddings
└── experiments/          # Fine-tuning experiments, A/B/C tests
```

## Infrastructure (Shared with Light CRM)

| Service | URL | Purpose |
|---------|-----|---------|
| n8n | https://n8n.saemiro.com | Workflow automation |
| Qdrant | https://qdrant.saemiro.com | Vector embeddings |
| Neo4j | https://neo4j.saemiro.com | Ontology graph |
| LiteLLM | https://llm.saemiro.com | LLM gateway |

## Logical Separation from Light CRM

| Component | Light CRM | Cafe24 CRM Prototype |
|-----------|-----------|---------------------|
| Qdrant Collections | `datarize_code` | `cafe24_api_docs`, `cafe24_crm_knowledge` |
| Neo4j Labels | Module, Class, Function | CRM_Entity, CRM_Workflow, CRM_Integration |
| n8n Workflows | 데이터라이즈*, Newsletter* | CRM-Prototype-* |

## Development Phases

- [x] Phase 0: Environment setup & infrastructure testing
- [ ] Phase 1: Domain knowledge collection (Cafe24 API docs → Qdrant)
- [ ] Phase 2: Ontology construction (domain.yaml → Neo4j)
- [ ] Phase 2.5: Fine-tuning experiment (Together AI Llama)
- [ ] Phase 3: Prototype implementation (Spring Boot + React)
- [ ] Phase 4: Presentation materials

## Key Demonstrations

### 1. Ontology vs Fine-tuning Comparison (A/B/C Test)
- **A**: Ontology + RAG approach (expected winner)
- **B**: Fine-tuned model (intentional baseline)
- **C**: Vanilla GPT (control group)

### 2. Automatic Needs Discovery Cycle
- **Morning**: Market research, competitor analysis → insights
- **Evening**: Trend synthesis, knowledge base update

### 3. Emergent Intelligence
- Self-improving through reflection and meta-learning
- Pattern recognition across conversations

## API Keys Required

```env
# Together AI (Fine-tuning experiments)
TOGETHER_API_KEY=

# Cafe24 API
CAFE24_CLIENT_ID=
CAFE24_CLIENT_SECRET=
CAFE24_MALL_ID=

# Slack Webhook (Notifications)
SLACK_WEBHOOK_URL=
```

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/saemiro/cafe24-crm-prototype.git

# 2. Configure environment
cp .env.example .env
# Edit .env with your API keys

# 3. Run infrastructure tests
./scripts/test-connections.sh
```

---

**Timeline**: 2 weeks
**Goal**: Demo-ready prototype for AI capability presentation
**Created**: 2025-12-30
