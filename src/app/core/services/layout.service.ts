import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private mobileMenuOpenSubject = new BehaviorSubject<boolean>(false);

  mobileMenuOpen$ = this.mobileMenuOpenSubject.asObservable();

  toggleMobileMenu(): void {
    this.mobileMenuOpenSubject.next(
      !this.mobileMenuOpenSubject.value
    );
  }

  closeMobileMenu(): void {
    this.mobileMenuOpenSubject.next(false);
  }
}