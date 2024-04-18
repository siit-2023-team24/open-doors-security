import { Component, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {
  private map: L.Map;
  coordinates : string;
  
  @Input() accommodationAddress: string;

  constructor(private mapService: MapService) {}

  private initMap(): void {
    this.map = L.map('map', {
      center: [45.2396, 19.8227],
      zoom: 13,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
  }

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
    this.search(this.accommodationAddress);
  }
  
  search(address : string): void {
    this.mapService.search(address).subscribe({
      next: (result) => {
        console.log(address);
        console.log(result);
        this.map.eachLayer(layer => {
          if (layer instanceof L.Marker) {
            this.map.removeLayer(layer);
          }
        });
        L.marker([result[0].lat, result[0].lon])
          .addTo(this.map)
          .bindPopup(address)
          .openPopup();
        this.coordinates = result[0].lat + " " + result[0].lon;
        this.map.setView([result[0].lat, result[0].lon], 13);
        },
      error: () => {},
    });
  }  
  
}