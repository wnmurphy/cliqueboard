angular.module('collaby.whiteboard', [])

.controller('whiteboardController', function ($scope) {
  $scope.name = 'whiteboard';

  $scope.init = function(){ 
    this.canvas = document.createElement('canvas');
    this.canvas.height = 400;
    this.canvas.width = 800;  //size it up
    document.getElementsByTagName('article')[0].appendChild(this.canvas); //append it into the DOM 

    this.ctx = this.canvas.getContext("2d"); // Store the context 

    // set preferences for our line drawing.
    this.ctx.fillStyle = "solid";
    this.ctx.strokeStyle = "#bada55";   
    this.ctx.lineWidth = 5;       
    this.ctx.lineCap = "round";
  };

  //Draw to canvas
  $scope.draw = function(x, y, type){
    if (type === "dragstart"){
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
    }else if (type === "drag"){
      this.ctx.lineTo(x,y);
      this.ctx.stroke();
    }else{
      this.ctx.closePath();
    }
    return;
  };

  // Set up sockets
  $scope.socket = io.connect('http://localhost:4568');

  $scope.socket.on('draw', function(data){
    this.draw(data.x, data.y, data.type); //<--- where are these passed in?
  });

  // Handle draw events
  $('canvas').live('drag dragstart dragend', function(e){
    type = e.handleObj.type;
    offset = $(this).offset();
    e.offsetX = e.layerX - offset.left;
    e.offsetY = e.layerY - offset.top;
    x = e.offsetX;
    y = e.offsetY;
    this.draw(x, y, type);
    this.socket.emit('drawClick', { x : x, y : y, type : type});
    return;
  });
  
});
