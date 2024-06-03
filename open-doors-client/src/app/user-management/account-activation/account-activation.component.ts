import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.css']
})
export class AccountActivationComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  outcomeMessage : string = '';
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const timestamp : number = +params['timestamp'];
      const now : Date = new Date();
      const difference = now.getTime()-timestamp;
      console.log(difference);
      if(difference > 1000 * 60 * 60 * 24){ // milliseconds to one day = 1000 * 60 * 60 * 24
        this.outcomeMessage = "Your account activation has expired. Please redo the registration process."
        return;
      }
      const id: string = params['id'];
      if (id) {
        this.userService.activateUser(new URL(window.location.href).hostname,id).subscribe(
          next => {
            this.outcomeMessage = ("Your account has been activated successfully!");
          },
          error => {
            console.log(error);
            this.outcomeMessage = "Your account has not been found in our database."
          }
        );
      }
    });
  }
}