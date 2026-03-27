Lista la estructura de carpetas del proyecto actual.

Usa el comando `tree` con las siguientes reglas:
- Excluye las carpetas: `node_modules`, `.next`, `.git`, `.claude`
- Muestra solo directorios y archivos hasta 3 niveles de profundidad por defecto
- Si el usuario proporciona un argumento numérico (ej: `/tree 5`), usa ese número como profundidad
- Muestra el resultado directamente al usuario

Ejecuta:
```
tree -L ${1:-3} -I "node_modules|.next|.git|.claude" --dirsfirst
```

Si `tree` no está instalado, usa como fallback:
```
find . -maxdepth ${1:-3} \( -name node_modules -o -name .next -o -name .git -o -name .claude \) -prune -o -print | sort | head -200
```
