import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { formatoMiles, soloNumero } from './formato';

@Directive({
  selector: 'input[formatoMiles]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormatoMilesDirective),
      multi: true,
    },
  ],
})
export class FormatoMilesDirective implements ControlValueAccessor {
  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const rawNum = soloNumero(input.value);
    const formatted = rawNum > 0 ? formatoMiles(rawNum) : '';
    input.value = formatted;
    this.onChange(rawNum > 0 ? rawNum : null);
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  writeValue(value: number | string | null): void {
    const rawNum = soloNumero(value);
    this.el.nativeElement.value = rawNum > 0 ? formatoMiles(rawNum) : '';
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }
}
