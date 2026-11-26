import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { supabase } from './supabase';
import { Sesion } from './sesion';

@Component({
  selector: 'app-usuario-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Botón con Blobatar 100% LOCAL (cero llamadas a terceros) -->
    <button
      class="avatar-btn"
      type="button"
      (click)="abrirModal()"
      [attr.aria-label]="sesion ? 'Perfil de ' + sesion.nombre : 'Usuario'"
    >
      <div class="avatar-svg-wrap" [innerHTML]="avatarSvgMini"></div>
    </button>

    <!-- Modal emergente de perfil -->
    @if (modalAbierto()) {
      <div class="modal-backdrop" (click)="cerrarModal()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <button class="btn-cerrar" type="button" (click)="cerrarModal()" aria-label="Cerrar">
            <span class="material-symbols-outlined">close</span>
          </button>

          <div class="modal-avatar-grande">
            <div class="avatar-svg-wrap-grande" [innerHTML]="avatarSvgGrande"></div>
          </div>

          <h2 class="modal-nombre">{{ sesion?.nombre || 'Usuario' }}</h2>
          <p class="modal-correo">{{ sesion?.correo }}</p>

          <div class="modal-badge-rol">
            <span class="chip" [class.chip-dueno]="sesion?.rol === 'dueno'">
              <span class="material-symbols-outlined text-[18px]">
                {{ sesion?.rol === 'dueno' ? 'verified_user' : 'badge' }}
              </span>
              {{ sesion?.rol === 'dueno' ? 'Dueño del Negocio' : 'Trabajador' }}
            </span>
          </div>

          <div class="modal-acciones">
            <button class="btn-modal-logout" type="button" (click)="cerrarSesion()">
              <span class="material-symbols-outlined">logout</span>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .avatar-btn {
      width: 44px;
      height: 44px;
      flex: 0 0 44px;
      border-radius: 999px;
      border: 2px solid rgba(255, 255, 255, 0.4);
      background: #ffffff;
      padding: 0;
      overflow: hidden;
      display: grid;
      place-items: center;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .avatar-btn:hover {
      transform: scale(1.06);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .avatar-btn:active {
      transform: scale(0.95);
    }

    .avatar-svg-wrap {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
    }

    .avatar-svg-wrap ::ng-deep svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* Modal emergente */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(16, 24, 40, 0.55);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: grid;
      place-items: center;
      padding: 16px;
      animation: fadeIn 0.2s ease-out;
    }

    .modal-card {
      position: relative;
      width: 100%;
      max-width: 360px;
      background: #ffffff;
      border-radius: 20px;
      padding: 28px 20px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.2);
      animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .btn-cerrar {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 36px;
      height: 36px;
      border-radius: 999px;
      border: none;
      background: #f0f4f9;
      color: #555e6d;
      display: grid;
      place-items: center;
      cursor: pointer;
    }

    .btn-cerrar:hover {
      background: #e2e8f0;
    }

    .modal-avatar-grande {
      width: 96px;
      height: 96px;
      border-radius: 999px;
      background: #eff4fc;
      border: 3px solid #1f5fd6;
      box-shadow: 0 4px 14px rgba(31, 95, 214, 0.2);
      overflow: hidden;
      display: grid;
      place-items: center;
      margin-bottom: 12px;
    }

    .avatar-svg-wrap-grande {
      width: 100%;
      height: 100%;
    }

    .avatar-svg-wrap-grande ::ng-deep svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .modal-nombre {
      font-size: 22px;
      font-weight: 800;
      color: #161c22;
      margin: 0;
      line-height: 1.2;
    }

    .modal-correo {
      font-size: 14px;
      color: #64748b;
      margin: 4px 0 14px;
    }

    .modal-badge-rol {
      margin-bottom: 20px;
    }

    .chip-dueno {
      background: #dae2ff !important;
      color: #0047b0 !important;
      font-weight: 700;
    }

    .modal-acciones {
      width: 100%;
    }

    .btn-modal-logout {
      width: 100%;
      min-height: 50px;
      border: none;
      border-radius: 12px;
      background: #fee2e2;
      color: #ba1a1a;
      font-size: 16px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: background 0.15s ease, transform 0.1s ease;
    }

    .btn-modal-logout:hover {
      background: #fecaca;
    }

    .btn-modal-logout:active {
      transform: scale(0.97);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `]
})
export class UsuarioAvatarComponent {
  @Input() sesion: Sesion | null = null;
  @Output() alCerrarSesion = new EventEmitter<void>();

  modalAbierto = signal(false);

  // Paletas de colores locales (sin dependencias externas)
  private readonly colores = [
    { fondo: '#1f5fd6', forma1: '#8cfa9a', forma2: '#dae2ff', cara: '#ffffff' },
    { fondo: '#006e2a', forma1: '#dae2ff', forma2: '#8cfa9a', cara: '#ffffff' },
    { fondo: '#5e2fb3', forma1: '#eaddff', forma2: '#8cfa9a', cara: '#ffffff' },
    { fondo: '#0047b0', forma1: '#b2c5ff', forma2: '#70dd80', cara: '#ffffff' },
    { fondo: '#b3261e', forma1: '#ffd8d6', forma2: '#dae2ff', cara: '#ffffff' },
    { fondo: '#161c22', forma1: '#dae2ff', forma2: '#b2c5ff', cara: '#ffffff' },
  ];

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  // Genera un número pseudo-aleatorio a partir de idUsuario (UUID opaco)
  private hashId(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  // Genera un SVG Blobatar divertido puramente local (in-memory)
  private generarSvg(tamano: number): SafeHtml {
    // Usamos SOLAMENTE el idUsuario (UUID anónimo) o un valor por defecto.
    // NUNCA el nombre ni el correo.
    const identificador = this.sesion?.idUsuario || 'anonimo-000';
    const num = this.hashId(identificador);

    const paleta = this.colores[num % this.colores.length];
    const inicial = (this.sesion?.nombre?.[0] || 'U').toUpperCase();

    // Variaciones geométricas de blobs locales
    const tipoCara = num % 3;
    let ojosBoca = '';

    if (tipoCara === 0) {
      // Carita sonriente con ojos redondos
      ojosBoca = `
        <circle cx="38" cy="46" r="4.5" fill="${paleta.cara}" />
        <circle cx="62" cy="46" r="4.5" fill="${paleta.cara}" />
        <path d="M 40 58 Q 50 68 60 58" stroke="${paleta.cara}" stroke-width="4" stroke-linecap="round" fill="none" />
      `;
    } else if (tipoCara === 1) {
      // Carita guiño contenta
      ojosBoca = `
        <path d="M 33 46 Q 38 41 43 46" stroke="${paleta.cara}" stroke-width="4" stroke-linecap="round" fill="none" />
        <circle cx="62" cy="45" r="4.5" fill="${paleta.cara}" />
        <path d="M 42 57 Q 50 66 58 57" stroke="${paleta.cara}" stroke-width="3.5" stroke-linecap="round" fill="none" />
      `;
    } else {
      // Letra inicial estilizada con blob orgánico
      ojosBoca = `
        <text x="50" y="62" font-family="Inter, sans-serif" font-size="34" font-weight="900" fill="${paleta.cara}" text-anchor="middle">${inicial}</text>
      `;
    }

    const svg = `
      <svg viewBox="0 0 100 100" width="${tamano}" height="${tamano}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="50" fill="${paleta.fondo}" />
        <circle cx="25" cy="25" r="28" fill="${paleta.forma1}" opacity="0.35" />
        <path d="M 50 15 Q 85 20 80 55 Q 75 90 45 85 Q 15 80 20 50 Z" fill="${paleta.forma2}" opacity="0.25" />
        ${ojosBoca}
      </svg>
    `;

    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  get avatarSvgMini(): SafeHtml {
    return this.generarSvg(44);
  }

  get avatarSvgGrande(): SafeHtml {
    return this.generarSvg(96);
  }

  abrirModal() {
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
  }

  async cerrarSesion() {
    this.cerrarModal();
    if (this.alCerrarSesion.observed) {
      this.alCerrarSesion.emit();
    } else {
      await supabase.auth.signOut();
      this.router.navigateByUrl('/login');
    }
  }
}
