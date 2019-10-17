import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[tsStopPropagation]'
})
export class StopPropagationDirective {

  @HostListener('click', ['$event'])
  onClick(e) {
    e.stopPropagation();
  }

}
