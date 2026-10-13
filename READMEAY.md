Alumat Mobile

Repositorio correspondiente al frontend de la aplicación móvil de la empresa **ALUMAT**, desarrollada para la gestión integral de productos, inventarios, pedidos y reportes comerciales.

---

## Descripción del Proyecto

La aplicación móvil **Alumat** permite a los usuarios gestionar el catálogo comercial de manera eficiente. Su objetivo principal es centralizar la administración de stock, actualización de productos y seguimiento de operaciones clave del negocio desde dispositivos móviles.

---

## Tecnologías Utilizadas

* **Framework:** React Native / Expo
* **Lenguaje:** JavaScript / TypeScript
* **Navegación:** React Navigation
* **Gestión de Sprints y Tareas:** Trello

---

## Funcionalidades Desarrolladas

### 1. Módulo de Productos (Vista Principal)
* **Listado de Productos:** Pantalla principal que renderiza la lista de artículos registrados en el sistema (ej. *Vidrio templado 6mm*, *Vidrio templado 5x5*), especificando categoría e imagen del producto.
* **Control Visual de Stock:** Etiquetas dinámicas de disponibilidad (como la alerta de **SIN STOCK**).
* **Edición de Productos:** Accesos directos ("Editar") para modificar la información de cada elemento.
* **Navegación a Creación:** Botón superior **"+ Nuevo producto"** configurado con la navegación correspondiente hacia el formulario de registro de nuevos productos.

### 2. Estructura General y Módulos del Equipo
* **Navegación Inferior (Bottom Bar):** Acceso rápido a las distintas secciones de la app:
  * **Inicio:** Pantalla principal de bienvenida y accesos directos.
  * **Pedidos:** Gestión y listado de órdenes y pedidos.
  * **Boletas:** Consulta y administración de comprobantes/boletas.
  * **Productos:** Control del catálogo e inventario.
  * **Reportes:** Visualización de métricas e indicadores de negocio.

---

## Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd alumat-fe-mobile