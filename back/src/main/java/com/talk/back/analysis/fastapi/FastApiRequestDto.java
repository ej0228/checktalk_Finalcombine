package com.talk.back.analysis.fastapi;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class FastApiRequestDto {
    private String original;
    private String user;
}