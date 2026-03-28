# Analizador Musical 🎸

Entorno de aprendizaje personal (PLE) interactivo para explorar intervalos musicales en el mástil de la guitarra.

**[Ver la app →](https://ycantill.github.io/music-analyser)**

---

## Qué hace

- Muestra el **mástil completo** de la guitarra (6 cuerdas, 13 trastes)
- Toca cualquier nota para establecerla como **tónica** (marcada en verde)
- Toca notas adicionales para construir **intervalos y acordes** (marcados en azul)
- Cada nota suena al tocarla — toda la combinación activa suena a la vez
- Las etiquetas muestran el **nombre de la nota** y el **nombre del intervalo** relativo a la tónica

## Aprendizaje

Diseñado como PLE con referencias académicas integradas:

- Chase, W. *How Music Really Works.* Roedy Black Publishing.
- Shapira Lots, I. & Stone, L. (2008). *Perception of musical consonance and dissonance: an outcome of neural synchronization.* J R Soc Interface, 5(29), 1429–1434. [PMC2607353](https://pmc.ncbi.nlm.nih.gov/articles/PMC2607353/)
- Roos, F. (2020). *Pure Intervals.* Loophole Letters. [loophole-letters.vercel.app/intervals](https://loophole-letters.vercel.app/intervals)

## Tecnología

| | |
|---|---|
| UI | React 18 + Vite |
| Audio | [Tone.js](https://tonejs.github.io/) — `Synth` con oscilador triangular + reverb |
| Estilos | CSS puro, sin dependencias de UI |
| PWA | Web App Manifest + Web Share API |

## Desarrollo local

```bash
npm install
npm run dev
```

## Compilar

```bash
npm run build
```

## Contribuir

Los PRs son bienvenidos. Abre un issue o fork en [github.com/ycantill/music-analyser](https://github.com/ycantill/music-analyser).
