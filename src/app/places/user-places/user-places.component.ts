import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { PlacesService } from '../places.service';
import { signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  private placeService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);
  isFetching = signal(false);
  error = signal('');
  places = this.placeService.loadedUserPlaces

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placeService.loadUserPlaces()
      .subscribe({
        error: (error: Error) => {
          this.error.set(error.message);
        },
        complete: () => {
          this.isFetching.set(false);
        }
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onRemovePlace(place: Place) {
    const subscription = this.placeService.removeUserPlace(place).subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
