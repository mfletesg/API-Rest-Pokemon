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

## Preguntas de la prueba



### ¿Cómo implementaste la relación entre el modelo de usuario y el modelo de favoritos?
Use la propiedad de entidades que tiene LoopBack4 donde se creo la entidad de `user` y `favorites` y se realizo una migración para los esquemas se crearan en la Base de datos, en cada Modelo de entidad se realizo la relación con decoradores "@hasMany" y "@belongsTo"


### ¿Qué consideraciones tuviste en cuenta para asegurarte de que un usuario solo pueda agregar o eliminar sus propios Pokémon favoritos?
Primero tener en cuanta que el usuario para poder agregar o eliminar debe estar logueado por JWT, el api de agregar o eliminar envía el id del usuario por parámetro pero se valida que el token corresponda al id que se recibe en la petición.

### ¿Si un usuario tiene muchos Pokémon en su lista de favoritos, ¿cómo mejorarías el rendimiento de las consultas para obtenerlos?
Se tendria que realizar una paginación a nivel base de datos donde en el api reciba un atributo "offset" y un "limit", además agregando un filtro de busqueda para ir filtrando los datos que solo requiere
 

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```


