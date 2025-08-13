package com.talk.back.analysis.dto;


import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @ToString
public class UploadFileInfo {
    private String fileName;
    private String contentType;
    private long   size;
}



