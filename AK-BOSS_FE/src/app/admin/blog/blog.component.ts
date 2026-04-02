import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdminSidebarComponent } from '../../shared/admin/admin-sidebar/admin-sidebar.component';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlogResponse, BlogService } from '../../core/services/blog.service';
import { environment } from '../../../environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

 

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [AdminSidebarComponent, CKEditorModule,FormsModule,CommonModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent  implements OnInit {
public Editor: any = ClassicEditor;
  public blogContent = '';
  @ViewChild('fileInput') fileInput!: ElementRef;
 
  public config = {
  toolbar: [
    'heading', '|',
    'bold', 'italic', 'link',
    'bulletedList', 'numberedList',
    '|',
    'imageUpload',
    'blockQuote',
    'undo', 'redo'
  ]
};
title: string = '';
subDescription: string = '';
selectedFile: File | null = null;
private baseUrl = environment.apiUrl;
isLoading: boolean | undefined;
isEditMode: boolean | undefined;
imagePreview: string | ArrayBuffer | null = null;
  showImageModal: boolean = false;

  constructor(private blogService: BlogService, private toastr: ToastrService, private route: ActivatedRoute) { }

  onFileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

uploadAdapter(loader: any) {
  return {
    upload: () => {
      return loader.file.then((file: File) => {

        const formData = new FormData();
        formData.append('file', file);

        return fetch(`${this.baseUrl}/api/upload`, {
          method: 'POST',
          body: formData
        })
        .then(res => res.json())
       .then(result => {
        if (!result.url) {
          throw new Error('Upload failed');
        }
        return {
          default: result.url
        };
      });

      });
    }
  };
}
onReady(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return this.uploadAdapter(loader);
  };
}

ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');

  if (id) {
    this.isEditMode = true;
    this.getBlogById(id);
  }
}

getBlogById(id: any) {
this.blogService.getBlogById(id).subscribe(res => {
  this.title = res.data.title;
  this.subDescription = res.data.subDescription;
  this.selectedFile = res.data.image ? { name: 'Current Image', type: 'image/*' } as File : null; // placeholder file
  if (res.data.image) {
    this.imagePreview = res.data.image; // res.data.image is expected to be the image URL
  }
  this.blogContent = res.data.description; // CKEditor bind 🔥
});
}
onSubmit() {
  // ✅ Validation
  if (!this.title || !this.blogContent) {
    this.toastr.warning('Title and description are required');
    return;
  }

  const title = this.title.trim();
  const subDescription = this.subDescription?.trim();
  const description = this.blogContent.trim();

  // ✅ Image validation
  if (this.selectedFile) {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (!allowedTypes.includes(this.selectedFile.type)) {
      this.toastr.error('Only JPG, PNG images allowed');
      return;
    }

    if (this.selectedFile.size > 2 * 1024 * 1024) {
      this.toastr.error('Image size should be less than 2MB');
      return;
    }
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('subDescription', subDescription || '');
  formData.append('description', description);

  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

  this.isLoading = true;

  this.blogService.createBlog(formData).subscribe({
    next: (res: BlogResponse) => {
      this.toastr.success(res?.message || 'Blog Created Successfully 🔥');

      // reset form
      this.title = '';
      this.subDescription = '';
      this.blogContent = '';
      this.selectedFile = null;
      this.imagePreview = null;
      this.fileInput.nativeElement.value = '';

      this.isLoading = false;
    },

    error: (err) => {
      console.error('Create Blog Error:', err);

      // 🔥 Main logic (server message show)
      let errorMessage = 'Something went wrong. Please try again.';

      if (err?.error?.message) {
        errorMessage = err.error.message;
      } else if (err?.status === 0) {
        errorMessage = 'Unable to connect to server';
      } else if (err?.status === 500) {
        errorMessage = 'Internal server error';
      }

      this.toastr.error(errorMessage);

      this.isLoading = false;
    }
  });
}

toggleImageModal() {
  this.showImageModal = !this.showImageModal;
}
}
