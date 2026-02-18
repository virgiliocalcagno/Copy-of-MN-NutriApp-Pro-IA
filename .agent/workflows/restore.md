---
description: Cómo restaurar el proyecto a un punto seguro si algo sale mal.
---

# Guía de Restauración de Emergencia

Si la aplicación deja de funcionar o no te gusta un cambio reciente, sigue estos pasos:

1. Abre el archivo `CHECKPOINTS.md` para ver los puntos estables.
2. Escríbeme: **"/restore"** o simplemente **"Regresa al punto CP003"**.
3. Al recibir tu mensaje, yo usaré Git para revertir todos los archivos al estado exacto que elegiste.

## ¿Qué hace esto técnicamente?

Ejecuta un comando `git reset --hard`, lo que significa que **borra los cambios actuales** que están dando problemas y trae de vuelta la versión que funcionaba.
