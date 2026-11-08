import { Injectable, signal, effect } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    isDark = signal<boolean>(false);

    constructor() {
        // Check localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
            this.isDark.set(true);
        }

        // Effect to apply class when signal changes
        effect(() => {
            const isDark = this.isDark();
            console.log('[ThemeService] Effect triggered. isDark:', isDark);
            if (isDark) {
                console.log('[ThemeService] Adding "dark" class');
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                console.log('[ThemeService] Removing "dark" class');
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    toggleTheme() {
        console.log('[ThemeService] Toggle requested. Current:', this.isDark());
        this.isDark.update(current => !current);
    }
}
