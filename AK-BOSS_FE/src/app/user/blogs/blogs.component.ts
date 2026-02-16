import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent {
  tabs = ['All', 'Task', 'Collaboration', 'Productivity', 'Strategies'];
  activeTab = 'All';
  
  blogs = [
    { title: 'Optimizing Workflow Processes', desc: 'Improve efficiency...' },
    { title: 'Managing Stakeholders', desc: 'Build trust...' },
    { title: 'Creative Thinking', desc: 'Boost innovation...' }
  ];

   setTab(tab: string) {
    this.activeTab = tab;
  }
}
