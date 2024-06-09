package com.siit.team24.OpenDoors.dto.financialReport;

import jakarta.validation.constraints.PastOrPresent;

import java.sql.Timestamp;

public class DateRangeReportParamsDTO {
    private String hostId;

    @PastOrPresent
    private Timestamp startDate;
    @PastOrPresent
    private Timestamp endDate;

    public DateRangeReportParamsDTO(String hostId, Timestamp startDate, Timestamp endDate) {
        this.hostId = hostId;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public String getHostId() {
        return hostId;
    }

    public void setHostId(String hostId) {
        this.hostId = hostId;
    }

    public Timestamp getStartDate() {
        return startDate;
    }

    public void setStartDate(Timestamp startDate) {
        this.startDate = startDate;
    }

    public Timestamp getEndDate() {
        return endDate;
    }

    public void setEndDate(Timestamp endDate) {
        this.endDate = endDate;
    }

    @Override
    public String toString() {
        return "FinancialReportDateRangeParamsDTO{" +
                "hostId=" + hostId +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                '}';
    }
}
