var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQlite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD Sqlite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
	{
		dialect: protocol,
		protocol: protocol,
		port: port,
		host: host, 
		storage: storage,  // solo SQlite (.env)
		omitNull: true     // solo Postgres
	}
	);

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// Importar la definición de la tabla Comment en comment.js
var Comment = sequelize.import(path.join(__dirname,'comment'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz;  // Exportar la definición de la tabla
exports.Comment = Comment;  // Exportar la definición de la tabla

// sequelize.sync() crea e inicializa la tabla de preguntas en la DB
sequelize.sync().then(function() {
	// en el pdf se usa success() pero genera problemas con la versión de sequelize
	// por lo que se cambia por then()
	// then(..) ejecuta el manejador cada vez creada la tabla
	Quiz.count().then(function(count){
		if (count === 0) {  // la tabla se inicializa solo si está vacía
				Quiz.create({ pregunta: 'Capital de Italia',
							  respuesta: 'Roma',
							  tema: 'Humanidades'
				});
				Quiz.create({ pregunta: 'Capital de Portugal',
							  respuesta: 'Lisboa',
							  tema: 'Humanidades'
				})
			.then(function(){console.log('Base de datos inicializada.')});
		};
	});
});