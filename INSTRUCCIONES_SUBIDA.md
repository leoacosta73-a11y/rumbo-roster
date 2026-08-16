# CrewRoster — funcionamiento offline

1. Copiá todo el contenido de esta carpeta dentro de tu repositorio local `rumbo-roster`.
2. Cuando Windows pregunte, elegí **Reemplazar los archivos en el destino**.
3. En GitHub Desktop dejá seleccionados estos cuatro archivos:
   - `app/page.tsx`
   - `app/globals.css`
   - `public/sw.js`
   - `tests/rendered-html.test.mjs`
4. Resumen del commit: `Agregar funcionamiento offline`
5. Presioná **Commit to main** y luego **Push origin**.

## Primera activación

Después de publicada la actualización, abrí CrewRoster una vez con internet y dejala abierta unos segundos. A partir de ese momento, la aplicación y los rosters ya importados podrán abrirse sin conexión.

El calendario, la agenda, los detalles, la biblioteca y las estadísticas guardadas funcionan offline. El mapa necesita haber sido visualizado previamente para conservar parte de sus datos cartográficos; sin internet puede no mostrar sectores que nunca se cargaron.
