import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  email: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    public authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit(): void {
  }

  // this will be executed when submit button is clicked
  onLoginSubmit() {
    const user = {
      email: this.email,
      password: this.password
    };

    // if logged in using admin as email password as password
    // this will serve as special command requesting the app to check if there users already
    // if there are no users the default info of the system admin will be registered
    // then the system admin will be able to login and go to user register page and register the other users
    

  
    // Required Fields
    let fields = [this.email, this.password];
    if(!this.validateService.validateRequired(fields)) {
      this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    

    // Validate Email
    // A special case for the email will be allowed
    // That is if the email is admin and password is password
    // This will serve as command to try check if there are any users in collection 
    // and make admin user if no user is found
    if(
      !this.validateService.validateEmail(user.email) &&
      !(user.email === "admin" && user.password === "password")
    ) {
      this.flashMessage.show('Please use a valid email', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    } 
    
    

    this.authService.authenticateUser(user).subscribe(data => {
      if((data as any).success) {
        if((data as any).token) {
          this.authService.storeUserData((data as any).token, (data as any).user);
          this.router.navigate(['/dashboard']);
        } 
        this.flashMessage.show((data as any).msg, {cssClass: 'alert-success', timeout: 5000});
      } else {
        this.flashMessage.show((data as any).msg, {cssClass: 'alert-danger', timeout: 5000});
      }
    });
  }
}
