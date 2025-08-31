import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangesPwdComponent } from './changes-pwd.component';

describe('ChangesPwdComponent', () => {
  let component: ChangesPwdComponent;
  let fixture: ComponentFixture<ChangesPwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangesPwdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangesPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
