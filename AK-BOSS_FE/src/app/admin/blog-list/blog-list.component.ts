import { Component, inject } from '@angular/core';
import { AdminSidebarComponent } from '../../shared/admin/admin-sidebar/admin-sidebar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [AdminSidebarComponent],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent {
routr = inject(Router)
  constructor() {

  }

  createNew() {
    this.routr.navigateByUrl('admin/blog')
  }
}
