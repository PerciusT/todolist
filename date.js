//jshint esversion:6
exports.getDate = function(){
		const options={
			weekday:"long",
			day:"numeric",
			month:"long"
		}
		let today = new Date();
		return today.toLocaleDateString('en-us',options) 
	}
exports.getDay=function(){
		const options={
			weekday:"long"
		}
		let today = new Date();
		return today.toLocaleDateString('en-us',options)
	}
