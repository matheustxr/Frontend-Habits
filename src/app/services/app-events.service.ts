import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ModalType = 'auth' | 'profile' | 'change-password' | 'habit';

@Injectable({
  providedIn: 'root'
})
export class AppEventsService {
  private formSuccessSource = new Subject<void>();
  public formSuccess$ = this.formSuccessSource.asObservable();

  private modalRequestSource = new Subject<ModalType>();
  public modalRequest$ = this.modalRequestSource.asObservable()

  public notifyFormSuccess(): void {
    this.formSuccessSource.next();
  }

  public requestModal(type: ModalType): void {
    this.modalRequestSource.next(type);
  }
}
