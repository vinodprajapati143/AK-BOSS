import { Component, inject } from '@angular/core';
import { AdminSidebarComponent } from '../../shared/admin/admin-sidebar/admin-sidebar.component';
import { Router } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [AdminSidebarComponent,CommonModule,FormsModule],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent {
routr = inject(Router)
blogservice = inject(BlogService);
toastr = inject(ToastrService)
  constructor() {
  this.loadBlogs();
  }

  blogs: any[] = [];
pagination: any;
isLoading = false;

loadBlogs(page: number = 1) {
  this.isLoading = true;

  this.blogservice.getBlogs({ page, limit: 10 }).subscribe({
    next: (response: any) => {
      this.blogs = response.data;
      this.pagination = response.pagination;

      console.log('Blogs:', response);
      this.isLoading = false;
    },

    error: (error) => {
      console.error('Error fetching blogs:', error);

      this.toastr.error(
        error?.error?.message || 'Failed to load blogs'
      );

      this.isLoading = false;
    }
  });
}

toggleStatus(blog: any) {
  const newStatus = blog.status == 1 ? 0 : 1;

  // this.blogservice.updateStatus(blog.id, { status: newStatus })
  //   .subscribe({
  //     next: () => {
  //       blog.status = newStatus;
  //       this.toastr.success('Status updated');
  //     },
  //     error: (err) => {
  //       this.toastr.error(err?.error?.message || 'Failed to update status');
  //     }
  //   });
}

deleteBlog(id: number) {
  if (!confirm('Are you sure you want to delete this blog?')) return;

  // this.blogservice.deleteBlog(id).subscribe({
  //   next: () => {
  //     this.toastr.success('Blog deleted');
  //     this.loadBlogs();
  //   },
  //   error: (err) => {
  //     this.toastr.error(err?.error?.message || 'Delete failed');
  //   }
  // });
}

editBlog(blog: any) {
  console.log('Edit blog:', blog);
  // future → route to edit page
}

  createNew() {
    this.routr.navigateByUrl('admin/blog')
  }
}
