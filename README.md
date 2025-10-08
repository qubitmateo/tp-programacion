# Amautos - Sistema de Alquiler de Autos 🚗

Bienvenido a **Amautos**, una plataforma web simple y divertida para gestionar el alquiler de autos, inspirada en la experiencia de Airbnb pero para autos.

---

## Capturas

![Inicio de sesión](https://imgur.com/7FtVGPN)

![Perfil del usuario](https://imgur.com/OsAY51r)

![Inicio](https://imgur.com/IRuBYbb)

![Inicio del admin](https://imgur.com/d2W2Jkj)

## ¿Qué podés hacer?

- **Registrarte e iniciar sesión** como cliente o administrador. Por el momento el admin se define desde el dashboard de Firebase. Es un booleano asociado al usuario que se llama "esAdmin".
- **Ver todos los autos disponibles** para alquilar, con fotos y detalles.
- **Reservar un auto** de manera fácil y rápida.
- **Administrar autos** (solo admins): agregar nuevos autos con foto y modelo.

---

## Estado del proyecto

### Funcionalidades ya implementadas ✅
- Registro y login de usuarios (Firebase Auth)
- Redirección automática según autenticación
- Dashboard moderno y amigable
- Listado de autos con tarjetas tipo Airbnb
- Modal para reservar autos (simulado)
- Panel de administración para agregar autos (solo admins)
- Guardado de autos en Firestore
- Diseño responsive y colores amigables

### Tareas por hacer 🛠️
- Permitir editar y borrar autos (solo admins)
- Agregar detalles extra a los autos (año, precio, etc.)
- Guardar reservas en Firestore
- Mejorar validaciones de formularios
- Agregar feedback visual a las acciones
- Hostear la página con un dominio gratis con Netlify.

---

## ¿Cómo correr el proyecto?

1. Cloná el repo y ubicáte en la carpeta `amautos`.
2. Instalá las dependencias con `npm install`.
3. Configurá tu archivo `.env.local` con las credenciales de Firebase.
4. Ejecutá `npm run dev` y abrí [http://localhost:3000](http://localhost:3000).
