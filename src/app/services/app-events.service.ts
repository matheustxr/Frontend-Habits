import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppEventsService {
  private formSuccessSource = new Subject<void>();

  public formSuccess$ = this.formSuccessSource.asObservable();

  public notifyFormSuccess(): void {
    this.formSuccessSource.next();
  }
}
