# Instrucciones de Configuración y Ejecución

## Frontend (Angular)

### Instalación de Dependencias
```bash
cd c:\Users\emate\Desktop\Tienda_Online_Frondent\tienda_online
npm install
```

### Ejecutar el Frontend
```bash
ng serve
```

El frontend estará disponible en: `http://localhost:4200`

## Backend (Node.js + Express)

### Ubicación del Backend
El backend está en: `c:\Users\emate\Downloads\Tienda online\backend`

### Configuración del Backend

1. Asegúrate de tener un archivo `.env` en la carpeta backend con la siguiente configuración:
```env
PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tienda_online
JWT_SECRET=tu_secreto_jwt
```

2. Instala las dependencias:
```bash
cd "c:\Users\emate\Downloads\Tienda online\backend"
npm install
```

3. Ejecuta el servidor:
```bash
npm start
```

El backend estará disponible en: `http://localhost:3000`

## Estructura del Proyecto

### Frontend (Angular)
- **Home** (`/`): Catálogo de productos público
- **Login** (`/login`): Inicio de sesión
- **Register** (`/register`): Registro de usuarios
- **Admin** (`/admin`): Panel de administración (protegido, solo para admins)

### Servicios
- **ApiService**: Maneja todas las llamadas HTTP al backend
- **AuthService**: Maneja la autenticación y autorización

### Funcionalidades Migradas

✅ **Autenticación**
- Login con email y contraseña
- Registro de nuevos usuarios
- Manejo de tokens JWT
- Verificación de permisos de administrador

✅ **Catálogo de Productos**
- Listado de productos con imágenes
- Filtrado por categoría
- Búsqueda de productos
- Visualización de categorías

✅ **Panel de Administración**
- Gestión de productos (crear, editar, eliminar)
- Gestión de categorías (crear, editar, eliminar)
- Estadísticas del inventario
- Protección de rutas con guard

## Usuarios por Defecto

El backend crea automáticamente un usuario administrador:
- **Email**: admin@admin.com
- **Contraseña**: admin123

## Notas Importantes

1. El frontend está configurado para conectarse al backend en `http://localhost:3000/api`
2. Asegúrate de que el backend esté ejecutándose antes de usar el frontend
3. Los estilos CSS fueron migrados del frontend original
4. Todas las funcionalidades del frontend original han sido migradas a Angular

## Solución de Problemas

### Error de CORS
Si tienes problemas de CORS, asegúrate de que el backend tenga configurado CORS para aceptar peticiones desde `http://localhost:4200`

### Error de Conexión
Si el frontend no puede conectarse al backend, verifica:
1. Que el backend esté ejecutándose
2. Que el puerto 3000 esté libre
3. Que la URL en `src/app/services/api.ts` sea correcta
