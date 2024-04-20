package com.pki.example.data;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Extensions {
    private boolean CA;
    private boolean[] usage;

    public Extensions() {
    }

    public boolean isCA() {
        return CA;
    }

    public void setCA(boolean CA) {
        this.CA = CA;
    }

    public boolean[] getUsage() {
        return usage;
    }

    public void setUsage(boolean[] usage) {
        this.usage = usage;
    }
}
