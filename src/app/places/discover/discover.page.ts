import { AuthService } from './../../auth/auth.service';
import { Subscription } from 'rxjs';
import { Place } from './../place.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { SegmentChangeEventDetail } from '@ionic/core'
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedplaces: Place[];
  listedLoadedPlaces: Place[];
  relevantPlaces: Place[];
  private placesSub :  Subscription;

  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController,
    private authService : AuthService

    ) { }

  ngOnInit() {
    this.placesSub = this.placesService.Places.subscribe(places => {
      this.loadedplaces = places;
      this.relevantPlaces = this.loadedplaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });

  }

 onOpenMenu() {
   this.menuCtrl.toggle();
 }

  onFilterUpdate (event: CustomEvent<SegmentChangeEventDetail>) {
    if(event.detail.value === 'all') {
      this.relevantPlaces = this.loadedplaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    } else {
      this.relevantPlaces = this.loadedplaces.filter(
        place => place.userId !== this.authService.userId
      );
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }

  }
  ngOnDestroy() {
    if(this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }



}
