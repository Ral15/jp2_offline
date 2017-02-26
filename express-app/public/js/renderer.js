$(document).ready(function(){


  $(".submenu > a").click(function(e) {
    e.preventDefault();
    var $li = $(this).parent("li");
    var $ul = $(this).next("ul");

    if($li.hasClass("open")) {
      $ul.slideUp(350);
      $li.removeClass("open");
    } else {
      $(".nav > li > ul").slideUp(350);
      $(".nav > li").removeClass("open");
      $ul.slideDown(350);
      $li.addClass("open");
    }
  });
  
});
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// onload = () => {

// 	const webview = document.getElementById('foo')

// 	webview.addEventListener('dom-ready', () => {
// 	 	webview.openDevTools()
// 		alert(webview.document.getElementById('#estadoDesde'))
// 	})
// }


// function lePico() {
// 	$.get("http://swapi.co/api/films/1/", function(data) {
// 		console.log(data)
// 	})
// }

// const {ipcRenderer} = require('electron')
// const electron = require('electron')
// // Module to control application life.
// const app = electron.app
// const updateOnlineStatus = () => {
// 	ipcRenderer.send('online-status-changed', navigator.onLine ? 'online' : 'offline')
// }

// window.addEventListener('online',  updateOnlineStatus)
// window.addEventListener('offline',  updateOnlineStatus)

// updateOnlineStatus()

// function lepico() {
// 	var content = document.getElementById('first_name');
// 	alert(content)
// 	console.log(content)
// 	ipcRenderer.send('huehue', content)
// }
