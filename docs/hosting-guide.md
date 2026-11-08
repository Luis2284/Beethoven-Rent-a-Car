# Guía de Publicación Web

Esta guía te ayudará a publicar tu aplicación "Los Carros de Beto" en internet de forma **gratuita**, para que puedas acceder a ella desde tu iPhone o cualquier otro dispositivo.

## Opción 1: GitHub Pages (Recomendada)
Ideal si ya tienes tu código en GitHub.

1.  **Construir la aplicación**:
    Abre tu terminal en la carpeta `frontend` y ejecuta:
    ```bash
    ng build --base-href /nombre-de-tu-repo/
    ```
    *Nota: Reemplaza `nombre-de-tu-repo` con el nombre exacto de tu repositorio en GitHub.*

2.  **Instalar `angular-cli-ghpages`**:
    ```bash
    ng add angular-cli-ghpages
    ```

3.  **Desplegar**:
    ```bash
    ng deploy --base-href=/nombre-de-tu-repo/
    ```

## Opción 2: Vercel (Más fácil y rápida)
Vercel detecta automáticamente que es una aplicación Angular y la configura por ti.

1.  Ve a [vercel.com](https://vercel.com) y crea una cuenta gratuita.
2.  Instala Vercel CLI (opcional pero útil) o conecta tu cuenta de GitHub.
3.  **Opción A (Conectar GitHub)**:
    - En el panel de Vercel, haz clic en "Add New..." -> "Project".
    - Importa tu repositorio de GitHub.
    - Framework Preset: Detectará "Angular" automáticamente.
    - Haz clic en "Deploy".
4.  **Opción B (Desde tu computadora)**:
    - En la terminal, dentro de la carpeta `frontend`:
      ```bash
      npm i -g vercel
      vercel
      ```
    - Sigue las instrucciones en pantalla (Yes, Yes, Yes...).

## Opción 3: Netlify
Similar a Vercel, muy robusta.

1.  Ve a [netlify.com](https://netlify.com) y regístrate.
2.  Arrastra y suelta tu carpeta `dist/frontend/browser` (se genera después de ejecutar `ng build`) en el panel de Netlify.
3.  ¡Listo! Te dará una URL temporal.

## Verificar en iPhone
Una vez publicado, abre el enlace que te generó (ej: `https://mi-app.vercel.app`) en Safari en tu iPhone.
- Deberías ver el menú de hamburguesa en la parte superior izquierda.
- Al tocarlo, el menú lateral debe deslizarse suavemente.
- Todo el contenido debe ajustarse al ancho de la pantalla sin scroll horizontal no deseado.
