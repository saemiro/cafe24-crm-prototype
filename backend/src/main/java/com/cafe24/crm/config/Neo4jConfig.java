package com.cafe24.crm.config;

import org.neo4j.cypherdsl.core.renderer.Dialect;
import org.neo4j.driver.Driver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.neo4j.config.EnableNeo4jAuditing;
import org.springframework.data.neo4j.core.DatabaseSelectionProvider;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.data.neo4j.core.Neo4jTemplate;
import org.springframework.data.neo4j.core.mapping.Neo4jMappingContext;
import org.springframework.data.neo4j.core.transaction.Neo4jTransactionManager;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Neo4j Configuration for CRM Graph Database
 *
 * Configures Spring Data Neo4j for accessing CRM ontology data
 * including customers, orders, products, and their relationships.
 */
@Configuration
@EnableNeo4jRepositories(basePackages = "com.cafe24.crm.repository.neo4j")
@EnableNeo4jAuditing
@EnableTransactionManagement
public class Neo4jConfig {

    /**
     * Configure Cypher DSL dialect for Neo4j 5.x
     */
    @Bean
    org.neo4j.cypherdsl.core.renderer.Configuration cypherDslConfiguration() {
        return org.neo4j.cypherdsl.core.renderer.Configuration.newConfig()
                .withDialect(Dialect.NEO4J_5)
                .build();
    }

    /**
     * Neo4j Client for custom query execution
     */
    @Bean
    Neo4jClient neo4jClient(Driver driver, DatabaseSelectionProvider databaseSelectionProvider) {
        return Neo4jClient.create(driver, databaseSelectionProvider);
    }

    /**
     * Neo4j Template for advanced operations
     */
    @Bean
    Neo4jTemplate neo4jTemplate(Neo4jClient neo4jClient, Neo4jMappingContext mappingContext) {
        return new Neo4jTemplate(neo4jClient, mappingContext);
    }

    /**
     * Transaction Manager for Neo4j operations
     */
    @Bean(name = "neo4jTransactionManager")
    PlatformTransactionManager neo4jTransactionManager(Driver driver,
            DatabaseSelectionProvider databaseSelectionProvider) {
        return new Neo4jTransactionManager(driver, databaseSelectionProvider);
    }
}
