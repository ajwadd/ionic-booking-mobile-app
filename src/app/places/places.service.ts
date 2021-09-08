import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


interface PlaceData {
availableFrom: string;
availableTo: string;
imageUrl: string;
description: string;
price: number;
title: string;
userId: string;

}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([])

  get Places() {
    return this._places.asObservable();
  }

  constructor(
    private authService : AuthService,
    private http : HttpClient

    ) { }

    fetchPlaces() {
     return this.http
      .get<{[key: string]: PlaceData}>('https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg/offered-places.json')
      .pipe(map(resData => {
        const places = [];
        for (const key in resData) {
          if(resData.hasOwnProperty(key)) {
            places.push(
              new Place(
                key,
                resData[key].title,
                resData[key].description,
                resData[key].imageUrl,
                resData[key].price,
                new Date(resData[key].availableFrom),
                new Date(resData[key].availableTo),
                resData[key].userId
              )
            );
          }
        }
        return places;

      }),
      tap(places => {
        this._places.next(places);
      })
      );
    }

  getPlace(id: string) {
    return this.Places.pipe(
     take(1),
     map(places => {
       return {...places.find(p => p.id === id) };
     })
     );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date ) {
    let generatedId: string;
    const newPlace = new Place(
     Math.random().toString(),
     title,
     description,
     'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
     price,
     dateFrom,
     dateTo,
     this.authService.userId
    );
    return this.http.post<{name : string}>('https://ionic-angular-course-29a2d-default-rtdb.firebaseio.com/offred-places.json', {
      ...newPlace, id : null
    })
    .pipe(
      switchMap(resData => {
        generatedId = resData.name;
        return  this.Places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
         this._places.next(places.concat(newPlace));
        })
      );

    // return this.Places.pipe(
    // take(1),
    // delay(1000),
    // tap(places => {
    //     this._places.next(places.concat(newPlace));
    // })
    // );
};

updatePlace(placeId: string, title: string, description: string) {
  return this.Places.pipe(take(1),delay(1000), tap(places => {
    const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId );
    const updatedPlaces = [...places];
    const oldPlace = updatedPlaces[updatedPlaceIndex];
    updatedPlaces[updatedPlaceIndex] = new Place(
        oldPlace.id,
        title,
        description,
        oldPlace.imageUrl,
        oldPlace.price,
        oldPlace.availableFrom,
        oldPlace.availableTo,
        oldPlace.userId
        );
        this._places.next(updatedPlaces);
  })

  )
}

}
