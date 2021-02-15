import { Component, OnInit } from '@angular/core'
import { ValidateService } from '../../services/validate.service'
import { AuthService } from '../../services/auth.service'
import { FlashMessagesService } from 'angular2-flash-messages'
import { Router } from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  firstname: String;
  middlename: String;
  lastname: String;
  dateOfBirth: String;
  email: String;
  role: String;
  gender: String;
  address: String;

  constructor (
      private validateService: ValidateService,
      private authService: AuthService,
      private router: Router,
      private flashMessage: FlashMessagesService
  ) { }

  ngOnInit (): void {
    // request
  }

  onRegisterSubmit () {
    const user = {
      firstname: this.firstname,
      middlename: this.middlename,
      lastname: this.lastname,
      dateOfBirth: this.dateOfBirth,
      email: this.email,
      role: this.role,
      gender: this.gender,
      address: this.address
    }

    // Required Fields
    const fields = [
      this.firstname, this.middlename, this.lastname,
      this.dateOfBirth,
      this.email, this.role,
      this.gender, this.address
    ]
    if (!this.validateService.validateRequired(fields)) {
      this.flashMessage.show('Please fill in all fields', { cssClass: 'alert-danger', timeout: 3000 })
      return false
    }

    // Validate Email
    if (!this.validateService.validateEmail(user.email)) {
      this.flashMessage.show('Please use a valid email', { cssClass: 'alert-danger', timeout: 3000 })
      return false
    }

    // Register User
    this.authService.registerUser(user).subscribe(
      data => {
        if ((data as any).success) {
          this.flashMessage.show('User is now registered', { cssClass: 'alert-success', timeout: 3000 })
          this.router.navigate(['/register'])
        } else {
          this.flashMessage.show((data as any).msg, { cssClass: 'alert-danger', timeout: 3000 })
          this.router.navigate(['/register'])
        }
      }
    )
  }
}
