
import { Component } from '@angular/core';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  isCollapsed = false;

menuItems = [
  {
    label: 'Spese',
    icon: '◫',
    route: '/expenses'
  },
  {
    label: 'Import',
    icon: '⇧',
    route: '/import'
  }
];

  mobileMenuOpen$ = this.layoutService.mobileMenuOpen$;

constructor(private layoutService: LayoutService) {}

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  closeMobileMenu(): void {
    this.layoutService.closeMobileMenu();
  }
}
