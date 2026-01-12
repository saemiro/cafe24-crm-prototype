# Neo4j 패턴 시각화 쿼리

## 접속 정보
- Tailscale URL: `http://100.108.110.57:7474/browser/`
- Bolt: `neo4j://100.108.110.57:7687`
- 인증: `neo4j` / `ontology2025`

## 1. 전체 CRM 온톨로지 시각화

```cypher
// 전체 온톨로지 그래프 (노드 100개 제한)
MATCH (n)-[r]->(m)
WHERE any(label IN labels(n) WHERE label STARTS WITH 'CRM_')
RETURN n, r, m
LIMIT 100
```

## 2. 패턴 중심 시각화

### 2.1 모든 패턴과 관련 엔티티
```cypher
MATCH (p:CRM_Pattern)
OPTIONAL MATCH (p)-[r]-(related)
RETURN p, r, related
```

### 2.2 패턴 타입별 분포
```cypher
MATCH (p:CRM_Pattern)
RETURN p.type as type, p.name as name, p.priority as priority,
       substring(p.summary, 0, 100) as summary
ORDER BY p.discovered_at DESC
```

### 2.3 web_research 패턴만
```cypher
MATCH (p:CRM_Pattern)
WHERE p.type = 'web_research'
RETURN p.name as name, p.summary as summary, p.priority as priority
ORDER BY p.discovered_at DESC
```

### 2.4 cross_domain 패턴만
```cypher
MATCH (p:CRM_Pattern)
WHERE p.type = 'cross_domain'
RETURN p.name as name, p.summary as summary
ORDER BY p.discovered_at DESC
```

## 3. CRM 엔티티 관계 시각화

### 3.1 Customer 중심 관계
```cypher
MATCH path = (c:CRM_Customer)-[*1..2]-(related)
RETURN path
LIMIT 50
```

### 3.2 Order 흐름 시각화
```cypher
MATCH path = (c:CRM_Customer)-[:PLACES]->(o:CRM_Order)-[:CONTAINS]->(p:CRM_Product)
RETURN path
LIMIT 50
```

### 3.3 전체 엔티티 카운트
```cypher
MATCH (n)
WHERE any(label IN labels(n) WHERE label STARTS WITH 'CRM_')
RETURN labels(n)[0] as label, count(n) as count
ORDER BY count DESC
```

## 4. 통계 쿼리

### 4.1 노드/관계 총계
```cypher
MATCH (n)
WHERE any(label IN labels(n) WHERE label STARTS WITH 'CRM_')
WITH count(n) as nodeCount
MATCH ()-[r]->()
WITH nodeCount, count(r) as relCount
RETURN nodeCount as nodes, relCount as relationships
```

### 4.2 패턴 발견 타임라인
```cypher
MATCH (p:CRM_Pattern)
RETURN p.name as pattern,
       p.type as type,
       toString(p.discovered_at) as discovered
ORDER BY p.discovered_at DESC
```

## 5. Neo4j Browser 스타일 설정

브라우저 콘솔에서 실행:
```
:style
```

권장 스타일:
```
node.CRM_Customer {
  color: #4CAF50;
  border-color: #2E7D32;
  caption: '{name}';
}
node.CRM_Order {
  color: #2196F3;
  border-color: #1565C0;
  caption: '{id}';
}
node.CRM_Product {
  color: #FF9800;
  border-color: #EF6C00;
  caption: '{name}';
}
node.CRM_Pattern {
  color: #9C27B0;
  border-color: #6A1B9A;
  caption: '{name}';
  diameter: 80px;
}
```

## 6. 유용한 관리 쿼리

### 6.1 고아 노드 찾기
```cypher
MATCH (n)
WHERE any(label IN labels(n) WHERE label STARTS WITH 'CRM_')
AND NOT (n)--()
RETURN labels(n) as labels, count(n) as orphans
```

### 6.2 최근 생성 노드
```cypher
MATCH (n)
WHERE any(label IN labels(n) WHERE label STARTS WITH 'CRM_')
AND exists(n.created_at)
RETURN labels(n)[0] as type, n.name as name, n.created_at
ORDER BY n.created_at DESC
LIMIT 10
```

---
Generated: 2026-01-08
