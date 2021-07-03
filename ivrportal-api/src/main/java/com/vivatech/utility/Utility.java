package com.vivatech.utility;
public class Utility {
    
    public static String getFileExtension(String fileName) {
        String extension = ".wav";
        int index = fileName.lastIndexOf('.');
        if (index > 0) {
            extension = "." + fileName.substring(index + 1);
        }
        return extension;
    }

}
