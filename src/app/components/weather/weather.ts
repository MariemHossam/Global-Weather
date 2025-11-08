import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather.html',
  styleUrls: ['./weather.scss']
})
export class WeatherComponent implements OnInit {
  cities: any[] = [];
  filteredCities: any[] = [];
  searchText: string = '';
  selectedDate: string = '';
  useCelsius: boolean = true;
  errorMessage: string = ''; 

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadCities();
  }

  // Load all cities
  loadCities(): void {
    this.weatherService.getAllCities().subscribe({
      next: (data) => {
        this.cities = data;
        this.filteredCities = this.getLatestForecasts(data);
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Failed to load cities.';
      }
    });
  }

  // Filter to latest day 
  getLatestForecasts(cities: any[]): any[] {
    return cities.map((city) => {
      const latest = city.forecast?.[city.forecast.length - 1];
      return { ...city, forecast: latest ? [latest] : [] };
    });
  }

  // Search filter
  onSearchChange(): void {
    this.applyFilters();
  }

  // Date filter
  onDateChange(): void {
    this.applyFilters();
  }

  // Toggle between °C and °F
  toggleUnits(): void {
    this.useCelsius = !this.useCelsius;
  }

  // Apply filters (search + date)
  applyFilters(): void {
    this.filteredCities = this.cities.filter((city) => {
      const matchesCity =
        !this.searchText ||
        city.city.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesDate =
        !this.selectedDate ||
        city.forecast.some((day: any) => day.date === this.selectedDate);

      return matchesCity && matchesDate;
    });

    // Filter 
    if (this.selectedDate) {
      this.filteredCities = this.filteredCities.map((city) => ({
        ...city,
        forecast: city.forecast.filter((day: any) => day.date === this.selectedDate)
      }));
    }

    if (this.filteredCities.length === 0) {
      this.errorMessage = 'No cities found. Try another search or date.';
    } else {
      this.errorMessage = '';
    }
  }

  // Reset filters
  resetFilters(): void {
    this.searchText = '';
    this.selectedDate = '';
    this.useCelsius = true;
    this.errorMessage = '';
    this.filteredCities = this.getLatestForecasts(this.cities);
  }
}
