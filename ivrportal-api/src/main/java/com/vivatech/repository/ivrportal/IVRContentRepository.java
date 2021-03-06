package com.vivatech.repository.ivrportal;

import com.vivatech.model.ivrportal.IVRContent;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

/**
 *
 * @author ALAM
 */
public interface IVRContentRepository extends CrudRepository<IVRContent, Integer> {

    List<IVRContent> findByServiceidAndCategoryid(String Serviceid, String Categoryid);
    
    List<IVRContent> findByServiceid(String Serviceid);
    
    @Query(value = "SELECT * FROM ivrcontent where status = ?1 and serviceid = ?2 and date(activedate) = Date(Now())", nativeQuery = true)
    List<IVRContent> findByServiceidAndStatusForToday(String status, String Serviceid);
    
    @Query(value = "SELECT * FROM ivrcontent where status = ?1 and serviceid = ?2 and date(activedate) = DATE(NOW() - INTERVAL 1 DAY)", nativeQuery = true)
    List<IVRContent> findByServiceidAndStatusForYesterday(String status, String Serviceid);
    
    @Query(value = "SELECT distinct(serviceid) FROM ivrcontent", nativeQuery = true)
    List<String> findDistinctByServiceid();
}
