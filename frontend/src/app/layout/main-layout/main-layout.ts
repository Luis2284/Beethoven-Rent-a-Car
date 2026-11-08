import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NotificationService, AppNotification } from '../../services/notification.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayoutComponent implements OnInit {
  unreadCount = 0;
  notifications: AppNotification[] = [];

  isMobileMenuOpen = false;

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public themeService: ThemeService
  ) { }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe(data => {
      this.notifications = data;
      // Assume all are unread for now since 'read' prop is missing
      this.unreadCount = data.length;
      this.cdr.detectChanges();
    });
  }

  onNotificationClick(notification: AppNotification) {
    if (notification.link) {
      this.cloneMobileMenu();
      this.router.navigate([notification.link]);
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  cloneMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}
