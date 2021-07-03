package com.vivatech.storage;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.PosixFilePermission;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileSystemStorageService implements StorageService {

    private final Path rootLocation;

    @Autowired
    public FileSystemStorageService(StorageProperties properties) {
        this.rootLocation = Paths.get(properties.getLocation());
    }

//    @Override
//    public void store(MultipartFile file, String newfilename) {
//        String filename = StringUtils.cleanPath(file.getOriginalFilename());
//        try {
//            if (file.isEmpty()) {
//                throw new StorageException("Failed to store empty file " + filename);
//            }
//
//            if (newfilename.contains("..")) {
//                // This is a security check
//                throw new StorageException("Cannot store file with relative path outside current directory " + newfilename);
//            }
//
//            File fileObject = new File(newfilename);
//
//            // If file not exist then create it.
//            if (!fileObject.exists()) {
//                fileObject.createNewFile();
//            }
//
//            // Set read, write and execute permission to owner only.
//            fileObject.setReadable(true, true);
//            fileObject.setWritable(true, true);
//            fileObject.setExecutable(true, true);
//
//            // Set read, write and execute permission to all users. 
//            // After settings, permission will change to 777.
//            fileObject.setReadable(true, false);
//            fileObject.setWritable(true, false);
//            fileObject.setExecutable(true, false);
//
//            // If you want to set permission more accurately 
//            // for owner, owner group users and other group users in Linux.
//            // You can use below java code.
//            Set<PosixFilePermission> pfpSet = new HashSet();
//
//            // Add read, write and execute permission to owner. 
//            pfpSet.add(PosixFilePermission.OWNER_READ);
//            pfpSet.add(PosixFilePermission.OWNER_WRITE);
//            pfpSet.add(PosixFilePermission.OWNER_EXECUTE);
//
//            // Add read, write permission to owner group users. 
//            pfpSet.add(PosixFilePermission.GROUP_READ);
//            pfpSet.add(PosixFilePermission.GROUP_WRITE);
//
//            // Add execute permission to other group users 
//            pfpSet.add(PosixFilePermission.OTHERS_EXECUTE);
//
//            // Assign permissions.
//            Files.setPosixFilePermissions(Paths.get(newfilename), pfpSet);
//            // After the code execute test.txt will have a permission of 761
//            
////            Integer lastindex = newfilename.lastIndexOf(File.separator);
////            if (lastindex != -1) {
////                Path path = this.rootLocation.resolve(newfilename.substring(0, newfilename.lastIndexOf(File.separator)));
////
////                Files.createDirectories(path);
////
////            }
//
//        } catch (IOException e) {
//            throw new StorageException("Failed to store file " + newfilename, e);
//        }
//    }

    @Override
    public void store(MultipartFile file, String newfilename) {
        String filename = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if (file.isEmpty()) {
                throw new StorageException("Failed to store empty file " + filename);
            }
            if (newfilename.contains("..")) {
                // This is a security check
                throw new StorageException(
                        "Cannot store file with relative path outside current directory "
                        + newfilename);
            }

            Integer lastindex = newfilename.lastIndexOf(File.separator);
            if (lastindex != -1) {
                Path path = this.rootLocation.resolve(newfilename.substring(0, newfilename.lastIndexOf(File.separator)));

                Files.createDirectories(path);

            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, this.rootLocation.resolve(newfilename),
                        StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new StorageException("Failed to store file " + newfilename, e);
        }
    }
    
    
    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.rootLocation, 1)
                    .filter(path -> !path.equals(this.rootLocation))
                    .map(this.rootLocation::relativize);
        } catch (IOException e) {
            throw new StorageException("Failed to read stored files", e);
        }

    }

    @Override
    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = load(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new StorageFileNotFoundException(
                        "Could not read file: " + filename);

            }
        } catch (MalformedURLException e) {
            throw new StorageFileNotFoundException("Could not read file: " + filename, e);
        }
    }

    @Override
    public void deleteAll() {
        //FileSystemUtils.deleteRecursively(rootLocation.toFile());
    }

    @Override
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new StorageException("Could not initialize storage", e);
        }
    }
}
