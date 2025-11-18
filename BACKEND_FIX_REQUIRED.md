# Correcciones Necesarias en el Backend

## Problema Principal
El endpoint `/api/categorias` está retornando **401 Unauthorized** para peticiones sin autenticación, lo cual impide que la página de inicio cargue las categorías correctamente.

## Solución Requerida en el Backend

### Opción 1: Hacer el endpoint público (Recomendado)
Modificar el backend para que `/api/categorias` sea público (sin requerir autenticación):

```javascript
// En backend/routes/categorias.js o similar
router.get('/categorias', async (req, res) => {
  // Este endpoint NO debe requerir autenticación
  // Remover middleware de autenticación si existe
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Opción 2: Crear endpoints separados
Si deseas mantener seguridad en el endpoint de categorías:

```javascript
// Endpoint público para la tienda
router.get('/categorias', async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint protegido para admin
router.get('/categorias/admin', authMiddleware, async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Verificación

Después de aplicar los cambios en el backend, verifica que:

1. `GET http://localhost:3000/api/categorias` retorne las categorías **sin** requerir autenticación (código 200)
2. Las operaciones de crear, actualizar y eliminar categorías **SÍ** requieran autenticación

## Estado del Frontend

El frontend ya ha sido actualizado para:
- ✅ Manejar errores 401 gracefully en la página de inicio
- ✅ Intentar usar endpoint con autenticación si el usuario está logueado
- ✅ Continuar funcionando aunque no cargue categorías
- ✅ Usar endpoint con autenticación en el panel de admin
- ✅ Optimizar carga de imágenes y prevenir errores de URLs inválidas

## Endpoints del Backend - Estado Esperado

| Endpoint | Método | Autenticación | Uso |
|----------|--------|---------------|-----|
| `/api/categorias` | GET | ❌ No | Página pública (home) |
| `/api/categorias` | POST | ✅ Sí (Admin) | Crear categoría |
| `/api/categorias/:id` | PUT | ✅ Sí (Admin) | Actualizar categoría |
| `/api/categorias/:id` | DELETE | ✅ Sí (Admin) | Eliminar categoría |
| `/api/productos` | GET | ❌ No | Página pública (home) |
| `/api/productos` | POST | ✅ Sí (Admin) | Crear producto |
| `/api/productos/:id` | PUT | ✅ Sí (Admin) | Actualizar producto |
| `/api/productos/:id` | DELETE | ✅ Sí (Admin) | Eliminar producto |

## Testing

Para probar que el backend funciona correctamente:

```powershell
# Sin autenticación - debe funcionar
curl http://localhost:3000/api/categorias

# Con autenticación - para admin
$headers = @{
    "Authorization" = "Bearer TU_TOKEN_AQUI"
}
Invoke-RestMethod -Uri "http://localhost:3000/api/categorias" -Headers $headers
```
