import { Component } from '@angular/core';
import { AdminSidebarComponent } from '../../shared/admin/admin-sidebar/admin-sidebar.component';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../core/services/blog.service';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [AdminSidebarComponent, CKEditorModule,FormsModule,CommonModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {
public Editor: any = ClassicEditor;
  public blogContent = '';
 
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
selectedFile: File | null = null;
  private baseUrl = environment.apiUrl;

constructor(private blogService: BlogService) {}

onFileChange(event: any) {
  this.selectedFile = event.target.files[0];
}

uploadAdapter(loader: any) {
  return {
    upload: () => {
      return loader.file.then((file: File) => {

        const formData = new FormData();
        formData.append('file', file);

        return fetch(`${this.baseUrl}/upload`, {
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
onSubmit() {
  const formData = new FormData();

  formData.append('title', this.title);
  formData.append('description', this.blogContent);

  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

  this.blogService.createBlog(formData).subscribe({
    next: (res) => {
      alert('Blog Created 🔥');
       this.title = '';
  this.blogContent = '';
  this.selectedFile = null;
    },
    error: (err) => {
      console.error(err);
    }
  });
}
}
