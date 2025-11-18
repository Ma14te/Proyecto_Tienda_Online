# Instrucciones de Testing Post-Corrección

## 🎯 Verificar las Correcciones

### 1. Revisar la Consola del Navegador

Abre las DevTools del navegador (F12) y verifica:

#### ✅ Lo que DEBERÍA ver ahora:
- ✅ Angular running in development mode
- ✅ Angular hydrated X components...
- ⚠️ Error 401 en `/api/categorias` pero manejado gracefully (no bloquea la app)

#### ❌ Lo que NO debería ver:
- ❌ Errores `ERR_NAME_NOT_RESOLVED` en imágenes
- ❌ Warnings `NG0913` sobre tamaño de imágenes
- ❌ Errores JavaScript que bloqueen la aplicación

### 2. Verificar la Página de Inicio

1. **Navega a** `http://localhost:4200`
2. **Verifica que:**
   - ✅ Los productos se muestran correctamente
   - ✅ Las imágenes se cargan (o muestran placeholder SVG)
   - ✅ No hay imágenes rotas
   - ⚠️ El filtro de categorías puede estar vacío (hasta que se corrija el backend)

### 3. Verificar el Panel de Admin

1. **Accede con credenciales de admin:**
   - Email: `admin@tienda.com`
   - Password: `admin123`

2. **Verifica que:**
   - ✅ El dashboard muestra estadísticas
   - ✅ Las categorías cargan en el panel admin
   - ✅ Puedes crear/editar productos
   - ✅ Puedes crear/editar categorías

### 4. Testing del Backend (Si tienes acceso)

```powershell
# Test 1: Verificar endpoint de categorías sin auth
Invoke-RestMethod -Uri "http://localhost:3000/api/categorias" -Method GET

# Test 2: Verificar endpoint de productos sin auth  
Invoke-RestMethod -Uri "http://localhost:3000/api/productos" -Method GET

# Test 3: Login y obtener token
$body = @{
    email = "admin@tienda.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.token

# Test 4: Acceder a categorías con autenticación
$headers = @{
    "Authorization" = "Bearer $token"
}
Invoke-RestMethod -Uri "http://localhost:3000/api/categorias" -Headers $headers
```

## 🔧 Solución Temporal si el Backend No Está Corregido

Si el backend aún retorna 401 en `/api/categorias`, la aplicación:
- ✅ **Seguirá funcionando** normalmente
- ✅ Mostrará productos
- ⚠️ No mostrará opciones de categorías en el filtro de la página de inicio
- ✅ El panel admin funcionará correctamente (usa autenticación)

## 🚀 Corrección Permanente del Backend

**Ubicación del Backend:** `c:\Users\emate\Downloads\Tienda online\backend`

**Archivo a modificar:** `backend/routes/categorias.js` (o similar)

**Cambio necesario:**

```javascript
// ANTES (con autenticación obligatoria)
router.get('/categorias', authMiddleware, async (req, res) => {
  // ...
});

// DESPUÉS (sin autenticación para GET)
router.get('/categorias', async (req, res) => {
  // Este endpoint es público
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST, PUT, DELETE SÍ deben tener authMiddleware
router.post('/categorias', authMiddleware, async (req, res) => {
  // ...
});
```

**Reiniciar el backend:**
```powershell
cd "c:\Users\emate\Downloads\Tienda online\backend"
# Ctrl+C para detener
npm start
```

## 📊 Checklist de Verificación

### Frontend ✅
- [x] Errores 401 manejados gracefully
- [x] Imágenes con validación de URLs
- [x] Fallback a SVG inline en lugar de placeholder externo
- [x] Atributos width/height en imágenes
- [x] Lazy loading implementado
- [x] Panel admin usa autenticación correctamente

### Backend ⚠️ (Requiere Acción)
- [ ] `/api/categorias` GET es público (sin auth)
- [ ] `/api/productos` GET es público (sin auth)
- [ ] POST/PUT/DELETE requieren autenticación
- [ ] CORS configurado para `http://localhost:4200`
- [ ] JWT_SECRET configurado en .env

## 📝 Notas Adicionales

- **Imágenes de ejemplo:** Si ves el placeholder SVG "Sin Imagen", es porque:
  - No hay imágenes configuradas en la BD para ese producto, O
  - Las URLs de imágenes en la BD son inválidas

- **Performance:** Las imágenes ahora cargan con lazy loading, mejorando el rendimiento inicial

- **Errores de consola esperados:**
  - Warning sobre `-webkit-line-clamp` (solo CSS, no afecta funcionalidad)

## 🆘 Troubleshooting

### Problema: Página en blanco
**Solución:** Revisar consola del navegador, verificar que el backend esté corriendo

### Problema: No carga productos
**Solución:** Verificar que el backend esté corriendo en `http://localhost:3000`

### Problema: 401 en todas las peticiones
**Solución:** Limpiar localStorage y recargar:
```javascript
// En la consola del navegador
localStorage.clear();
location.reload();
```

### Problema: Panel admin no carga
**Solución:** Verificar que estás logueado con cuenta admin y que el token es válido
