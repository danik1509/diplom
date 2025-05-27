package by.bsuir.eBag.repository;

import by.bsuir.eBag.model.Bucket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BucketRepository extends JpaRepository<Bucket, Integer> {
}
