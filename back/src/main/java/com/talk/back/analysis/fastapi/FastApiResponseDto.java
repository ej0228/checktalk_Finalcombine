package com.talk.back.analysis.fastapi;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class FastApiResponseDto {
    private double matchingRate;
    private String original;
    private String user;
}