import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{

  sliderTransform = 'translateX(0px)';
  currentSlideIndex = 0;
  blockchainData: any = null;
  baseUrl: string = "http://localhost:8080"
  isDragging = false;
  dragStartX = 0;
  currentOffset = 0;
  previousBitcoinValue: number | null= null;
  previousLitecoinValue: number | null = null;

  constructor(private http: HttpClient, private cdf: ChangeDetectorRef, private router: Router){}

  ngOnInit(): void {
    this.fetchBlockchainInfo();

    setInterval(() => {
      if (
        this.currentSlideIndex <
        this.blockchainData?.blocksMined24h.length - 1
      ) {
        this.slideRight();
      } else {
        this.currentSlideIndex = 0;
        this.updateSliderTransform();
      }
    }, 3000);
  }

  ngOnDestroy(){
    this.previousBitcoinValue = +localStorage.getItem('bitcoinValue')!;
    this.previousLitecoinValue = +localStorage.getItem('litecoinValue')!;
  }

  isGreater(current: number | null, previous: number): boolean {
    return current !== null && current > previous;
  }

  isLess(current: number | null, previous: number): boolean {
    return current !== null && current < previous;
  }

  fetchBlockchainInfo() {
    const selectedBlockchain = localStorage.getItem('selectedBlockchain') || 'bitcoin_mainnet';
    const infoUrl = `${this.baseUrl}/api/blockchain/info?blockchain=${selectedBlockchain}`;
    
    this.http.get(infoUrl).subscribe({
      next: (data: any) => {
        this.blockchainData = {
          latestBlocks: data.latestBlocks || [],
          bitcoinValue: data.bitcoinValue || 0,
          litecoinValue: data.litecoinValue || 0,
          blocksMined24h: data.blocksMined24h || []
        };

        this.checkCoinValues(data);
        this.cdf.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch blockchain info:', err);
        this.blockchainData = null;
      }
    });
  }

  slideLeft() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.updateSliderTransform();
    }
  }
  
  slideRight() {
    if (
      this.currentSlideIndex <
      this.blockchainData?.blocksMined24h.length - 1
    ) {
      this.currentSlideIndex++;
      this.updateSliderTransform();
    }
  }

  updateSliderTransform() {
    const itemWidth = 300;
    this.sliderTransform = `translateX(-${this.currentSlideIndex * itemWidth}px)`;
  }

  startDragging(event: MouseEvent) {
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.currentOffset = this.currentSlideIndex * -300;
  }
  
  dragSlider(event: MouseEvent) {
    if (this.isDragging) {
      const deltaX = event.clientX - this.dragStartX;
      const newTransform = this.currentOffset + deltaX;
      this.sliderTransform = `translateX(${newTransform}px)`;
    }
  }
  
  stopDragging() {
    if (this.isDragging) {
      this.isDragging = false;
      const itemWidth = 300;
      const offset = parseFloat(this.sliderTransform.match(/-?\d+/)![0]);
      const slideIndex = Math.round(offset / -itemWidth);
      this.currentSlideIndex = Math.min(
        Math.max(slideIndex, 0), 
        this.blockchainData?.blocksMined24h.length - 1
      );
      this.updateSliderTransform();
    }
  }

  checkCoinValues(data: any){
    if(localStorage.getItem('bitcoinValue') != null || localStorage.getItem('bitcoinValue') != undefined && localStorage.getItem('litecoinValue') != null || localStorage.getItem('litecoinValue') != undefined){
      this.previousBitcoinValue = +localStorage.getItem('bitcoinValue')!;
      this.previousLitecoinValue = +localStorage.getItem('litecoinValue')!;
    }
    else{
      localStorage.setItem("bitcoinValue", data.bitcoinValue);
      localStorage.setItem("litecoinValue", data.litecoinValue);
      this.previousBitcoinValue = +localStorage.getItem('bitcoinValue')!;
      this.previousLitecoinValue = +localStorage.getItem('litecoinValue')!;
    }
  }

  goToBlock(arg: any) {
    const selectedBlockchain = localStorage.getItem('selectedBlockchain')!;
    if (typeof arg === 'number') {
      
      this.router.navigate(['/block', selectedBlockchain, arg]);
    } else if (typeof arg === 'string') {
      const apiUrl = `${this.baseUrl}/api/blockchain/search?query=${arg}&blockchain=${selectedBlockchain}`;
      this.http.get(apiUrl).subscribe({
        next: (data: any) => {
          this.router.navigate(['/block', selectedBlockchain, data.hash]);
        },
        error: (err) => {
          console.error('Failed to navigate to block:', err);
        },
      });
    }
  }

}
