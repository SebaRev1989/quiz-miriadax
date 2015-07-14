var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD Sqlite
var sequelize = new Sequelize(null, null, null,
	{dialect:'sqlite', storage:'quiz.sqlite'}
	);

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz;  // Exportar la definición de la tabla

// sequelize.sync() crea e inicializa la tabla de preguntas en la DB
sequelize.sync().then(function() {
	// en el pdf se usa success() pero genera problemas con la versión de sequelize
	// por lo que se cambia por then()
	// then(..) ejecuta el manejador cada vez creada la tabla
	Quiz.count().then(function(count){
		if (count === 0) {  // la tabla se inicializa solo si está vacía
				Quiz.create({ pregunta: 'Capital de Italia',
							  respuesta: 'Roma'
				})
			.then(function(){console.log('Base de datos inicializada.')});
		};
	});
});