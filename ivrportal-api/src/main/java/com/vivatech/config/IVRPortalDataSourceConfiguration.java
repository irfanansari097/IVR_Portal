/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.vivatech.config;

/**
 *
 * @author KALAM
 */

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import org.springframework.context.annotation.PropertySource;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = "com.vivatech.repository.ivrportal",
        entityManagerFactoryRef = "ivrportalEntityManagerFactory",
        transactionManagerRef= "ivrportalTransactionManager"
)
//@PropertySource("classpath:database.properties")
@PropertySource("file:////home/core/ivrportal/database.properties")
public class IVRPortalDataSourceConfiguration {

    @Bean
    @Primary
    @ConfigurationProperties("app.datasource.ivrportal")
    public DataSourceProperties ivrportalDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
    @ConfigurationProperties("app.datasource.ivrportal.configuration")
    public DataSource ivrportalDataSource() {
        return ivrportalDataSourceProperties().initializeDataSourceBuilder()
                .type(HikariDataSource.class).build();
    }

    @Primary
    @Bean(name = "ivrportalEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean ivrportalEntityManagerFactory(EntityManagerFactoryBuilder builder) {
        return builder
                .dataSource(ivrportalDataSource())
                .packages(new String[] {"com.vivatech.model.ivrportal"})
                .build();
    }

    @Primary
    @Bean
    public PlatformTransactionManager ivrportalTransactionManager(
            final @Qualifier("ivrportalEntityManagerFactory") LocalContainerEntityManagerFactoryBean ivrportalEntityManagerFactory) {
        return new JpaTransactionManager(ivrportalEntityManagerFactory.getObject());
    }

}

