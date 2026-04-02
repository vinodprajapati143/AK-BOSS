import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Create the reactive form with requested fields
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9+() -]+$')]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const v = this.contactForm.value;
      const adminEmail = 'vinodpraja075@gmail.com';
      const subject = `New Contact Request from ${v.firstName} ${v.lastName}`;
      const body = `Welcome to AK Boss
      
        Contact Request Details:
        ----------------------------------
        First Name: ${v.firstName}
        Last Name: ${v.lastName}
        Username: ${v.username}
        Email ID: ${v.emailId}
        Password: ${v.password}
        Mobile Number: ${v.mobileNumber}
        ----------------------------------`;

      const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open email client with prefilled data
      window.location.href = mailtoLink;

      // Show success alert
      Swal.fire({
        title: 'Form Prepared!',
        text: 'Your email client has been opened to send the message. Make sure to click Send!',
        icon: 'success',
        confirmButtonColor: '#0a7e8d'
      });

      this.contactForm.reset();
    } else {
      // Show form validation error
      Swal.fire({
        title: 'Error!',
        text: 'Please fill all the required fields correctly.',
        icon: 'error',
        confirmButtonColor: '#e74c3c'
      });
      this.contactForm.markAllAsTouched();
    }
  }
}
