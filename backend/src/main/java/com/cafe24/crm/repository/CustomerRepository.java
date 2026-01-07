package com.cafe24.crm.repository;

import com.cafe24.crm.domain.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByCafe24MemberIdAndMallId(String cafe24MemberId, String mallId);

    Page<Customer> findByMallId(String mallId, Pageable pageable);

    List<Customer> findByMallIdAndSegment(String mallId, String segment);

    @Query("SELECT c FROM Customer c WHERE c.mallId = :mallId ORDER BY c.totalRevenue DESC")
    List<Customer> findTopCustomersByRevenue(@Param("mallId") String mallId, Pageable pageable);

    @Query("SELECT c.segment, COUNT(c) FROM Customer c WHERE c.mallId = :mallId GROUP BY c.segment")
    List<Object[]> countBySegment(@Param("mallId") String mallId);

    @Query("SELECT SUM(c.totalRevenue) FROM Customer c WHERE c.mallId = :mallId")
    Long sumTotalRevenueByMallId(@Param("mallId") String mallId);
}
