import { Component, OnInit } from '@angular/core';
import { AccommodationService } from '../accommodation.service';
import { HostListAccommodation } from '../model/host-list-accommodation.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-my-accommodations',
  templateUrl: './my-accommodations.component.html',
  styleUrls: ['./my-accommodations.component.css', '../../../styles.css']
})

export class MyAccommodationsComponent implements OnInit {

  accommodations: HostListAccommodation[];

  pending: HostListAccommodation[];

  noPendingMessage: string = '';
  noActiveMessage: string = '';

  constructor(private service: AccommodationService, private authService : AuthService) {
  }

  ngOnInit(): void {

    let userId = this.authService.getId();

    this.service.getForHost(userId).subscribe({
      next: (data: HostListAccommodation[]) => {
        this.accommodations = data;
        if (data.length==0) {
          this.noActiveMessage = "You have no active accommodations.\n"
        }
      },
      error: () => console.error("Error getting host's accommodations.")
    });

    this.service.getPendingForHost(userId).subscribe({
      next: (data: HostListAccommodation[]) => {
        this.pending = data;
        if (data.length==0) {
          this.noPendingMessage = "You have no pending accommodations.\n"
        }
      },
      error: () => console.error("Error getting host's pending accommodations.")
    });
    
  }

  reloadParent(id: number): void {
    this.ngOnInit();
  }


}
