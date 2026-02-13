# 💬 Api Utn Chat

REST API desarrollada con **Node.js + Express + MongoDB + JWT** para la gestión de un sistema de mensajería privada entre usuarios.

🚀 **Deploy en producción:** [https://tp-final-nodejs-drab.vercel.app](https://tp-final-nodejs-drab.vercel.app)

---

## 📋 Descripción

La aplicación permite:

- CRUD completo de usuarios
- Creación y gestión de chats entre usuarios
- Envío, edición y eliminación de mensajes
- Autenticación mediante JWT
- Paginación de mensajes
- Manejo centralizado de errores
- Deploy en entorno productivo (Vercel)

---

## 🛠 Tecnologías

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

- Node.js
- Express
- MongoDB Atlas + Mongoose
- JSON Web Token (JWT)
- bcrypt
- dotenv

---

## 📂 Estructura del proyecto
```
src/
 ├── config/
 ├── controllers/
 ├── models/
 ├── repository/
 ├── routes/
 ├── middlewares/
 ├── utils/
 └── main.js
```

---

## 🔐 Autenticación

La API utiliza **JWT**. Para acceder a los endpoints protegidos se debe incluir el token en el header:
```
Authorization: Bearer <token>
```

---

## 🌐 URL Base
```
https://tp-final-nodejs-drab.vercel.app
```

---

## 🧪 Endpoints

### 🔹 Health Check

| Método | Endpoint |
|--------|----------|
| `GET` | `/health` |

---

### 👤 Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/users` | Crear usuario |
| `GET` | `/api/users` | Listar usuarios |
| `PATCH` | `/api/users/:id` | Actualizar usuario |
| `DELETE` | `/api/users/:id` | Eliminar usuario |

**Crear / Actualizar — Body:**
```json
{
  "email": "usuario@email.com",
  "password": "1234"
}
```

---

### 🔑 Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Registro |
| `POST` | `/api/auth/login` | Login → devuelve token JWT |

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "1234"
}
```

---

### 💬 Chats *(🔒 requieren Bearer Token)*

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/chats` | Crear chat |
| `GET` | `/api/chats` | Listar chats del usuario autenticado |
| `GET` | `/api/chats/:chat_id` | Obtener chat por ID |
| `DELETE` | `/api/chats/:chat_id` | Eliminar chat y sus mensajes |

**Crear chat — Body:**
```json
{
  "contactEmail": "otro@email.com"
}
```

---

### 📨 Mensajes *(🔒 requieren Bearer Token)*

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/chats/:chat_id/messages` | Enviar mensaje |
| `GET` | `/api/chats/:chat_id/messages` | Obtener historial (con paginación) |
| `PATCH` | `/api/chats/:chat_id/messages/:message_id` | Editar mensaje (solo el autor) |
| `DELETE` | `/api/chats/:chat_id/messages/:message_id` | Eliminar mensaje (solo el autor) |

**Enviar / Editar — Body:**
```json
{
  "content": "Hola!"
}
```

**Paginación:**
```
GET /api/chats/:chat_id/messages?limit=10&page=2
```

| Parámetro | Descripción |
|-----------|-------------|
| `limit` | Cantidad de mensajes por página |
| `page` | Número de página |

---

## 📦 Modelo de Datos

### Users
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId | ID único |
| `email` | String | Email normalizado |
| `password` | String | Hash bcrypt |
| `created_at` | Date | Fecha de creación |

### Chats
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId | ID único |
| `user_id_1` | ObjectId | Referencia a usuario |
| `user_id_2` | ObjectId | Referencia a usuario |
| `created_at` | Date | Fecha de creación |

### Messages
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | ObjectId | ID único |
| `content` | String | Contenido del mensaje |
| `chat_id` | ObjectId | Referencia al chat |
| `sender_user_id` | ObjectId | Referencia al autor |
| `created_at` | Date | Fecha de creación |

---

## ⚠️ Manejo de Errores

Las respuestas de error siguen el formato:
```json
{
  "success": false,
  "message": "Descripción del error",
  "data": null
}
```

Casos controlados: ID inválido, usuario inexistente, chat inexistente, permisos insuficientes, usuario duplicado, campos requeridos faltantes.

---

## 🔎 Seguridad

- Hash de contraseñas con **bcrypt**
- Autenticación con **JWT**
- Validación de permisos para edición/eliminación
- Normalización de emails
- Manejo centralizado de errores

---

## ✅ Funcionalidades implementadas

- [x] CRUD completo de usuarios
- [x] CRUD completo de mensajes
- [x] Gestión de chats
- [x] Autenticación JWT
- [x] Paginación profesional
- [x] Manejo centralizado de errores
- [x] Deploy en producción (Vercel)