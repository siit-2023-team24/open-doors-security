import { Component } from '@angular/core';
import { UserReportDTO } from '../model/user-report';
import { UserReportService } from '../user-report.service';
import { UserSummary } from '../model/user-summary';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-reports',
  templateUrl: './user-reports.component.html',
  styleUrls: ['./user-reports.component.css']
})
export class UserReportsComponent {

  reports: UserReportDTO[] = [];
  noDataMessage: string = "";

  blockedUsers: UserSummary[] = [];
  noBlockedMessage: string = "";

  constructor(private reportService: UserReportService,
              private userService: UserService) {}

  ngOnInit(): void {
    this.reportService.getAll().subscribe({
      next: (data: UserReportDTO[]) => {
        this.reports = data;
        if (data.length == 0) 
          this.noDataMessage = "There are no user reports right now";
        else
          this.noDataMessage = "";
      },
      error: () => console.error("Error getting user reports")
    });

    this.userService.getBlocked().subscribe({
      next: (data: UserSummary[]) => {
        this.blockedUsers = data;
        if (data.length == 0)
          this.noBlockedMessage = "There are no blocked users right now";
        else
          this.noBlockedMessage = "";
      },
      error: () => console.error("Error getting users")
    })
  }

  reloadParent(id: number): void {
    this.ngOnInit();
  }

}
