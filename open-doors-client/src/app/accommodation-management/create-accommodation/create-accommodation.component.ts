import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AccommodationService } from '../accommodation.service';
import { Country } from 'src/app/shared/model/country';
import { AccommodationWhole } from '../model/accommodation-whole.model';
import { Amenity } from 'src/app/accommodation-management/model/amenity';
import { DateRange } from '../model/date-range.model';
import { SeasonalRate } from '../model/seasonal-rate.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { MapViewComponent } from '../map-view/map-view.component';
import { Image } from '../model/image.model';
import { ImageService } from 'src/app/image-management/image.service';
import { AccommodationWholeEdited } from '../model/accommodation-whole-edited-model';
import { AccommodationType } from 'src/app/accommodation-management/model/accommodation-type';
import { MatSnackBar } from '@angular/material/snack-bar';

const minMaxValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const minControl = control.get('minGuests');
  const maxControl = control.get('maxGuests');

  if (minControl && maxControl && minControl.value > maxControl.value) {
    if (maxControl.errors) {
      maxControl.setErrors({ ...maxControl.errors, minMaxMismatch: true });
    } else {
      maxControl.setErrors({ minMaxMismatch: true });
    }
    return { minMaxMismatch: true };
  } else {
    if (maxControl) {
      maxControl.setErrors(null);
    }
    return null;
  }
};

@Component({
  selector: 'app-create-accommodation',
  templateUrl: './create-accommodation.component.html',
  styleUrls: ['./create-accommodation.component.css', '../../../styles.css']
})
export class CreateAccommodationComponent {

  @ViewChild(MapViewComponent) mapComponent: MapViewComponent;

  id: number | undefined;
  accommodationId: number | undefined;

  page = 1;

  countries = Object.values(Country);
  types = Object.values(AccommodationType);
  amenities = Object.values(Amenity);
  selectedAmenities : string[] = [];
  
  seasonalRatePrice : number = 0;
  priceDates : Date[] = [];
  priceValues : Map<Date, number> = new Map();
  seasonalRates : SeasonalRate[];
  priceError : string = '';

  availabilityMessage : string = "Click a date to choose the start of an available period.";
  isSelecting : boolean = false;
  availableRangeStart : Date;
  availableDates : Date[] = [];
  availability : DateRange[] = [];

  accommodationForm: FormGroup;

  selectedFiles: File[] = []; //new images
  currentImages: number[] = [];  //current images
  toDeleteImages: number[] = [];  //images to delete

  address: string = "";
  coordinates: string = "";

  ngOnInit(): void {
    this.route.params.subscribe((params) => {

      console.log(params);

      this.id = +params['id'];
      this.accommodationId = +params['accommodationId'];

      if (this.id) {   //editing pending accommodation
        this.service.getPending(this.id).subscribe({
          next: (data: AccommodationWhole) => {
            if (data.hostUsername!=this.authService.getUsername())  {
              this.router.navigate(['home']);
              return;
            }
            this.fillForm(data);
          },
          error: () => {
            console.error("Error getting pending accommodation with id: " + this.id)
            this.router.navigate(['home']);
          }
        })
        
      } else if (this.accommodationId) {  //edit active
        this.service.getEditable(this.accommodationId).subscribe({
          next: (data: AccommodationWhole) => {
            if (data.hostUsername!=this.authService.getUsername())  {
              this.router.navigate(['home']);
              return;
            }
            this.fillForm(data);
          },
          error: () => {
            console.error("Error getting active accommodation with id: " + this.accommodationId);
            this.router.navigate(['home'])
          }
        })
      }
      
    })
  }

  fillForm(data: AccommodationWhole): void {
    console.log(data);

    this.currentImages = data.images;
    this.accommodationForm.patchValue(data);
    this.selectedAmenities = data.amenities;
    this.retrieveAvailability(data.availability);
    this.retrieveSeasonalRates(data.seasonalRates);
    this.updateAddress();
  }

  onFileChanged(event: any) {
      const files: FileList = event.target.files;
      if (files && files.length > 0) {
          for (let i = 0; i < files.length; i++) {
              this.selectedFiles.push(files[i]);
          }
      }
  }

  updateAddress() {
    this.address = this.accommodationForm.value.street + ' ' +
                  this.accommodationForm.value.number + ', ' +
                  this.accommodationForm.value.city + ', ' +
                  this.accommodationForm.value.country;
    console.log(this.accommodationForm.value.country);

    if (this.mapComponent) {
      this.mapComponent.search(this.address);
      this.coordinates = this.mapComponent.coordinates;
    }
   }

  availableDateSelected(date: Date) {
    const dateIndex = this.availableDates.findIndex(
      (selectedDate) => selectedDate.getTime() === date.getTime()
    );
    
    if (this.isSelecting) {
      if(date.getTime() < this.availableRangeStart.getTime()) {
        this.availabilityMessage = "Please select a date equal to or after the starting date of the available period: " + this.availableRangeStart.toDateString();
        return;
      }

      if (dateIndex != -1) {
        this.availabilityMessage = "Date " + date.toDateString() + " is already marked as available. Please select a different date for the end of the available period starting with " + this.availableRangeStart.toDateString() + ".";
        return;
      }

      this.isSelecting = false;
      this.availabilityMessage = "Accommodation is available from " + this.availableRangeStart.toDateString() + " to " + date.toDateString() + ".";
      this.populateWithDates(this.availableRangeStart, date);
    }
    else {
      if (dateIndex != -1) {
        this.availabilityMessage = "Date " + date.toDateString() + " deleted.";
        this.availableDates.splice(dateIndex, 1);
      }
      else {
        this.isSelecting = true;
        this.availabilityMessage = "Date " + date.toDateString() + " selected as start of available period. Please select the end of the available period.";
        this.availableRangeStart=date;
        return;
      }
    }
    console.log(this.availableDates);
    this.generateAvailability();
  }

  populateWithDates(startDate : Date, endDate : Date) {
    let counterDate = new Date(startDate);
    while (counterDate.getTime() <= endDate.getTime()) {
      let dateIndex = this.availableDates.findIndex(
        (selectedDate) => selectedDate.getTime() === counterDate.getTime()
      );
      if (dateIndex === -1) { 
        this.availableDates.push(new Date(counterDate));
      }
      counterDate.setDate(counterDate.getDate() + 1);
    }
    console.log(this.availableDates);
  }
  
  createDateRange(startDate: Date, endDate: Date): DateRange {
    return { startDate, endDate };
  }

  generateAvailability() {
    this.availability = []
    if (this.availableDates.length==0) return;
    this.availableDates.sort((a, b) => a.getTime() - b.getTime());
    let i = 0;
    let j = 0;
    while (i<this.availableDates.length) {
      while(j<this.availableDates.length && this.areDatesWithinRange(this.availableDates, i,j)) {
        j++;
      }
      this.availability.push(this.createDateRange(this.availableDates[i], this.availableDates[j-1]));
      i=j;
    }
    console.log(this.availability);
  }

  areDatesWithinRange(dates: Date[], i: number, j: number) : boolean {
    const range = 1000 * 60 * 60 * 24 * (j-i);
    return (dates[j].getTime() - dates[i].getTime() <= range);
  }


  retrieveAvailability(availability: DateRange[]) {
    this.availability = availability;
    for(let period of availability){
      let startDate = new Date(period.startDate);
      let endDate = new Date(period.endDate);
      let counterDate = new Date(startDate);

      while (counterDate.getTime() <= endDate.getTime()) {
          this.availableDates.push(new Date(counterDate));
          counterDate.setDate(counterDate.getDate() + 1);
      }
    }
  }


  priceDateSelected(date: Date) {
    if(this.seasonalRatePrice===null || this.seasonalRatePrice<0) {
      this.priceError = 'Please enter a non-negative monetary value for the seasonal rate.'
      return;
    }
    this.priceError='';
    const dateIndex = this.priceDates.findIndex(
      (selectedDate) => selectedDate.getTime() === date.getTime()
    );
    if (dateIndex === -1) {
      
      this.priceValues.set(date, this.seasonalRatePrice)
      this.priceDates.push(date);
    } else {
      this.priceValues.delete(date);
      this.priceDates.splice(dateIndex, 1);
    }
    console.log(this.priceDates);
    this.generateSeasonalRates();
  }

  areSamePrice(i: number, j: number) : boolean {
    return this.priceValues.get(this.priceDates[i])==this.priceValues.get(this.priceDates[j]);
  }

  createSeasonalRate(startDate: Date, endDate: Date, price : number | undefined): SeasonalRate {
    let period : DateRange = this.createDateRange(startDate, endDate);
    if (price === undefined){
      price = 0;
    }
    return { period, price };
  }

  generateSeasonalRates() {
    this.seasonalRates = []
    if (this.priceDates.length==0) return;
    this.priceDates.sort((a, b) => a.getTime() - b.getTime());
    let i = 0;
    let j = 0;
    while (i<this.priceDates.length) {
      while(j<this.priceDates.length && this.areDatesWithinRange(this.priceDates, i,j) && this.areSamePrice(i,j)) {
        j++;
      }
      this.seasonalRates.push(this.createSeasonalRate(this.priceDates[i], this.priceDates[j-1], this.priceValues.get(this.priceDates[i])));
      i=j;
    }
    console.log(this.seasonalRates);
  }

  retrieveSeasonalRates(seasonalRates: SeasonalRate[]) {
    this.seasonalRates = seasonalRates;
    for(let seasonalRate of seasonalRates){
      let startDate = new Date(seasonalRate.period.startDate);
      let endDate = new Date(seasonalRate.period.endDate);
      let counterDate = new Date(startDate);

      while (counterDate.getTime() <= endDate.getTime()) {

        const newDate = new Date(counterDate);

        this.priceDates.push(newDate);
        this.priceValues.set(newDate, seasonalRate.price);


        console.log(this.priceValues);

        counterDate.setDate(counterDate.getDate() + 1);
      }
    }
  }
  
  onCheckboxChange(value: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedAmenities.push(value);
    } else {
      const index = this.selectedAmenities.indexOf(value);
      if (index >= 0) {
        this.selectedAmenities.splice(index, 1);
      }
    }
    console.log(this.selectedAmenities);
  }
  
  onBackClick(): void {
    this.page--;
  }
  onNextClick(): void {
    if (this.accommodationForm.valid) {
      this.page=this.page % 3 + 1;
    } else {
      this.accommodationForm.markAsDirty();
      this.accommodationForm.markAllAsTouched();
    }
  }


  createAccommodation(): void {

    if (this.accommodationForm.invalid) return;

    let accommodationDTO: AccommodationWholeEdited = this.accommodationForm.value;
    accommodationDTO.amenities = this.selectedAmenities;
    accommodationDTO.availability = this.availability;
    accommodationDTO.seasonalRates = this.seasonalRates;
    accommodationDTO.location = this.coordinates;

    accommodationDTO.hostUsername = this.authService.getUsername();
    
    accommodationDTO.id = this.id;
    accommodationDTO.accommodationId = this.accommodationId;

    console.log(accommodationDTO);

    accommodationDTO.toDeleteImages = this.toDeleteImages;
    accommodationDTO.images = this.currentImages;

    const formData: FormData = new FormData();
    for (let file of this.selectedFiles) {
      formData.append('images', file);
    }

    console.log(this.selectedFiles);

    this.service.add(accommodationDTO).subscribe({
      next: (response: AccommodationWholeEdited) => {
        console.log("SUCCESS! " + accommodationDTO, response);
        this.router.navigate(['my-accommodations'])
        this.service.addImages(response.id || 0, formData).subscribe({
          next: () => {console.log("Sent images")},
          error: () => {console.error("Error sending images for pending accommodation")}
        })
      },
      error: (error) => {
        console.error(error)
        this.showSnackBar(error.error.message)
      }
        
    });
  }

  constructor(private formBuilder: FormBuilder, private service: AccommodationService, private snackBar: MatSnackBar,
              private route: ActivatedRoute, private router: Router, private authService: AuthService, private imageService: ImageService) {
    
    this.accommodationForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      isAutomatic: [true, []],
      description: ['', Validators.maxLength(200)],
      country: ['', Validators.required],
      city: ['', [Validators.required, Validators.maxLength(200)]],
      street: ['', [Validators.required, Validators.maxLength(200)]],
      number: ['1', [Validators.required, Validators.max(10000000), Validators.min(1)]],
      type: ['', Validators.required],
      minGuests: ['1', [Validators.required, Validators.max(100), Validators.min(1)]],
      maxGuests: ['1', [Validators.required, Validators.max(100), Validators.min(1)]],
      deadline: ['0', [Validators.required, Validators.max(365), Validators.min(0)]],
      // id: null,
      location: "",
      images: [],
      price: ['0', [Validators.required, Validators.min(0)]],
      isPricePerGuest: [true, []]
    }, { validator : minMaxValidator });
  }


  deleteImage(image: number) {
    this.toDeleteImages.push(image);
  }

  resetToDelete() {
    this.toDeleteImages = [];
  }

  resetUploaded() {
    this.selectedFiles = [];
  }

  getPath(image: number): string {
    return this.imageService.getPath(image, false);
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

}
