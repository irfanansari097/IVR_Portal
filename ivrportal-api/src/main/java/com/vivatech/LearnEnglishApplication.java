package com.vivatech;

import com.vivatech.storage.StorageProperties;
import com.vivatech.storage.StorageService;
import java.nio.charset.StandardCharsets;
import java.util.Properties;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

//@ServletComponentScan
@SpringBootApplication
@EnableConfigurationProperties(StorageProperties.class)
public class LearnEnglishApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(LearnEnglishApplication.class, args);
    }

    @Bean
    CommandLineRunner init(StorageService storageService) {
        return (args) -> {
            storageService.deleteAll();
            storageService.init();
        };
    }

    @Bean
    public RestTemplate getRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters()
                .add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));
        return restTemplate;
    }

    // set spring.config.location here if we want to deploy the application as a war on tomcat

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder springApplicationBuilder) {

        return springApplicationBuilder
                .sources(LearnEnglishApplication.class)
                .properties(getProperties());

    }

    static Properties getProperties() {

        Properties props = new Properties();

        props.put("spring.config.location", "file:////home/core/ivrportal/");

        return props;

    }
}
