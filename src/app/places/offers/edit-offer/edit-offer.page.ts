import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Place } from './../../place.model';
import { NavController, LoadingController } from '@ionic/angular';
import { PlacesService } from './../../places.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form : FormGroup;
  private placesSub : Subscription;


  constructor(private route: ActivatedRoute,
              private placesService : PlacesService,
              private navCtrl: NavController,
              private router : Router,
              private loadingCtrl : LoadingController
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
       this.placesSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
         this.place = place;
        this.form = new FormGroup({
          title: new FormControl(this.place.title, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          description: new FormControl(this.place.desciption, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(180)]
          })
      })
       });

    })
  }

  onUpdateOffer() {
    if(!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Updating place...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.updatePlace(
        this.place.id,
        this.form.value.title,
        this.form.value.description,
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/places/tabs/offers']);
      })
    })

  }
  ngOnDestroy() {
    if(this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
