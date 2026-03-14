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

// <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-6">
//           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <!-- First Name -->
//             <div class="space-y-2 relative group flex flex-col justify-end">
//               <label class="text-sm font-semibold text-gray-700">First Name <span class="text-red-500">*</span></label>
//               <div class="relative flex items-center h-[46px] w-full">
//                 <i
//                   class="fas fa-user absolute left-4 text-gray-400 group-focus-within:text-[#0a7e8d] transition-colors z-10"></i>
//                 <input type="text" formControlName="firstName" placeholder="John"
//                   class="w-full h-full pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a7e8d] focus:border-transparent transition-all shadow-sm m-0">
//               </div>
//             </div>

//             <!-- Last Name -->
//             <div class="space-y-2 relative group flex flex-col justify-end">
//               <label class="text-sm font-semibold text-gray-700">Last Name <span class="text-red-500">*</span></label>
//               <div class="relative flex items-center h-[46px] w-full">
//                 <i
//                   class="fas fa-user absolute left-4 text-gray-400 group-focus-within:text-[#0a7e8d] transition-colors z-10"></i>
//                 <input type="text" formControlName="lastName" placeholder="Doe"
//                   class="w-full h-full pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a7e8d] focus:border-transparent transition-all shadow-sm m-0">
//               </div>
//             </div>
//           </div>

//           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <!-- Username -->
//             <div class="space-y-2 relative group flex flex-col justify-end">
//               <label class="text-sm font-semibold text-gray-700">Username <span class="text-red-500">*</span></label>
//               <div class="relative flex items-center h-[46px] w-full">
//                 <i
//                   class="fas fa-at absolute left-4 text-gray-400 group-focus-within:text-[#0a7e8d] transition-colors z-10"></i>
//                 <input type="text" formControlName="username" placeholder="johndoe123"
//                   class="w-full h-full pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a7e8d] focus:border-transparent transition-all shadow-sm m-0">
//               </div>
//             </div>

//             <!-- Email Address -->
//             <div class="space-y-2 relative group flex flex-col justify-end">
//               <label class="text-sm font-semibold text-gray-700">Email Address <span
//                   class="text-red-500">*</span></label>
//               <div class="relative flex items-center h-[46px] w-full">
//                 <i
//                   class="fas fa-envelope absolute left-4 text-gray-400 group-focus-within:text-[#0a7e8d] transition-colors z-10"></i>
//                 <input type="email" formControlName="emailId" placeholder="john@example.com"
//                   class="w-full h-full pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a7e8d] focus:border-transparent transition-all shadow-sm m-0">
//               </div>
//             </div>
//           </div>

//           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <!-- Password -->
//             <div class="space-y-2 relative group flex flex-col justify-end">
//               <label class="text-sm font-semibold text-gray-700">Password <span class="text-red-500">*</span></label>
//               <div class="relative flex items-center h-[46px] w-full">
//                 <i
//                   class="fas fa-lock absolute left-4 text-gray-400 group-focus-within:text-[#0a7e8d] transition-colors z-10"></i>
//                 <input type="password" formControlName="password" placeholder="Enter password"
//                   class="w-full h-full pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a7e8d] focus:border-transparent transition-all shadow-sm m-0">
//               </div>
//             </div>

//             <!-- Mobile -->
//             <div class="space-y-2 relative group flex flex-col justify-end">
//               <label class="text-sm font-semibold text-gray-700">Mobile Number <span
//                   class="text-red-500">*</span></label>
//               <div class="relative flex items-center h-[46px] w-full">
//                 <i
//                   class="fas fa-phone absolute left-4 text-gray-400 group-focus-within:text-[#0a7e8d] transition-colors z-10"></i>
//                 <input type="tel" formControlName="mobileNumber" placeholder="+1 (555) 000-0000"
//                   class="w-full h-full pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a7e8d] focus:border-transparent transition-all shadow-sm m-0">
//               </div>
//             </div>
//           </div>

//           <!-- Submit Button -->
//           <div class="flex justify-center mt-6 pt-4">
//             <button type="submit" [disabled]="contactForm.invalid"
//               class="w-full md:w-2/3 max-w-sm py-3.5 px-6 bg-gradient-to-r from-[#003f4a] to-[#0a7e8d] text-white rounded-lg font-bold text-[16px] tracking-wide hover:shadow-xl hover:-translate-y-1 hover:brightness-110 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3">
//               <span>Send Message</span>
//               <i class="fas fa-paper-plane text-md"></i>
//             </button>
//           </div>
//         </form>