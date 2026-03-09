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
  
  getTeamClass(i: number): string {
    const row = Math.floor(i / 3);
    const col = i % 3;
    return (row + col) % 2 === 0 ? 'dark' : 'light';
  }

  featuredBlogs = [
    {
      category: 'Collaboration',
      title: 'Optimizing Workflow Processes for Maximum Efficiency',
      desc: 'Understand the importance of streamlining workflow processes to enhance collaboration, save time, and boost performance.',
      author: 'Joel Kenley',
      date: '8 Min Read',
      image: 'https://picsum.photos/seed/blog1/400/250'
    },
    {
      category: 'Productivity',
      title: 'Optimizing Workflow Processes for Maximum Efficiency',
      desc: 'Understand the importance of streamlining workflow processes to enhance collaboration, save time, and boost performance.',
      author: 'Joel Kenley',
      date: '8 Min Read',
      image: 'https://picsum.photos/seed/blog2/400/250'
    },
    {
      category: 'Strategies',
      title: 'Optimizing Workflow Processes for Maximum Efficiency',
      desc: 'Understand the importance of streamlining workflow processes to enhance collaboration, save time, and boost performance.',
      author: 'Joel Kenley',
      date: '8 Min Read',
      image: 'https://picsum.photos/seed/blog3/400/250'
    }
  ];

  topBlogs = [
    {
      category: 'Collaboration',
      title: 'Managing Stakeholder Expectations for Project Success',
      date: '8 Min Read',
      image: 'https://picsum.photos/seed/top1/200/120'
    },
    {
      category: 'Collaboration',
      title: 'Managing Stakeholder Expectations for Project Success',
      date: '12 Min Read',
      image: 'https://picsum.photos/seed/top2/200/120'
    }
  ];

  mainTopBlog = {
    category: 'Collaboration',
    title: 'Creating Effective Project Roadmaps for Success',
    desc: 'Learn how to develop comprehensive project roadmaps that provide clear direction, outline key milestones, and enhance team alignment.',
    author: 'Joel Kenley',
    date: '8 Min Read',
    image: 'https://picsum.photos/seed/main/600/400'
  };

  latestInsights = [
    {
      category: 'Collaboration',
      title: 'Optimizing Workflow Processes for Maximum Efficiency',
      desc: 'Understand the importance of streamlining workflow processes to enhance collaboration, save time, and boost performance.',
      author: 'Joel Kenley',
      date: '8 Min Read',
      image: 'https://picsum.photos/seed/insight1/400/250'
    },
    {
      category: 'Productivity',
      title: 'Optimizing Workflow Processes for Maximum Efficiency',
      desc: 'Understand the importance of streamlining workflow processes to enhance collaboration, save time, and boost performance.',
      author: 'Joel Kenley',
      date: '8 Min Read',
      image: 'https://picsum.photos/seed/insight2/400/250'
    },
    {
      category: 'Strategies',
      title: 'Optimizing Workflow Processes for Maximum Efficiency',
      desc: 'Understand the importance of streamlining workflow processes to enhance collaboration, save time, and boost performance.',
      author: 'Joel Kenley',
      date: '8 Min Read',
      image: 'https://picsum.photos/seed/insight3/400/250'
    },
    {
      category: 'Collaboration',
      title: 'Optimizing Workflow Processes for Maximum Efficiency',
      desc: 'Understand the importance of streamlining workflow processes to enhance collaboration, save time, and boost performance.',
      author: 'Joel Kenley',
      date: '8 Min Read',
      image: 'https://picsum.photos/seed/insight4/400/250'
    },
    {
      category: 'Productivity',
      title: 'Optimizing Workflow Processes for Maximum Efficiency',
      date: '8 Min Read',
      image: 'https://picsum.photos/seed/insight5/400/250'
    },
    {
      category: 'Strategies',
      title: 'Optimizing Workflow Processes for Maximum Efficiency',
      date: '8 Min Read',
      image: 'https://picsum.photos/seed/insight6/400/250'
    }
  ];

  teamMembers = [
    { name: 'Joel Kenley', role: 'Web Designer', desc: 'Innovative manager driving product development with a focus on user-centric project solutions.', image: 'https://i.pravatar.cc/150?u=joel' },
    { name: 'Joel Kenley', role: 'Web Designer', desc: 'Innovative manager driving product development with a focus on user-centric project solutions.', image: 'https://i.pravatar.cc/150?u=kenley' },
    { name: 'Joel Kenley', role: 'Web Designer', desc: 'Innovative manager driving product development with a focus on user-centric project solutions.', image: 'https://i.pravatar.cc/150?u=joel2' },
    { name: 'Joel Kenley', role: 'Web Designer', desc: 'Innovative manager driving product development with a focus on user-centric project solutions.', image: 'https://i.pravatar.cc/150?u=kenley2' },
    { name: 'Joel Kenley', role: 'Web Designer', desc: 'Innovative manager driving product development with a focus on user-centric project solutions.', image: 'https://i.pravatar.cc/150?u=joel3' },
    { name: 'Joel Kenley', role: 'Web Designer', desc: 'Innovative manager driving product development with a focus on user-centric project solutions.', image: 'https://i.pravatar.cc/150?u=kenley3' }
  ];

 }
