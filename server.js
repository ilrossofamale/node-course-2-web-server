const express = require('express');
const hbs = require('hbs');
const fs = require('fs');



var app = express();

//configurazione dei parziali(includes) di handlebars
hbs.registerPartials(__dirname + '/views/partials/');

//configurazione dell'app express per usare handlebars come motore di rendering
app.set('view engine','hbs');


/* ---- I MIDDLEWARE SONO ESEGUITI NELL'ORDINE IN CUI SONO SCRITTI ---- */

// middleware con cui dichiaro da dove posso servire contenuti statici (/public/help.html) non blocco niente, se volessi impedire la fruizione dei file statici mi basta spostarlo dopo il middleware del maintainance
//__dirname = variabile express contiene la root del sito
//app.use(express.static(__dirname + '/public'));

//middleware per il server log: questa funzione si inserisce prima della risposta di OGNI SINGOLA PAGINA, va specificato il metodo next() altrimenti la fruizione della pagina si blocca
app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;
	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if(err) {
			console.log('Non sono riuscito a scrivere sul file');
		}
	});
	next();
});

//middleware - senza il next() questo middleware blocca l'esecuzione di ogni pagina e ti manda alla pagina manutnzione
/* commentato per non bloccare
app.use((req, res, next) => {
	res.render('maintainance.hbs');
})
*/
// middleware con cui dichiaro da dove posso servire contenuti statici (/public/help.html) non blocco niente, se volessi impedire la fruizione dei file statici mi basta spostarlo dopo il middleware del maintainance
//__dirname = variabile express contiene la root del sito
app.use(express.static(__dirname + '/public'));

/* ---- FINE MIDDLEWARE ---- */

//Definisco un helper a livello globale di handlebars da potrer utilizzare in ogni template
hbs.registerHelper('getCurrentyear', () => {
	return new Date().getFullYear();
});

//Definisco un helper che mi trasforma i testi in uppercase passando la variabile attraverso l'invocazione nel template (vedi home.hbs)
hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
})

/*
	DEFINIZIONE BASE DEL ROUTING
	1) / = Riferito alla ROOT pagina index
	2) /about = Una qualsiaso altra pagina che rispondera alla URL http://localhost:3000/about
	3) /bad = Pagina di errore
*/


//1)
app.get('/', (req,res) => {
//req:la request; res:la response

	//Questo verrà INVIATO da express come TEXT/HTML
	//res.send('<h1>Hello Express!</h1>');

	//Questo oggetto verrà INVIATO da express come JSON
	/*res.send({
		name: "Marco",
		likes: [
			'La famiglia',
			'Il gelato'
		]
	});*/

	//Con Handlebars e passaggio di dati dinamici (il secondo parametro)
	res.render('home.hbs',{
		pageTitle: 'Home Page',
		welcomeText: 'Benvenuto sul sito prova'
	});
});


//2)
app.get('/about',(req, res) => {
	//Senza template Handlebars
	//res.send('About Page');

	//Con Handlebars e passaggio di dati dinamici (il secondo parametro)
	res.render('about.hbs',{
		pageTitle: 'About Page'
	});
})


app.get('/bad', (req, res) => {
	res.send({
		errorMessage:"Qualche cosa è andato storto"
	});
});


//START SERVER
app.listen(3000, () => {
	console.log('Server è sulla porta 3000');
});