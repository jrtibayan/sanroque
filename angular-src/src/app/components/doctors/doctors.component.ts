import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.sass']
})
export class DoctorsComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    let query = {firstname:"Jeric"};
    this.http.post('http://localhost:3000/doctors/list', query).subscribe(res => {
      let doctors = {} as any;
      doctors = res;
      console.log(doctors);
    }, err => {
      console.log(err);
      return false
    });
  }

}
