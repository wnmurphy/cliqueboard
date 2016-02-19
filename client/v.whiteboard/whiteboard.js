angular.module('collaby.whiteboard', [])

.controller('whiteboardController', function ($scope) {
  $scope.name = 'whiteboard';

  $scope.init = function(){ 
    this.canvas = document.createElement('canvas');
    this.canvas.height = $('.canvas').height();
    this.canvas.width = $('.canvas').width();
    document.getElementsByClassName('canvas')[0].appendChild(this.canvas); //append it into the DOM 

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
  $scope.init();
  //Set up sockets
  $scope.socket = io.connect('http://localhost:4568');

  $scope.socket.on('draw', function(data){
    this.draw(data.x, data.y, data.type); //<--- where are these passed in?
  });

  //Handle draw events
  $('canvas').live('drag dragstart dragend', function(e){
    var type = e.handleObj.type;
    var offset = $(this).offset();
    e.offsetX = e.pageX - offset.left;
    e.offsetY = e.pageY - offset.top;
    var x = e.offsetX;
    var y = e.offsetY;
    $scope.draw(x, y, type);
    $scope.socket.emit('drawClick', { x : x, y : y, type : type});
    
  });
  
});
