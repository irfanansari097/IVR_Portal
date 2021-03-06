package com.vivatech.controller.ivrportal;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vivatech.config.Response;
import com.vivatech.dto.Dashboarddto;
import com.vivatech.dto.FormDataWithUploadFile;
import com.vivatech.model.ivrportal.IVRContent;
import com.vivatech.storage.StorageService;
import java.io.File;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import com.vivatech.repository.ivrportal.IVRContentRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping(path = "/ivrcontent")
public class IVRContentController {

    private static final Logger logger = LoggerFactory.getLogger(IVRContentController.class);

    @Autowired
    private IVRContentRepository ivrContentRepository;

    @Autowired
    private StorageService storageService;

    //view all
    @GetMapping("/view")
    public List<IVRContent> getAllIVRContent() {
        logger.info("Entering getAllIVRContent");
        List<IVRContent> list = new ArrayList<>();
        String filepath = "";
        String datestring = "";
        try {
            list = (List<IVRContent>) ivrContentRepository.findAll();
            for (Integer i = 0; i < list.size(); i++) {
                filepath = list.get(i).getPath();
                filepath = MvcUriComponentsBuilder.fromMethodName(FileUploadController.class,
                        "serveFile", filepath).build().toUri().toString();
                list.get(i).setPath(filepath);
            }

        } catch (Exception e) {
            e.printStackTrace();
            logger.info("EXCEPTION : getAllIVRContent - " + e.getMessage());
        }
        logger.info("EXITING getAllIVRContent");
        return list;
    }

    ///add subject////////
    @PostMapping(path = "/add")
    public @ResponseBody
    Response addIVRContent(@ModelAttribute FormDataWithUploadFile inFormData) {

        logger.info("ENTERING addIVRContent");
        Response response = new Response();
        try {
            IVRContent n = new ObjectMapper().readValue(inFormData.getIvrcontent(), IVRContent.class);
//            n.setModifydate(LocalDateTime.now());            

            // upload file
            MultipartFile uploadfile = inFormData.getUploadfile();
//            logger.info(uploadfile.getOriginalFilename());
            n.setPath(n.getCategoryid() + File.separator + uploadfile.getOriginalFilename());
            storageService.store(inFormData.getUploadfile(), n.getPath());            

            ivrContentRepository.save(n);

        } catch (Exception e) {
            e.printStackTrace();
            response.setResult("FAIL");
            response.setErrorcode(1);
            response.setError(e.getMessage());
            logger.info("EXCEPTION : addIVRContent - " + e.getMessage());
        }
        logger.info("EXITING addIVRContent");
        return response;

    }

    //update subject//////////////////
    @PostMapping(path = "/update")
    public @ResponseBody
    Response updateIVRContent(@ModelAttribute FormDataWithUploadFile inFormData) {

        logger.info("Entering updateIVRContent");
        Response response = new Response();
        try {
            IVRContent n = new ObjectMapper().readValue(inFormData.getIvrcontent(), IVRContent.class);

            Optional<IVRContent> ivrContent = ivrContentRepository.findById(n.getId());
            if (ivrContent.isPresent()) {

                MultipartFile uploadfile = inFormData.getUploadfile();
                if (uploadfile != null) {
                    storageService.store(inFormData.getUploadfile(), "ivrportal" + File.separator + uploadfile.getOriginalFilename());
                    n.setPath("ivrportal" + File.separator + uploadfile.getOriginalFilename());
                }
                
//                n.setModifydate(LocalDateTime.now());

                ivrContentRepository.save(n);
            }

        } catch (Exception e) {
            e.printStackTrace();
            response.setResult("FAIL");
            response.setErrorcode(2);
            response.setError(e.getMessage());
            logger.info("EXCEPTION : updateIVRContent - " + e.getMessage());
        }
        logger.info("EXITING updateIVRContent");
        return response;
    }

    //delete subject///////
    @PostMapping("/delete")
    public @ResponseBody
    Response deleteIVRContent(@RequestBody Integer id) {
        logger.info("Entering deleteIVRContent");
        Response response = new Response();
        try {
            ivrContentRepository.deleteById(id);
        } catch (Exception e) {
            e.printStackTrace();
            response.setResult("FAIL");
            response.setErrorcode(3);
            response.setError(e.getMessage());
            logger.info("EXCEPTION : deleteIVRContent - " + e.getMessage());
        }
        logger.info("EXITING deleteIVRContent");
        return response;
    }

    @GetMapping("/dashboardview")
    public Dashboarddto getDashboardDto(@RequestParam String serviceid) {
        Dashboarddto dto = new Dashboarddto();
        logger.info("Entering getDashboardDto");
        try {
            List<IVRContent> contents = ivrContentRepository.findByServiceid(serviceid);
            if (contents != null) {
                dto.setTotalbasecount(contents.size());
            }

            contents = ivrContentRepository.findByServiceidAndCategoryid(serviceid, "Basic");
            if (contents != null) {
                dto.setTotalbasiccategoryContents(contents.size());
            }
            contents = ivrContentRepository.findByServiceidAndCategoryid(serviceid, "Advance");
            if (contents != null) {
                dto.setTotaladvancecategoryContents(contents.size());
            }
            contents = ivrContentRepository.findByServiceidAndStatusForToday("A", serviceid);
            if (contents != null) {
//                logger.info("Activation A : " + contents.size());
                dto.setTodayactivationcount(contents.size());
            }
            contents = ivrContentRepository.findByServiceidAndStatusForToday("D", serviceid);
            if (contents != null) {
//                logger.info("Activation D : " + contents.size());
                dto.setTodaydeactivationcount(contents.size());
            }
            contents = ivrContentRepository.findByServiceidAndStatusForYesterday("A", serviceid);
            if (contents != null) {
//                logger.info("Activation YESTERDAY A : " + contents.size());
                dto.setYesterdayactivationcount(contents.size());
            }
            contents = ivrContentRepository.findByServiceidAndStatusForYesterday("D", serviceid);
            if (contents != null) {
//                logger.info("Activation YESTERDAY D : " + contents.size());
                dto.setYesterdaydeactivationcount(contents.size());
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.info("EXCEPTION : getDashboardDto - " + e.getMessage());
        }
        logger.info("EXITING getDashboardDto");

        return dto;
    }

    @GetMapping("/allserviceid")
    public List<String> getAllServiceId() {
        logger.info("Entering getAllServiceId");

        List<String> list = new ArrayList<>();
        try {
           list = (List<String>) ivrContentRepository.findDistinctByServiceid();

        } catch (Exception e) {
            e.printStackTrace();
            logger.info("EXCEPTION : getAllServiceId - " + e.getMessage());
        }
        logger.info("EXITING getAllServiceId");
        return list;
    }

}
