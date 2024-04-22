import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Country } from 'src/app/shared/model/country';
import { ImageService } from 'src/app/image-management/image.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { Router } from '@angular/router';
import { EditUser } from '../model/edit-user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { SocketService } from 'src/app/shared/socket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CertificateRequestService } from 'src/app/security/certificate-request.service';
import { CertificateRequestNew } from 'src/app/security/model/certificate-request-new';
import { UserDataDTO } from 'src/app/shared/model/user-data-cert';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../../styles.css']
})
export class ProfileComponent implements OnInit {
  
  user: EditUser = {firstName: "", lastName: "", id: 0, country: Country.VATICAN_CITY, city: "", street: "", number: 0, phone: ""}

  username: string = this.authService.getUsername();
  
  imgPath: string= "";

  certificateText: string = "";
  certificateBtnEnabled = false;
  status = 8;

  role: string = "";

  constructor(private userService: UserService, private imageService: ImageService,
    private dialog: MatDialog, private router: Router, private authService: AuthService,
    private socketService: SocketService, private snackBar: MatSnackBar,
    private certificateRequestService: CertificateRequestService) {
  }


  ngOnInit(): void {
    
    this.role = this.authService.getRole();

    const id = this.authService.getId();
    this.userService.getUser(id).subscribe({
      
      next: (data: EditUser) => {
        this.user = data;
        this.imgPath = this.imageService.getPath(data.imageId, true);
        this.setCertificateBtn();
      },

      error: (_) => { console.log('Error in getUser'); }
    });

    

  }

  private setCertificateBtn() {
    this.certificateRequestService.getFor(this.user.id).subscribe({
      next: (status: number) => {
        this.status = status;

        if (this.status == 0) {
          this.certificateText = "Awaiting response";
          this.certificateBtnEnabled = false;
        }
        else if (this.status == 1) {
          this.certificateText = "Generate certificate";
          this.certificateBtnEnabled = true;
        }
        else {
          this.status = -1;
          this.certificateText = "Request certificate";
          this.certificateBtnEnabled = true;
        } 
      },
      error: () => console.log("error getting certificate request status")
    })

  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      question: "Are you sure you wish to delete your account?"
    }

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe({
      next: (answer: boolean) => {
        if (answer) this.onDelete();
      }
    })
  }

  onDelete(): void {
    this.userService.delete(this.user.id).subscribe({
      next: () => {
        console.log('Deleted user with id: ' + this.user.id);

        this.authService.logout();
        this.socketService.closeSockets();

        this.router.navigate(['home']);
      },
      error: (error) => {
        console.error(error.error.message);
        this.showSnackBar(error.error.message)
      }
    })
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  onCertificateBtnClicked(): void {
    if (this.status == 1) {
      let dto: UserDataDTO = {id: this.user.id, username: this.username,
                              firstName: this.user.firstName, lastName: this.user.lastName,
                              city: this.user.city, country: this.user.country};
      this.certificateRequestService.generate(dto).subscribe({
        next: ()=> {
          this.showSnackBar("Certificate generated");
          this.setCertificateBtn();
        },
        error: ()=> {console.log("error generating certificate")}
      })
    }
    else if (this.status == -1) {
      let dto: CertificateRequestNew = {userId: this.user.id, timestamp: new Date()};
      this.certificateRequestService.create(dto).subscribe({
        next: () => {
          this.showSnackBar("Request created");
          this.setCertificateBtn();
        },
        error: ()=> {console.log("error creating request")}
      })
    }
  }

}
