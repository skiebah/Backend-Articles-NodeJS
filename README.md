# Backend - Articles - NodeJS

_Sistema basico de circuito de backend escrito con NodeJS, destinado a CRUD de Articles_
 
---

## Setup 🚀

### Install Node.js and clone project

* `git clone https://github.com/skiebah/Backend-Articles-NodeJS.git`

### Install modules

* `$ cd [your project path]`
* `$ npm install`

### Run API REST

* `$ cd [your project path]`
* `$ npm start`

---
## Modelo de salida de datos

* **Correcta ejecución:**
```JSON
{
    "status": "success",
    "article": {
        "_id": "610a7bb9b6846e447808b5ce",
        "date": "2021-02-04T11:36:25.246Z",
        "title": "Primer Article 2",
        "content": "Contenido del primer articulo 2",
        "image": null,
        "__v": 0
    }
}
```

* **Error al momento de ejecución:**
```JSON
{
    "status": "error",
    "message": "Error no se encuentra el article"
}
```
