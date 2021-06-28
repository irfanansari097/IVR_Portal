package com.vivatech.config;

public class Response {

    String result;
    String error;
    Integer errorcode;

    public Response() {
        this.result = "SUCCESS";
        this.error = "";
        this.errorcode = 0;
    }

    public Response(String string, String message) {
        this.result = string;
        this.error = message;
        this.errorcode = -1;
   }

    public Integer getErrorcode() {
        return errorcode;
    }

    public void setErrorcode(Integer errorcode) {
        this.errorcode = errorcode;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

}
