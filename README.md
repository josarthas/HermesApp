# HERMES
## Sistema de Control de Múltiples cuentas Twitter.
### Desarrollado con Licencias MIT y GNU

### Sistema Empresarial de control de cuentas de Twitter
#### (Granja de Bots)

1. No usar este programa para crear tendencias artificiales.
  - Bueno sí, pero no hagas que cancelen tu cuenta de desarrollador de twitter.
2. No violar las reglas de Automatización de Twitter con ésta aplicación.
3. Ten tantita madre y no uses ésta aplicación con fines de promoción partidista, el programador es bien chairo y además colabora en la #OPCazaUnBot.
4. Ésta aplicación es imperfecta, mejórala como puedas y si crees que es una buena mejora haz un pull request.
5. Implementar funcionas asíncronas para la base de datos, en volúmenes demasiado grandes puede provocar retraso en el llenado de tokens.


## Instalación:
1. Instala la ultima versión de [NodeJS](https://nodejs.org/es/) y [npm](https://www.npmjs.com/) en un servidor linux.
2. Descarga el repositorio e instala.
3. Crea un archivo .env con las variables de
>        DB_HOST,
>        DB_USER,
>        DB_PWD,
>        DB_CONNLMT,
>        DB_PORT,
>        DB_DB,
>        APP_CONSUMER_SECRET,
>        APP_CONSUMER_KEY,
>        NICHOS_PATH

3. Configura la base de datos.
    - Ingresa un usuario con contraseña a la tabla Usuarios.
    - La tabla "Numeros" esta incluida para llevar un control de los números de teléfono que asocies a cada cuenta de twitter.
4. Configura tu método OAuth para las cuentas de twitter (necesitas una [Cuenta de Desarrollador de Twitter](https://developer.twitter.com))
    - Twitter provee estas herramientas en su página de desarroladores.
5. Guarda los Tokens de Acceso de una cuenta de twitter en la base de datos con tu método OAuth.
6. Crea un script de conversación en formato JSON para [Tracery](https://www.tracery.io/)
7. Inicia y entra a la aplicacion con tu nueva contraseña y usuario.
8. Sube el script en el apartado "Nichos".
9. Crea una nueva campaña en "Unitaria" o "Nueva".
10. Observa el comportamiento de tu bot en twitter.
