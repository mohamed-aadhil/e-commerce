import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Genre, ProductCard } from '../../services/product.service';
import { ProductCard as ProductCardComponent } from '../../components/product-card/product-card';
import { SharedHeader } from '../../../shared/header/header';
import { RouterModule } from '@angular/router';
import { SharedFooter } from '../../../shared/footer/footer';

@Component({
  selector: 'app-genre-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, SharedHeader, SharedFooter, RouterModule],
  templateUrl: './genre-products.html',
  styleUrl: './genre-products.css'
})
export class GenreProducts implements OnInit {
  genre: Genre | null = null;
  genres: Genre[] = [];
  products: ProductCard[] = [];
  loading = true;
  error = false;
  sortOption: string = 'price-asc';

  constructor(
    private route: ActivatedRoute, 
    private productService: ProductService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const genreId = params.get('id');
      if (genreId) {
        this.loading = true;
        this.error = false;
        this.productService.getGenres().subscribe({
          next: (genres: Genre[]) => {
            this.genres = genres;
            this.genre = genres.find(g => g.id === +genreId) || null;
            this.fetchProducts(+genreId);
          },
          error: () => {
            this.error = true;
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

fetchProducts(genreId: number) {
    this.productService.getProductsForGenre(genreId).subscribe({
      next: (products: ProductCard[]) => {
        this.products = products;
        this.sortProducts();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  sortProducts() {
    if (this.sortOption === 'price-asc') {
      this.products.sort((a, b) => a.selling_price - b.selling_price);
    } else if (this.sortOption === 'price-desc') {
      this.products.sort((a, b) => b.selling_price - a.selling_price);
    }
  }
}
