import { Subscription } from 'rxjs';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { BookingService } from './booking.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Booking } from './booking.model';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit,OnDestroy {
  loadedBookings : Booking[];
  private bookingSub : Subscription;

  constructor(
    private bookingService: BookingService,
    private loadingCtrl : LoadingController

    ) { }

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings
    })
  }

  onCancelBooking(bookingId: string, slindingEl: IonItemSliding) {
    slindingEl.close();
    this.loadingCtrl.create({
      message: 'Cancelling...'
    }).then
    (loadingEl => {
      loadingEl.present();
      this.bookingService.cancelBokking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
}

ngOnDestroy() {
  if (this.bookingSub) {
    this.bookingSub.unsubscribe();
  }
}

}
