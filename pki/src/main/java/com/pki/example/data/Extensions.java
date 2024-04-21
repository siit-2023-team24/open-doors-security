package com.pki.example.data;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Extensions {
    private boolean CA;
    private int[] usage;
    private int extendedUsage;
    public Extensions() {
    }
}
