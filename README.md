# Pokémon

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)
[![LoopBack](https://1000marcas.net/wp-content/uploads/2020/01/Logo-Pokemon.png)](https://1000marcas.net/wp-content/uploads/2020/01/Logo-Pokemon.png)

Esta aplicacion esta usando [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Install dependencies

Por defecto, las dependencias se instalaron cuando se generó esta aplicación. 
Cada vez que las dependencias en `package.json` se modifican, ejecuta el siguiente comando::

```sh
npm install
```


## Para correr la aplicación se tiene que ejecutar este comando:

```sh
npm start
```

También puedes ejecutar `node` . para omitir el paso de construcción.

Open http://127.0.0.1:3000 in your browser.


## Ejecutar APIS via Postman
En el proyecto existe un archivo en el directorio `/postman/APIS Pokemon.postman_collection.json` el cual se importar para empezar a consumir las APIS, en esa coleccion ya viene configuradas las varables de entorno





## Preguntas de la prueba



### ¿Cómo implementaste la relación entre el modelo de usuario y el modelo de favoritos?
Use la propiedad de entidades que tiene LoopBack4 donde se creo la entidad de `user` y `favorites` y se realizo una migración para los esquemas se crearan en la Base de datos, en cada Modelo de entidad se realizo la relación con decoradores "@hasMany" y "@belongsTo"


### ¿Qué consideraciones tuviste en cuenta para asegurarte de que un usuario solo pueda agregar o eliminar sus propios Pokémon favoritos?
Primero tener en cuanta que el usuario para poder agregar o eliminar debe estar logueado por JWT, el api de agregar o eliminar envía el id del usuario por parámetro pero se valida que el token corresponda al id que se recibe en la petición.

### ¿Si un usuario tiene muchos Pokémon en su lista de favoritos, ¿cómo mejorarías el rendimiento de las consultas para obtenerlos?
Se tendria que realizar una paginación a nivel base de datos donde en el api reciba un atributo "offset" y un "limit", además agregando un filtro de busqueda para ir filtrando los datos que solo requiere



## Librerias Utilizadas

### Se utilizo como estandar de id uuid para evitar que los id sean enteros y por cuestion de seguridad de datos

```sh
npm install uuid
```

### Se utilizo para usar el archivo `.env` y usarlo para la conexión de la DB

```sh
npm install dotenv
```

## Comandos Utilizados para la creacón del proyecto
### Instale el conector para postgresql:
```sh
npm install loopback-connector-postgresql --save
```

### Posteriormente en la terminal cree un datasources para configurar postgresql con loopback4
```sh
lb4 datasource
```


### Se crearon los modelos con el siguiente comando, los cuales son "users", "favorites"
```sh
lb4 model
```

### Se crearon un repositorio por cada Modelo
```sh
lb4 repository
```

### Posteriormente se crearon los controladores de "users", "favorites"
```sh
lb4 controller
```
 

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```


