import { Component, inject } from '@angular/core';
import { SettingService } from '../../core/services/setting.service';

@Component({
  selector: 'app-blog-detalis',
  standalone: true,
  imports: [],
  templateUrl: './blog-detalis.component.html',
  styleUrl: './blog-detalis.component.scss'
})
export class BlogDetalisComponent {
  private settingStore = inject(SettingService);
  sitename: any;
  copyright: any;

  ngOnInit(): void {
    this.settingStore.getSite().subscribe(res => {
      if (res) {
        this.sitename = res.name || 'AK-BOSS';
        this.copyright = res.copyright || '';
      }
    });
  }
}
