const request = require('supertest');
const {app, server, pool} = require('../app');

describe('Test the root path', () => {
	test('It should respond with "Hello World!"', async () => {
		const response = await request(app).get('/');
		expect(response.text).toBe('Hello World!');
		expect(response.statusCode).toBe(200);
	});
}); 

describe('Test the /people path', ()=>{
	test('It should respond with the entire fellowship', async () => {
		const fellowship = [{"id":1,"name":"Gandalf","age":2000,"ancestry":"Maiar"},{"id":2,"name":"Legolas","age":2931,"ancestry":"Elf"},{"id":3,"name":"Gimli","age":139,"ancestry":"Dwarf"},{"id":4,"name":"Aragorn","age":87,"ancestry":"Human"},{"id":5,"name":"Frodo","age":50,"ancestry":"Hobbit"},{"id":6,"name":"Boromir","age":40,"ancestry":"Human"},{"id":7,"name":"Sam","age":38,"ancestry":"Hobbit"},{"id":8,"name":"Meri","age":36,"ancestry":"Hobbit"},{"id":9,"name":"Pippin","age":36,"ancestry":"Hobbit"}];
		const response = await request(app).get('/people');
		expect(response.text).toBe(JSON.stringify(fellowship));
		expect(response.statusCode).toBe(200);
	});
})

describe('Test the olderThan query param', ()=>{
	test('It should respond with Gandalf and Legolas', async () => {
		const elderly = [{"id":1,"name":"Gandalf","age":2000,"ancestry":"Maiar"},{"id":2,"name":"Legolas","age":2931,"ancestry":"Elf"}]
		const response = await request(app).get('/people?olderThan=1000');
		expect(response.text).toBe(JSON.stringify(elderly));
		expect(response.statusCode).toBe(200);
	});
})

describe('Test the youngerThan query param', ()=>{
	test('It should respond with Gimli, Aragorn, Frodo, Boromir, Sam, Meri, and Pippin', async () => {
		const youngsters = [{"id":3,"name":"Gimli","age":139,"ancestry":"Dwarf"},{"id":4,"name":"Aragorn","age":87,"ancestry":"Human"},{"id":5,"name":"Frodo","age":50,"ancestry":"Hobbit"},{"id":6,"name":"Boromir","age":40,"ancestry":"Human"},{"id":7,"name":"Sam","age":38,"ancestry":"Hobbit"},{"id":8,"name":"Meri","age":36,"ancestry":"Hobbit"},{"id":9,"name":"Pippin","age":36,"ancestry":"Hobbit"}];
		const response = await request(app).get('/people?youngerThan=1000');
		expect(response.text).toBe(JSON.stringify(youngsters));
		expect(response.statusCode).toBe(200);
	});
})

describe('Test the ancestry query param', ()=>{
	test('It should respond with just Gandalf', async () => {
		const gandalf = [{"id":1,"name":"Gandalf","age":2000,"ancestry":"Maiar"}]
		const response = await request(app).get('/people?ancestry=Maiar');
		expect(response.text).toBe(JSON.stringify(gandalf));
		expect(response.statusCode).toBe(200);
	});
})

describe('Test the name query param', ()=>{
	test('It should respond with just Frodo', async () => {
		const frodo = [{"id":5,"name":"Frodo","age":50,"ancestry":"Hobbit"}];
		const response = await request(app).get('/people?name=Frodo');
		expect(response.text).toBe(JSON.stringify(frodo));
		expect(response.statusCode).toBe(200);
	});
})

describe('Test combining olderThan and ancestry', ()=>{
	test('It should respond with just Frodo', async () => {
		const frodo = [{"id":5,"name":"Frodo","age":50,"ancestry":"Hobbit"}];
		const response = await request(app).get('/people?olderThan=40&ancestry=Hobbit');
		expect(response.text).toBe(JSON.stringify(frodo));
		expect(response.statusCode).toBe(200);
	});
})

describe('Test combining youngerThan and ancestry', ()=>{
	test('It should respond with Sam, Meri, and Pippin', async () => {
		const youngHobbits = [{"id":7,"name":"Sam","age":38,"ancestry":"Hobbit"},{"id":8,"name":"Meri","age":36,"ancestry":"Hobbit"},{"id":9,"name":"Pippin","age":36,"ancestry":"Hobbit"}];
		const response = await request(app).get('/people?youngerThan=40&ancestry=Hobbit');
		expect(response.text).toBe(JSON.stringify(youngHobbits));
		expect(response.statusCode).toBe(200);
	});
})

describe('Test creating Faramir', ()=>{
	test('It should respond with {success:true}', async () => {
		const response = await request(app).post('/people').send({name:'Faramir', age:36, ancestry:'Human'});
		expect(response.text).toBe(JSON.stringify({success:true}));
		expect(response.statusCode).toBe(200);
	});
})

describe('Test bad create request', ()=>{
	test('It should respond with {success:false}', async () => {
		const response = await request(app).post('/people').send({name:'Faramir', ancestry:'Human'});
		expect(response.text).toBe(JSON.stringify({success:false}));
		expect(response.statusCode).toBe(400);
	});
})

describe('Test delete Gandalf', ()=>{
	test('It should respond with {success:true}', async () => {
		const response = await request(app).delete('/people?name=Gandalf');
		expect(response.text).toBe(JSON.stringify({success:true}));
		expect(response.statusCode).toBe(200);
	});
})

describe('Test Update Request', () => {
	test('It should response with {success:true}', async() => {
		const response = await request(app).put('/people?name=Frodo').send({
			age: 51
		});
		expect(response.text).toBe(JSON.stringify({success:true}));
		expect(response.statusCode).toBe(200);
	});
})

afterAll(done => {
	// Closing the connection allows Jest to exit successfully.
	server.close()
	pool.end()
	done()
})

