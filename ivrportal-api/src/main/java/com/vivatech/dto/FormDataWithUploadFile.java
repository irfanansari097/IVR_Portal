/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.vivatech.dto;

import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author KALAM
 */
public class FormDataWithUploadFile {

    private String ivrcontent;

    private MultipartFile uploadfile;

    public String getIvrcontent() {
        return ivrcontent;
    }

    public void setIvrcontent(String ivrcontent) {
        this.ivrcontent = ivrcontent;
    }

    public MultipartFile getUploadfile() {
        return uploadfile;
    }

    public void setUploadfile(MultipartFile uploadfile) {
        this.uploadfile = uploadfile;
    }

}
