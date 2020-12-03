import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  firstname: String;
  lastname: String;
  suffix: String;
  license: String;
  email: String;
  password: String;
  role: String;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit(): void {
    // request 
  }

  onRegisterSubmit() {
    const user = {
      firstname: this.firstname,
      lastname: this.lastname,
      suffix: this.suffix,
      license: this.license,
      email: this.email,
      password: this.password,
      role: "System Administrator"
    };

    // Required Fields
    let fields = [
      this.firstname, this.lastname,
      this.email, this.password
    ];
    if(!this.validateService.validateRequired(fields)) {
      this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Validate Email
    if(!this.validateService.validateEmail(user.email)) {
      this.flashMessage.show('Please use a valid email', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Register User
    this.authService.registerUser(user).subscribe(
      data => {
        if((data as any).success) {
          this.flashMessage.show('You are now registered and can log in', {cssClass: 'alert-success', timeout: 3000});
          this.router.navigate(['/login']);
        } else {
          this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
          this.router.navigate(['/register']);
        }
      }
    );
  }
}
