import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AdminSidebarComponent } from '../../shared/admin/admin-sidebar/admin-sidebar.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingService } from '../../core/services/setting.service';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent,ReactiveFormsModule,FormsModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements OnInit {

private fb = inject(FormBuilder);
private settingService = inject(SettingService);
form!: FormGroup;
constructor() { }

ngOnInit(): void {
  this.initForm();
}

initForm(){
  this.form = this.fb.group({
  site: this.fb.group({
    name: [''],
    copyright: [''],
    phone: [''],
    email: [''],
    address: [''],
    mapIframe: [''],
    androidFile: [''],
    androidLink: [''],
    apiName: [''],
    apiLink: ['']
  }),

appearance: this.fb.group({
  primaryColor: ['#ec8737'],
  primaryTextColor: ['#ec8737'],
  secondaryColor: ['#ec8737'],
  tertiaryColor: ['#ec8737'],

  // 🔥 ADD THESE (IMPORTANT)
  siteLogo: [''],
  squareLogo: [''],
  panelLogo: [''],
  favicon: ['']
}),

  theme: this.fb.group({
    direction: [''],
    mode: ['']
  }),

  advanced: this.fb.group({
    timezone: [''],
    countryCode: [''],
    pagination: [20],
    debugMode: [false],
    landingPage: [false],
    forceSSL: [false]
  })
});
}

syncColor(field: string) {
  const value = this.form.get('appearance.' + field)?.value;
  this.form.get('appearance.' + field)?.setValue(value, { emitEvent: false });
}

resetColor(field: string) {
  const defaultColors: any = {
    primaryColor: '#ec8737',
    primaryTextColor: '#ec8737',
    secondaryColor: '#ec8737',
    tertiaryColor: '#ec8737'
  };

  this.form.get('appearance.' + field)?.setValue(defaultColors[field]);
}

upload(event: any, field: string) {
  const file = event.target.files[0];
 

  this.settingService.uploadFile(file).subscribe((res: any) => {

    const appearance = this.form.get('appearance')?.value;

    this.form.patchValue({
      appearance: {
        ...appearance,
        [field]: res.url
      }
    });

  });
}

onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const payload = this.form.value;

  console.log('🔥 FINAL JSON PAYLOAD:', payload);
}
}
