#!/usr/bin/env python3
"""
Cafe24 CRM Prototype - A/B/C Experiment Framework
Compares three approaches for CRM API assistance:
  A: Ontology + RAG (Qdrant vector search + Neo4j knowledge graph)
  B: Fine-tuned LLM (Together AI cafe24-crm-llama)
  C: Vanilla LLM (Claude via claude-wrapper)
"""

import os
import json
import time
import asyncio
import aiohttp
from datetime import datetime
from dataclasses import dataclass, asdict
from typing import Optional
from pathlib import Path

# Configuration
LITELLM_URL = "https://llm.saemiro.com/v1/chat/completions"
QDRANT_URL = "https://qdrant.saemiro.com"
CF_ACCESS_ID = os.getenv("CF_ACCESS_CLIENT_ID", "33fc2fac58bf5237d16ac159db51b46b.access")
CF_ACCESS_SECRET = os.getenv("CF_ACCESS_CLIENT_SECRET", "7251ba3d0093523b81898e1df292ba8531b48db96d981224c8612fb1f3c1183c")
LITELLM_KEY = os.getenv("LITELLM_API_KEY", "sk-litellm-master-key")

# Test prompts for evaluation
TEST_PROMPTS = [
    {
        "id": "customer_lookup",
        "prompt": "Cafe24 고객 조회 API를 사용해서 특정 고객의 정보를 가져오는 방법을 알려줘.",
        "expected_elements": ["customers", "GET", "member_id", "API endpoint"]
    },
    {
        "id": "order_status",
        "prompt": "주문 상태를 변경하는 API 호출 코드를 Python으로 작성해줘.",
        "expected_elements": ["orders", "PUT", "order_id", "status", "requests"]
    },
    {
        "id": "product_inventory",
        "prompt": "상품 재고를 업데이트하는 API 사용법을 설명해줘.",
        "expected_elements": ["products", "variants", "stock", "quantity"]
    },
    {
        "id": "customer_segment",
        "prompt": "VIP 고객 세그먼트를 생성하는 방법을 알려줘.",
        "expected_elements": ["segment", "criteria", "customers", "filter"]
    },
    {
        "id": "campaign_create",
        "prompt": "이메일 캠페인을 생성하고 발송하는 API 흐름을 설명해줘.",
        "expected_elements": ["campaign", "email", "recipients", "template"]
    }
]

@dataclass
class ExperimentResult:
    """Single experiment result"""
    approach: str  # A, B, or C
    prompt_id: str
    prompt: str
    response: str
    latency_ms: float
    token_count: int
    relevance_score: float
    accuracy_score: float
    timestamp: str
    error: Optional[str] = None

class ABCExperiment:
    def __init__(self):
        self.results: list[ExperimentResult] = []
        self.session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        headers = {
            "CF-Access-Client-Id": CF_ACCESS_ID,
            "CF-Access-Client-Secret": CF_ACCESS_SECRET,
            "Authorization": f"Bearer {LITELLM_KEY}",
            "Content-Type": "application/json"
        }
        self.session = aiohttp.ClientSession(headers=headers)
        return self

    async def __aexit__(self, *args):
        if self.session:
            await self.session.close()

    async def call_llm(self, model: str, messages: list, max_tokens: int = 1000) -> tuple[str, float, int]:
        """Call LiteLLM with specified model"""
        start = time.time()

        payload = {
            "model": model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": 0.7
        }

        async with self.session.post(LITELLM_URL, json=payload) as resp:
            latency = (time.time() - start) * 1000
            data = await resp.json()

            if resp.status != 200:
                raise Exception(f"API error: {data}")

            content = data["choices"][0]["message"]["content"]
            tokens = data.get("usage", {}).get("total_tokens", 0)

            return content, latency, tokens

    async def get_rag_context(self, query: str, collection: str = "cafe24_api_docs") -> str:
        """Retrieve context from Qdrant"""
        # Simplified - in production, use embedding model
        search_payload = {
            "query": query,
            "limit": 3,
            "with_payload": True
        }

        # Note: Qdrant search would require embedding the query first
        # For now, return placeholder context
        return "[RAG Context: Cafe24 API documentation context would be retrieved here]"

    async def approach_a_ontology_rag(self, prompt: str) -> tuple[str, float, int]:
        """Approach A: Ontology + RAG"""
        # Get RAG context
        rag_context = await self.get_rag_context(prompt)

        messages = [
            {
                "role": "system",
                "content": f"""당신은 Cafe24 CRM API 전문가입니다.
다음 컨텍스트를 참고하여 답변하세요:

{rag_context}

CRM 온톨로지:
- Customer: 고객 정보 (PLACES → Order, HAS_ADDRESS → Address)
- Order: 주문 정보 (CONTAINS → OrderItem, PAID_BY → Payment)
- Product: 상품 정보 (BELONGS_TO → Category)
- Campaign: 마케팅 캠페인 (TARGETS → CustomerSegment)"""
            },
            {"role": "user", "content": prompt}
        ]

        return await self.call_llm("claude-wrapper", messages)

    async def approach_b_finetuned(self, prompt: str) -> tuple[str, float, int]:
        """Approach B: Fine-tuned model"""
        messages = [
            {
                "role": "system",
                "content": "당신은 Cafe24 CRM API 전문가입니다."
            },
            {"role": "user", "content": prompt}
        ]

        return await self.call_llm("cafe24-crm-llama", messages)

    async def approach_c_vanilla(self, prompt: str) -> tuple[str, float, int]:
        """Approach C: Vanilla LLM"""
        messages = [
            {
                "role": "system",
                "content": "당신은 도움이 되는 AI 어시스턴트입니다."
            },
            {"role": "user", "content": prompt}
        ]

        return await self.call_llm("claude-wrapper", messages)

    def score_response(self, response: str, expected_elements: list) -> tuple[float, float]:
        """Score response for relevance and accuracy"""
        response_lower = response.lower()

        # Relevance: How many expected elements are mentioned
        found = sum(1 for elem in expected_elements if elem.lower() in response_lower)
        relevance = found / len(expected_elements) if expected_elements else 0

        # Accuracy: Simple heuristic (presence of code, API patterns)
        accuracy_signals = [
            "http" in response_lower,
            "api" in response_lower,
            "```" in response,  # Code block
            "def " in response or "function" in response_lower,
        ]
        accuracy = sum(accuracy_signals) / len(accuracy_signals)

        return relevance, accuracy

    async def run_single_test(self, test_case: dict, approach: str) -> ExperimentResult:
        """Run single test for one approach"""
        prompt_id = test_case["id"]
        prompt = test_case["prompt"]
        expected = test_case["expected_elements"]

        approaches = {
            "A": self.approach_a_ontology_rag,
            "B": self.approach_b_finetuned,
            "C": self.approach_c_vanilla
        }

        try:
            response, latency, tokens = await approaches[approach](prompt)
            relevance, accuracy = self.score_response(response, expected)
            error = None
        except Exception as e:
            response = ""
            latency = 0
            tokens = 0
            relevance = 0
            accuracy = 0
            error = str(e)

        return ExperimentResult(
            approach=approach,
            prompt_id=prompt_id,
            prompt=prompt,
            response=response,
            latency_ms=latency,
            token_count=tokens,
            relevance_score=relevance,
            accuracy_score=accuracy,
            timestamp=datetime.now().isoformat(),
            error=error
        )

    async def run_all_tests(self):
        """Run all tests for all approaches"""
        for test_case in TEST_PROMPTS:
            for approach in ["A", "B", "C"]:
                print(f"Running {approach} for {test_case['id']}...")
                result = await self.run_single_test(test_case, approach)
                self.results.append(result)
                await asyncio.sleep(1)  # Rate limiting

    def generate_report(self) -> dict:
        """Generate comparison report"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "total_tests": len(self.results),
            "approaches": {}
        }

        for approach in ["A", "B", "C"]:
            approach_results = [r for r in self.results if r.approach == approach]

            if approach_results:
                avg_latency = sum(r.latency_ms for r in approach_results) / len(approach_results)
                avg_relevance = sum(r.relevance_score for r in approach_results) / len(approach_results)
                avg_accuracy = sum(r.accuracy_score for r in approach_results) / len(approach_results)
                error_count = sum(1 for r in approach_results if r.error)

                report["approaches"][approach] = {
                    "name": {
                        "A": "Ontology + RAG",
                        "B": "Fine-tuned LLM",
                        "C": "Vanilla LLM"
                    }[approach],
                    "avg_latency_ms": round(avg_latency, 2),
                    "avg_relevance_score": round(avg_relevance, 3),
                    "avg_accuracy_score": round(avg_accuracy, 3),
                    "error_count": error_count,
                    "test_count": len(approach_results)
                }

        # Determine winner
        scores = {
            k: v["avg_relevance_score"] * 0.6 + v["avg_accuracy_score"] * 0.4
            for k, v in report["approaches"].items()
        }
        report["winner"] = max(scores, key=scores.get) if scores else None

        return report

    def save_results(self, output_dir: str = "/Users/admin/cafe24-crm-prototype/experiments"):
        """Save results to files"""
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        # Save detailed results
        results_file = Path(output_dir) / f"results_{timestamp}.json"
        with open(results_file, "w", encoding="utf-8") as f:
            json.dump([asdict(r) for r in self.results], f, ensure_ascii=False, indent=2)

        # Save report
        report = self.generate_report()
        report_file = Path(output_dir) / f"report_{timestamp}.json"
        with open(report_file, "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)

        print(f"Results saved to {results_file}")
        print(f"Report saved to {report_file}")

        return report


async def main():
    """Run A/B/C experiment"""
    print("=" * 60)
    print("Cafe24 CRM Prototype - A/B/C Experiment")
    print("=" * 60)

    async with ABCExperiment() as experiment:
        await experiment.run_all_tests()
        report = experiment.save_results()

    print("\n" + "=" * 60)
    print("EXPERIMENT RESULTS")
    print("=" * 60)

    for approach, data in report["approaches"].items():
        print(f"\n{approach}: {data['name']}")
        print(f"  Latency: {data['avg_latency_ms']}ms")
        print(f"  Relevance: {data['avg_relevance_score']:.1%}")
        print(f"  Accuracy: {data['avg_accuracy_score']:.1%}")
        print(f"  Errors: {data['error_count']}")

    print(f"\nWinner: {report['winner']} ({report['approaches'][report['winner']]['name']})")


if __name__ == "__main__":
    asyncio.run(main())
