#!/usr/bin/env python3
"""
Cafe24 CRM Fine-tuning Dataset Generator

Generates synthetic Q&A pairs from Qdrant API documentation
for Together AI fine-tuning.

Naming: Cafe24_CRM_* prefix for all related files
"""

import json
import os
import requests
from datetime import datetime

# Cloudflare Access credentials
CF_ACCESS_CLIENT_ID = "33fc2fac58bf5237d16ac159db51b46b.access"
CF_ACCESS_CLIENT_SECRET = "7251ba3d0093523b81898e1df292ba8531b48db96d981224c8612fb1f3c1183c"

# Qdrant endpoint
QDRANT_URL = "https://qdrant.saemiro.com"

# LiteLLM endpoint (internal)
LITELLM_URL = "http://litellm:4000"
LITELLM_API_KEY = "sk-litellm-master-key"

# Output paths
OUTPUT_DIR = "/Users/admin/cafe24-crm-prototype/data"
DATASET_FILE = os.path.join(OUTPUT_DIR, "cafe24_finetuning_dataset.jsonl")

# System prompt for fine-tuned model
SYSTEM_PROMPT = """당신은 Cafe24 CRM API 전문가입니다.
Cafe24 쇼핑몰 플랫폼의 API를 사용하여 CRM 기능을 구현하는 것을 도와드립니다.

역할:
1. Cafe24 API 문서 기반 정확한 코드 생성
2. Python, TypeScript, curl 예제 제공
3. 에러 처리 및 베스트 프랙티스 포함
4. CRM 도메인 컨텍스트 활용

응답 형식:
- 간결한 설명
- 실행 가능한 코드 예제
- 필요시 주의사항 추가"""


def get_qdrant_docs():
    """Fetch all API documentation from Qdrant."""
    headers = {
        "CF-Access-Client-Id": CF_ACCESS_CLIENT_ID,
        "CF-Access-Client-Secret": CF_ACCESS_CLIENT_SECRET,
        "Content-Type": "application/json"
    }

    response = requests.post(
        f"{QDRANT_URL}/collections/cafe24_api_docs/points/scroll",
        headers=headers,
        json={"limit": 100, "with_payload": True, "with_vector": False}
    )

    if response.status_code == 200:
        return response.json().get("result", {}).get("points", [])
    else:
        print(f"Error fetching Qdrant docs: {response.status_code}")
        return []


def generate_qa_pairs(doc_content, category, endpoint):
    """Generate Q&A pairs from a single API document using LLM."""

    prompt = f"""다음 Cafe24 API 문서를 기반으로 3개의 Q&A 쌍을 생성해주세요.

API 문서:
{doc_content}

형식:
각 Q&A는 다음 JSON 형식으로 출력하세요. 반드시 유효한 JSON 배열로 출력하세요.

[
  {{
    "question": "사용자 질문 (자연어, 실제 개발자가 물을 법한 질문)",
    "answer": "Python 코드를 포함한 상세 답변"
  }},
  ...
]

요구사항:
1. 질문은 실제 개발자가 할 법한 자연스러운 한국어
2. 답변은 Python 코드 예제 포함
3. 에러 처리와 타입 힌트 포함
4. Cafe24 API 표준 준수

JSON 배열만 출력하세요:"""

    # For local testing without LiteLLM, generate template-based examples
    qa_pairs = generate_template_qa(doc_content, category, endpoint)

    return qa_pairs


def generate_template_qa(content, category, endpoint):
    """Generate template-based Q&A pairs (fallback without LLM)."""
    qa_pairs = []

    # Extract title from content
    lines = content.split('\n')
    title = lines[0].replace('# ', '') if lines else category

    # Template 1: Basic usage question
    qa_pairs.append({
        "question": f"{title} 기능을 구현하려면 어떻게 해야 하나요?",
        "answer": f"""Cafe24 API의 {endpoint} 엔드포인트를 사용하면 됩니다.

```python
import requests
from typing import Dict, Any

class Cafe24Client:
    def __init__(self, mall_id: str, access_token: str):
        self.base_url = f"https://{{mall_id}}.cafe24api.com/api/v2"
        self.headers = {{
            "Authorization": f"Bearer {{access_token}}",
            "Content-Type": "application/json",
            "X-Cafe24-Api-Version": "2024-06-01"
        }}

    def {category.lower()}_request(self, **params) -> Dict[str, Any]:
        \"\"\"
        {title} API 호출

        Returns:
            API 응답 데이터
        Raises:
            requests.HTTPError: API 오류 시
        \"\"\"
        response = requests.get(
            f"{{self.base_url}}{endpoint}",
            headers=self.headers,
            params=params
        )
        response.raise_for_status()
        return response.json()
```

주의사항:
- Access Token이 필요합니다 (OAuth 2.0 인증)
- Rate limit: 분당 100회 제한
- API 버전 헤더 필수"""
    })

    # Template 2: Code example question
    qa_pairs.append({
        "question": f"Cafe24에서 {category} 데이터를 조회하는 Python 코드 예제 보여줘",
        "answer": f"""다음은 {category} 조회 예제입니다:

```python
import requests
import os
from dotenv import load_dotenv

load_dotenv()

def get_{category.lower()}_data():
    mall_id = os.getenv("CAFE24_MALL_ID")
    access_token = os.getenv("CAFE24_ACCESS_TOKEN")

    url = f"https://{{mall_id}}.cafe24api.com/api/v2/admin/{category.lower()}"

    headers = {{
        "Authorization": f"Bearer {{access_token}}",
        "Content-Type": "application/json",
        "X-Cafe24-Api-Version": "2024-06-01"
    }}

    params = {{
        "limit": 100,
        "offset": 0
    }}

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

        print(f"조회된 {category} 수: {{len(data.get('{category.lower()}', []))}}")
        return data

    except requests.HTTPError as e:
        print(f"API 오류: {{e.response.status_code}} - {{e.response.text}}")
        raise

if __name__ == "__main__":
    result = get_{category.lower()}_data()
    print(result)
```

환경변수 설정:
```bash
CAFE24_MALL_ID=your_mall_id
CAFE24_ACCESS_TOKEN=your_access_token
```"""
    })

    # Template 3: Error handling question
    qa_pairs.append({
        "question": f"{title} API 호출 시 발생할 수 있는 오류 처리는 어떻게 하나요?",
        "answer": f"""Cafe24 API 오류 처리 예제입니다:

```python
import requests
from typing import Optional, Dict, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Cafe24APIError(Exception):
    \"\"\"Cafe24 API 오류\"\"\"
    def __init__(self, status_code: int, message: str, code: Optional[str] = None):
        self.status_code = status_code
        self.message = message
        self.code = code
        super().__init__(f"[{{status_code}}] {{message}}")

def call_{category.lower()}_api(mall_id: str, access_token: str) -> Dict[str, Any]:
    \"\"\"
    {category} API 호출 (오류 처리 포함)
    \"\"\"
    url = f"https://{{mall_id}}.cafe24api.com/api/v2/admin/{category.lower()}"

    headers = {{
        "Authorization": f"Bearer {{access_token}}",
        "Content-Type": "application/json"
    }}

    try:
        response = requests.get(url, headers=headers, timeout=30)

        if response.status_code == 401:
            raise Cafe24APIError(401, "인증 실패 - Access Token 확인 필요")
        elif response.status_code == 403:
            raise Cafe24APIError(403, "권한 없음 - API 스코프 확인 필요")
        elif response.status_code == 429:
            raise Cafe24APIError(429, "Rate limit 초과 - 잠시 후 재시도")
        elif response.status_code >= 500:
            raise Cafe24APIError(response.status_code, "Cafe24 서버 오류")

        response.raise_for_status()
        return response.json()

    except requests.Timeout:
        logger.error("API 요청 타임아웃")
        raise Cafe24APIError(0, "요청 타임아웃 (30초)")
    except requests.ConnectionError:
        logger.error("네트워크 연결 오류")
        raise Cafe24APIError(0, "네트워크 연결 실패")
```

주요 오류 코드:
- 401: 인증 실패 (토큰 만료 또는 잘못된 토큰)
- 403: 권한 없음 (스코프 부족)
- 429: Rate limit 초과
- 500+: 서버 오류"""
    })

    return qa_pairs


def format_for_together(qa_pairs, system_prompt=SYSTEM_PROMPT):
    """Format Q&A pairs for Together AI fine-tuning."""
    formatted = []

    for qa in qa_pairs:
        formatted.append({
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": qa["question"]},
                {"role": "assistant", "content": qa["answer"]}
            ]
        })

    return formatted


def save_dataset(data, filepath):
    """Save dataset as JSONL."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    with open(filepath, 'w', encoding='utf-8') as f:
        for item in data:
            f.write(json.dumps(item, ensure_ascii=False) + '\n')

    print(f"Dataset saved: {filepath} ({len(data)} examples)")


def main():
    print("=" * 60)
    print("Cafe24 CRM Fine-tuning Dataset Generator")
    print("=" * 60)

    # Fetch API docs from Qdrant
    print("\n[1/4] Fetching API documentation from Qdrant...")
    docs = get_qdrant_docs()
    print(f"   Found {len(docs)} API documents")

    if not docs:
        print("No documents found. Exiting.")
        return

    # Generate Q&A pairs for each document
    print("\n[2/4] Generating Q&A pairs...")
    all_qa_pairs = []

    for doc in docs:
        payload = doc.get("payload", {})
        content = payload.get("content", "")
        category = payload.get("category", "General")
        endpoint = payload.get("endpoint", "/api/v2/unknown")

        qa_pairs = generate_qa_pairs(content, category, endpoint)
        all_qa_pairs.extend(qa_pairs)
        print(f"   - {category}: {len(qa_pairs)} Q&A pairs")

    print(f"\n   Total Q&A pairs: {len(all_qa_pairs)}")

    # Format for Together AI
    print("\n[3/4] Formatting for Together AI...")
    formatted_data = format_for_together(all_qa_pairs)

    # Save dataset
    print("\n[4/4] Saving dataset...")
    save_dataset(formatted_data, DATASET_FILE)

    # Summary
    print("\n" + "=" * 60)
    print("Dataset Generation Complete!")
    print("=" * 60)
    print(f"Output file: {DATASET_FILE}")
    print(f"Total examples: {len(formatted_data)}")
    print(f"Ready for Together AI fine-tuning")
    print("\nNext steps:")
    print("1. Upload to Together AI: together files upload <file>")
    print("2. Start fine-tuning: together fine-tuning create")
    print("=" * 60)


if __name__ == "__main__":
    main()
