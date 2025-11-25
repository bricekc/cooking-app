import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlightIngredient]',
  standalone: true,
})
export class HighlightIngredientDirective {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onHover() {
    this.el.nativeElement.style.backgroundColor = '#fff3cd';
  }

  @HostListener('mouseleave')
  onLeave() {
    this.el.nativeElement.style.backgroundColor = '#f3f4f6';
  }
}
