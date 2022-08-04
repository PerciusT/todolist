//jshint esversion6
//BOILERPLATE
const express = require('express');
const bodyparser = require('body-parser');
const ejs=require('ejs');
const app = express();
const date = require(__dirname+'/date.js')
const mongoose = require ("mongoose")
const _=require("lodash");

mongoose.connect("mongodb+srv://PerciusT:test123@cluster0.idqnafo.mongodb.net/todoDB",{useNewUrlParser:true});
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"))
app.set('view engine','ejs');


const todoSchema=new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	done:{
        type: Boolean,
        default: false
	}
})


const listSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	items:[todoSchema]
})

const todo = mongoose.model("Todo", listSchema);
const list = mongoose.model("List", todoSchema);
const worklist = mongoose.model("List", todoSchema);
//GET REQUESTS

let item={}

let workitem={}
// worklist.find(function(err,items){
// 	items.forEach(function(i){
// 		console.log(i)
// 		workitem['list'+b]=i.name;
// 		b++
// 	})
// })
// var item =[]
// let a=0;
let b=0;
app.get("/",function(req,res){
	// let day = {
	// 		"1":"Sunday",
	// 		"2":"Monday",
	// 		"3":"Tuesday",
	// 		"4":"Wednesday",
	// 		"5":"Thursday",
	// 		"6":"Friday",
	// 		"7":"Saturday"
	// 	}
	
	// let day=date()
	list.find({done:"false"},function(err,items){
				res.render('list.ejs',{weekday:date.getDate(),newListItems:items,post:''});
			})
	// process.kill(process.pid, 'SIGTERM');
	// process.exit()
})

app.get('/:id',function(req,res){
	req.params.id=_.capitalize(req.params.id)
	todo.findOne({name:req.params.id},function(err,itemr){
		
		if(!itemr)
		{
				const mlist = new todo({
					name: req.params.id,
					items: []
				})
				mlist.save()
				res.redirect('/'+req.params.id)
		}
		else
		{
			// console.log(itemr)
			let x=0
			itemr.items.forEach((i)=>{
				if(itemr.items[x].done==true)
				{
					itemr.items.splice(x,1)
					console.log(i)
				}
				x++
			})
					
 				res.render('list.ejs',{weekday:req.params.id,newListItems:itemr.items,post:req.params.id});
		}
		// 
	})
	
})
//POST REQUESTS

app.post('/',function(req,res){
	// item.push(req.body.newTodo)
	const items = new list ({
		name:req.body.newTodo
	})
	items.save()
	res.redirect('/')
})
app.post('/del',function(req,res){
	list.updateOne({_id:req.body.checker},{done:"true"},function(err){
		// console.log(err)
	})
	res.redirect('/')
})
app.post('/del:id',function(req,res){
	todo.findOne({name:req.params.id},function(err,itemr){
			// console.log(items.done)
			let x=0
			itemr.items.forEach((i) => {
				if(i._id==req.body.checker)
				{
					// console.log(itemr)

					itemr.items[x].done=true
					x=0;
				}
				else
				{
					x++;
				}
				todo.updateOne({_id:itemr._id},{items:itemr.items},function(err){
				// console.log(err)
			})
			})
			// console.log(itemr.items)
		// 
	})
	

	res.redirect('/'+req.params.id)
})
app.post('/:id',function(req,res){
	todo.findOne({name:req.params.id},function(err,itemr){
			let givenInput = {
				name:req.body.newTodo
			}
			itemr.items.push(givenInput)
			// console.log(itemr)
			todo.updateOne({_id:itemr._id},{items:itemr.items},function(err){
				// console.log(err)
			})
			// console.log(itemr.items)
		// 
	})
	res.redirect('/'+req.params.id)
})
//PORT
app.listen(process.env.PORT||3000, function(){
	console.log("Listening on 3000");
})
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});
