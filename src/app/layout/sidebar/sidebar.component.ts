
import { Component } from '@angular/core';

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
      label: 'Report',
      icon: '▤',
      route: '/reports'
    },
    {
      label: 'Impostazioni',
      icon: '⚙',
      route: '/settings'
    }
  ];

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
