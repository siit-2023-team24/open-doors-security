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
    private int[] extendedUsages;
    public Extensions() {
    }

    public int[] getUsage() {
        if (usage == null)
            return new int[]{};
        return usage;
    }

    public int[] getExtendedUsages() {
        if (extendedUsages == null)
            return new int[]{};
        return extendedUsages;
    }
}
