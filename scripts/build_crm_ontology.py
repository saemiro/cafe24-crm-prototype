#!/usr/bin/env python3
"""
Cafe24 CRM Prototype - Neo4j Ontology Builder
Builds CRM domain ontology in Neo4j with CRM_ prefix for separation from Light CRM

Usage:
    python build_crm_ontology.py
"""

import os
import requests
from requests.auth import HTTPBasicAuth
import json

# Neo4j Configuration (via Cloudflare Access)
NEO4J_HTTP_URL = os.getenv("NEO4J_HTTP_URL", "https://neo4j.saemiro.com")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "ontology2025!")

# Cloudflare Access
CF_ACCESS_CLIENT_ID = os.getenv("CF_ACCESS_CLIENT_ID", "33fc2fac58bf5237d16ac159db51b46b.access")
CF_ACCESS_CLIENT_SECRET = os.getenv("CF_ACCESS_CLIENT_SECRET", "7251ba3d0093523b81898e1df292ba8531b48db96d981224c8612fb1f3c1183c")


def execute_cypher(query: str, params: dict = None) -> dict:
    """Execute a Cypher query via Neo4j HTTP API"""
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "CF-Access-Client-Id": CF_ACCESS_CLIENT_ID,
        "CF-Access-Client-Secret": CF_ACCESS_CLIENT_SECRET,
    }

    payload = {
        "statements": [{
            "statement": query,
            "parameters": params or {}
        }]
    }

    response = requests.post(
        f"{NEO4J_HTTP_URL}/db/neo4j/tx/commit",
        headers=headers,
        auth=HTTPBasicAuth(NEO4J_USER, NEO4J_PASSWORD),
        json=payload
    )

    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None

    result = response.json()
    if result.get("errors"):
        print(f"Cypher Error: {result['errors']}")
        return None

    return result


def create_schema():
    """Create indexes and constraints for CRM entities"""
    print("\n📋 Creating schema (indexes and constraints)...")

    schema_queries = [
        # Indexes for CRM entities
        "CREATE INDEX crm_customer_id IF NOT EXISTS FOR (c:CRM_Customer) ON (c.id)",
        "CREATE INDEX crm_customer_email IF NOT EXISTS FOR (c:CRM_Customer) ON (c.email)",
        "CREATE INDEX crm_order_id IF NOT EXISTS FOR (o:CRM_Order) ON (o.id)",
        "CREATE INDEX crm_order_status IF NOT EXISTS FOR (o:CRM_Order) ON (o.status)",
        "CREATE INDEX crm_product_id IF NOT EXISTS FOR (p:CRM_Product) ON (p.id)",
        "CREATE INDEX crm_campaign_id IF NOT EXISTS FOR (c:CRM_Campaign) ON (c.id)",
        "CREATE INDEX crm_segment_id IF NOT EXISTS FOR (s:CRM_Segment) ON (s.id)",

        # Meta-ontology indexes
        "CREATE INDEX crm_entity_type IF NOT EXISTS FOR (e:CRM_EntityType) ON (e.name)",
        "CREATE INDEX crm_workflow IF NOT EXISTS FOR (w:CRM_Workflow) ON (w.name)",
        "CREATE INDEX crm_integration IF NOT EXISTS FOR (i:CRM_Integration) ON (i.name)",
    ]

    for query in schema_queries:
        result = execute_cypher(query)
        if result:
            print(f"  ✓ {query.split('FOR')[0].strip()}")
        else:
            print(f"  ✗ Failed: {query[:50]}...")

    print("  Schema creation complete!")


def create_entity_types():
    """Create meta-ontology: entity type definitions"""
    print("\n🏗️ Creating CRM Entity Types...")

    entity_types = [
        {
            "name": "Customer",
            "description": "End customer who purchases from Cafe24 mall",
            "attributes": ["id", "email", "name", "phone", "created_at", "membership_level"],
            "color": "#4CAF50"
        },
        {
            "name": "Order",
            "description": "Purchase transaction",
            "attributes": ["id", "status", "total_amount", "created_at", "payment_method"],
            "color": "#2196F3"
        },
        {
            "name": "Product",
            "description": "Item available for sale",
            "attributes": ["id", "name", "price", "stock", "category"],
            "color": "#FF9800"
        },
        {
            "name": "Campaign",
            "description": "Marketing campaign",
            "attributes": ["id", "name", "type", "status", "start_date", "end_date"],
            "color": "#9C27B0"
        },
        {
            "name": "CustomerSegment",
            "description": "Group of customers with similar characteristics",
            "attributes": ["id", "name", "criteria", "count"],
            "color": "#00BCD4"
        },
        {
            "name": "AIEnhancement",
            "description": "AI-powered feature for CRM intelligence",
            "attributes": ["name", "description", "input", "output"],
            "color": "#E91E63"
        }
    ]

    for et in entity_types:
        query = """
        MERGE (e:CRM_EntityType {name: $name})
        SET e.description = $description,
            e.attributes = $attributes,
            e.color = $color,
            e.domain = 'cafe24_crm_prototype'
        RETURN e
        """
        result = execute_cypher(query, et)
        if result:
            print(f"  ✓ CRM_EntityType: {et['name']}")


def create_relationships_meta():
    """Create meta-ontology: relationship type definitions"""
    print("\n🔗 Creating CRM Relationship Types...")

    relationships = [
        {"from": "Customer", "type": "PLACES", "to": "Order"},
        {"from": "Customer", "type": "BELONGS_TO", "to": "CustomerSegment"},
        {"from": "Order", "type": "CONTAINS", "to": "Product"},
        {"from": "Campaign", "type": "TARGETS", "to": "CustomerSegment"},
        {"from": "Campaign", "type": "PROMOTES", "to": "Product"},
        {"from": "AIEnhancement", "type": "ANALYZES", "to": "Customer"},
        {"from": "AIEnhancement", "type": "OPTIMIZES", "to": "Campaign"},
    ]

    for rel in relationships:
        query = """
        MATCH (from:CRM_EntityType {name: $from})
        MATCH (to:CRM_EntityType {name: $to})
        MERGE (from)-[r:CRM_HAS_RELATIONSHIP {type: $type}]->(to)
        RETURN r
        """
        result = execute_cypher(query, rel)
        if result:
            print(f"  ✓ {rel['from']} -[{rel['type']}]-> {rel['to']}")


def create_workflows():
    """Create workflow state machines"""
    print("\n⚙️ Creating CRM Workflows...")

    workflows = [
        {
            "name": "OrderLifecycle",
            "description": "Order state transitions",
            "states": ["pending", "paid", "preparing", "shipped", "delivered", "cancelled", "refunded"],
            "transitions": [
                {"from": "pending", "to": "paid", "trigger": "payment_received"},
                {"from": "paid", "to": "preparing", "trigger": "start_processing"},
                {"from": "preparing", "to": "shipped", "trigger": "shipment_created"},
                {"from": "shipped", "to": "delivered", "trigger": "delivery_confirmed"},
                {"from": "pending", "to": "cancelled", "trigger": "cancel_request"},
                {"from": "delivered", "to": "refunded", "trigger": "refund_request"},
            ]
        },
        {
            "name": "CampaignExecution",
            "description": "Marketing campaign workflow",
            "states": ["draft", "scheduled", "active", "paused", "completed"],
            "transitions": [
                {"from": "draft", "to": "scheduled", "trigger": "publish"},
                {"from": "scheduled", "to": "active", "trigger": "start_time"},
                {"from": "active", "to": "paused", "trigger": "pause"},
                {"from": "paused", "to": "active", "trigger": "resume"},
                {"from": "active", "to": "completed", "trigger": "end_time"},
            ]
        }
    ]

    for wf in workflows:
        # Create workflow node
        query = """
        MERGE (w:CRM_Workflow {name: $name})
        SET w.description = $description,
            w.states = $states,
            w.domain = 'cafe24_crm_prototype'
        RETURN w
        """
        result = execute_cypher(query, {
            "name": wf["name"],
            "description": wf["description"],
            "states": wf["states"]
        })

        if result:
            print(f"  ✓ CRM_Workflow: {wf['name']}")

        # Create state nodes and transitions
        for state in wf["states"]:
            state_query = """
            MATCH (w:CRM_Workflow {name: $workflow})
            MERGE (s:CRM_State {name: $state, workflow: $workflow})
            MERGE (w)-[:HAS_STATE]->(s)
            RETURN s
            """
            execute_cypher(state_query, {"workflow": wf["name"], "state": state})

        for t in wf["transitions"]:
            trans_query = """
            MATCH (from:CRM_State {name: $from, workflow: $workflow})
            MATCH (to:CRM_State {name: $to, workflow: $workflow})
            MERGE (from)-[:CRM_TRANSITION {trigger: $trigger}]->(to)
            RETURN from, to
            """
            execute_cypher(trans_query, {
                "workflow": wf["name"],
                "from": t["from"],
                "to": t["to"],
                "trigger": t["trigger"]
            })

        print(f"    - {len(wf['states'])} states, {len(wf['transitions'])} transitions")


def create_integrations():
    """Create integration definitions"""
    print("\n🔌 Creating CRM Integrations...")

    integrations = [
        {
            "name": "Cafe24API",
            "description": "Cafe24 E-commerce Platform API",
            "auth_type": "oauth2",
            "rate_limit": "1000 requests/minute",
            "endpoints": json.dumps({
                "customers": "/api/v2/admin/customers",
                "orders": "/api/v2/admin/orders",
                "products": "/api/v2/admin/products",
                "categories": "/api/v2/admin/categories"
            })
        },
        {
            "name": "SlackNotification",
            "description": "Team notifications via Slack",
            "auth_type": "webhook",
            "use_cases": json.dumps([
                "High-value order alert",
                "Campaign performance summary",
                "Customer complaint escalation"
            ])
        },
        {
            "name": "TogetherAI",
            "description": "LLM provider for AI features",
            "auth_type": "api_key",
            "models": json.dumps([
                "meta-llama/Llama-3.3-70B-Instruct-Turbo",
                "deepseek-ai/DeepSeek-R1-Distill-Llama-70B"
            ])
        }
    ]

    for intg in integrations:
        query = """
        MERGE (i:CRM_Integration {name: $name})
        SET i.description = $description,
            i.auth_type = $auth_type,
            i.domain = 'cafe24_crm_prototype'
        """
        # Add optional properties
        for key in ["rate_limit", "endpoints", "use_cases", "models"]:
            if key in intg:
                query += f", i.{key} = ${key}"
        query += " RETURN i"

        result = execute_cypher(query, intg)
        if result:
            print(f"  ✓ CRM_Integration: {intg['name']}")


def create_ai_enhancements():
    """Create AI enhancement point definitions"""
    print("\n🤖 Creating AI Enhancement Points...")

    ai_features = [
        {
            "name": "CustomerSegmentation",
            "description": "AI-powered customer clustering",
            "input_data": "Purchase history, browsing behavior, demographics",
            "output": "Recommended segments with confidence scores",
            "algorithm": "K-means clustering + LLM interpretation"
        },
        {
            "name": "CampaignOptimization",
            "description": "Optimal send time and content suggestions",
            "input_data": "Historical campaign performance, customer preferences",
            "output": "Best send time, subject line variations, content recommendations",
            "algorithm": "Time series analysis + LLM content generation"
        },
        {
            "name": "ChurnPrediction",
            "description": "Identify at-risk customers",
            "input_data": "Recent activity, purchase frequency, support tickets",
            "output": "Churn probability, recommended retention actions",
            "algorithm": "Gradient boosting + LLM action recommendations"
        },
        {
            "name": "ProductRecommendation",
            "description": "Personalized product suggestions",
            "input_data": "Purchase history, browsing behavior, similar customers",
            "output": "Ranked product recommendations with reasoning",
            "algorithm": "Collaborative filtering + LLM reasoning explanation"
        }
    ]

    for ai in ai_features:
        query = """
        MERGE (a:CRM_AIEnhancement {name: $name})
        SET a.description = $description,
            a.input_data = $input_data,
            a.output = $output,
            a.algorithm = $algorithm,
            a.domain = 'cafe24_crm_prototype'
        RETURN a
        """
        result = execute_cypher(query, ai)
        if result:
            print(f"  ✓ CRM_AIEnhancement: {ai['name']}")

    # Link AI enhancements to entity types
    links = [
        {"ai": "CustomerSegmentation", "entity": "Customer", "rel": "ANALYZES"},
        {"ai": "CampaignOptimization", "entity": "Campaign", "rel": "OPTIMIZES"},
        {"ai": "ChurnPrediction", "entity": "Customer", "rel": "PREDICTS_FOR"},
        {"ai": "ProductRecommendation", "entity": "Product", "rel": "RECOMMENDS"},
    ]

    for link in links:
        query = """
        MATCH (ai:CRM_AIEnhancement {name: $ai})
        MATCH (e:CRM_EntityType {name: $entity})
        MERGE (ai)-[:CRM_ENHANCES {relationship: $rel}]->(e)
        RETURN ai, e
        """
        execute_cypher(query, link)


def create_sample_data():
    """Create sample data for demonstration"""
    print("\n📊 Creating sample CRM data...")

    # Sample customers
    customers = [
        {"id": "C001", "name": "김철수", "email": "chulsoo@example.com", "level": "VIP", "ltv": 1500000},
        {"id": "C002", "name": "이영희", "email": "younghee@example.com", "level": "Gold", "ltv": 800000},
        {"id": "C003", "name": "박민수", "email": "minsu@example.com", "level": "Silver", "ltv": 350000},
        {"id": "C004", "name": "최지연", "email": "jiyeon@example.com", "level": "Bronze", "ltv": 120000},
        {"id": "C005", "name": "정다은", "email": "daeun@example.com", "level": "VIP", "ltv": 2200000},
    ]

    for c in customers:
        query = """
        MERGE (c:CRM_Customer {id: $id})
        SET c.name = $name,
            c.email = $email,
            c.membership_level = $level,
            c.lifetime_value = $ltv,
            c.domain = 'cafe24_crm_prototype'
        RETURN c
        """
        execute_cypher(query, c)
    print(f"  ✓ Created {len(customers)} sample customers")

    # Sample orders
    orders = [
        {"id": "O001", "customer": "C001", "status": "delivered", "amount": 150000},
        {"id": "O002", "customer": "C001", "status": "shipped", "amount": 85000},
        {"id": "O003", "customer": "C002", "status": "delivered", "amount": 220000},
        {"id": "O004", "customer": "C003", "status": "pending", "amount": 45000},
        {"id": "O005", "customer": "C005", "status": "delivered", "amount": 380000},
    ]

    for o in orders:
        query = """
        MATCH (c:CRM_Customer {id: $customer})
        MERGE (o:CRM_Order {id: $id})
        SET o.status = $status,
            o.total_amount = $amount,
            o.domain = 'cafe24_crm_prototype'
        MERGE (c)-[:CRM_PLACES]->(o)
        RETURN o
        """
        execute_cypher(query, o)
    print(f"  ✓ Created {len(orders)} sample orders")

    # Sample products
    products = [
        {"id": "P001", "name": "프리미엄 티셔츠", "price": 39000, "category": "의류"},
        {"id": "P002", "name": "스마트 워치", "price": 299000, "category": "전자제품"},
        {"id": "P003", "name": "유기농 스킨케어 세트", "price": 85000, "category": "뷰티"},
        {"id": "P004", "name": "에코 텀블러", "price": 25000, "category": "생활용품"},
    ]

    for p in products:
        query = """
        MERGE (p:CRM_Product {id: $id})
        SET p.name = $name,
            p.price = $price,
            p.category = $category,
            p.domain = 'cafe24_crm_prototype'
        RETURN p
        """
        execute_cypher(query, p)
    print(f"  ✓ Created {len(products)} sample products")

    # Sample segments
    segments = [
        {"id": "S001", "name": "High Value Customers", "count": 2, "criteria": "LTV > 1000000"},
        {"id": "S002", "name": "At-Risk Churners", "count": 1, "criteria": "No purchase in 90 days"},
        {"id": "S003", "name": "New Customers", "count": 1, "criteria": "Registered < 30 days"},
    ]

    for s in segments:
        query = """
        MERGE (s:CRM_Segment {id: $id})
        SET s.name = $name,
            s.customer_count = $count,
            s.criteria = $criteria,
            s.domain = 'cafe24_crm_prototype'
        RETURN s
        """
        execute_cypher(query, s)
    print(f"  ✓ Created {len(segments)} sample segments")

    # Link customers to segments
    segment_links = [
        {"customer": "C001", "segment": "S001"},
        {"customer": "C005", "segment": "S001"},
        {"customer": "C003", "segment": "S002"},
        {"customer": "C004", "segment": "S003"},
    ]

    for link in segment_links:
        query = """
        MATCH (c:CRM_Customer {id: $customer})
        MATCH (s:CRM_Segment {id: $segment})
        MERGE (c)-[:CRM_BELONGS_TO]->(s)
        RETURN c, s
        """
        execute_cypher(query, link)
    print("  ✓ Linked customers to segments")


def print_summary():
    """Print ontology summary"""
    print("\n" + "=" * 60)
    print("CRM Ontology Build Summary")
    print("=" * 60)

    # Count nodes by label
    labels = [
        "CRM_EntityType", "CRM_Workflow", "CRM_State", "CRM_Integration",
        "CRM_AIEnhancement", "CRM_Customer", "CRM_Order", "CRM_Product", "CRM_Segment"
    ]

    for label in labels:
        query = f"MATCH (n:{label}) RETURN count(n) as count"
        result = execute_cypher(query)
        if result and result.get("results"):
            count = result["results"][0]["data"][0]["row"][0] if result["results"][0]["data"] else 0
            print(f"  {label}: {count}")

    # Count relationships
    rel_query = """
    MATCH ()-[r]->()
    WHERE type(r) STARTS WITH 'CRM_'
    RETURN count(r) as count
    """
    result = execute_cypher(rel_query)
    if result and result.get("results"):
        count = result["results"][0]["data"][0]["row"][0] if result["results"][0]["data"] else 0
        print(f"\n  Total CRM relationships: {count}")


def main():
    print("=" * 60)
    print("Cafe24 CRM Prototype - Neo4j Ontology Builder")
    print("=" * 60)
    print(f"Target: {NEO4J_HTTP_URL}")
    print("Domain: cafe24_crm_prototype")
    print("Label Prefix: CRM_")

    # Test connection
    print("\n🔌 Testing Neo4j connection...")
    test_result = execute_cypher("RETURN 1 as test")
    if not test_result:
        print("❌ Failed to connect to Neo4j")
        return
    print("  ✓ Connected to Neo4j")

    # Build ontology
    create_schema()
    create_entity_types()
    create_relationships_meta()
    create_workflows()
    create_integrations()
    create_ai_enhancements()
    create_sample_data()
    print_summary()

    print("\n" + "=" * 60)
    print("SUCCESS: CRM Ontology built in Neo4j")
    print("=" * 60)
    print("\nAccess Neo4j Browser: https://neo4j.saemiro.com")
    print("Sample query: MATCH (n) WHERE n.domain = 'cafe24_crm_prototype' RETURN n LIMIT 25")


if __name__ == "__main__":
    main()
