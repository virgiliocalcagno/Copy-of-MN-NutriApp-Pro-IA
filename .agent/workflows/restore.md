---
description: Cómo restaurar el proyecto a un punto seguro si algo sale mal.
---

# Restauración de Proyecto

Si sientes que los cambios recientes han dañado la aplicación, sigue estos pasos:

1. Consulta el archivo `CHECKPOINTS.md` en la raíz para ver los puntos estables.
2. Pídeme: "Vuelve al Checkpoint [ID]" (Ejemplo: "Vuelve al CP001").
3. Yo ejecutaré automáticamente los comandos de Git necesarios para deshacer los cambios y volver exactamente a ese estado.

// turbo
Comando interno: `git reset --hard [HASH]`
