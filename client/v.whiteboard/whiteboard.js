angular.module('collaby.whiteboard', [])

.controller('whiteboardController', function ($scope) {
  $scope.name = 'whiteboard';
  $scope.color = "#bada55";

  // Initialize HTML5 canvas, create new canvas element, append to .canvas div
  $scope.init = function() { 
    this.canvas = document.createElement('canvas');
    this.canvas.height = $('.canvas').height();
    this.canvas.width = $('.canvas').width();
    document.getElementsByClassName('canvas')[0].appendChild(this.canvas); 

    // Store the context
    this.ctx = this.canvas.getContext("2d"); 

    // Set preferences for the line drawing.
    this.ctx.fillStyle = "solid";
    this.ctx.strokeStyle = $scope.color;   
    this.ctx.lineWidth = 1;       
    this.ctx.lineCap = "round";

    // Update drawing color whenever color picker changes.
    var that = this;
    $('#colorpicker').change( function() {
      $scope.color = $('#colorpicker').val();
      that.ctx.strokeStyle = $scope.color;
    });
  };

  //Draw to canvas
  $scope.draw = function(x, y, type, color){
    //set color property
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

  //Run init
  $scope.init();
  
  //Set up socket connection for incoming draw events
  $scope.socket = io.connect('http://localhost:4568');

  // Create draw event listener which triggers local draw event.
  $scope.socket.on('draw', function(data){
    this.draw(data.x, data.y, data.type, data.color); 
  });

  //Handle draw events
  $('canvas').live('drag dragstart dragend', function(e){
    var type = e.handleObj.type;
    var color = $scope.color;
    var offset = $(this).offset();
    //If you're having alignment problems, change 'page' here to 'client' or 'screen'.
    e.offsetX = e.pageX - offset.left;
    e.offsetY = e.pageY - offset.top;
    var x = e.offsetX;
    var y = e.offsetY;
    $scope.draw(x, y, type, color);
    $scope.socket.emit('drawClick', { x : x, y : y, type : type, color: color});
  });

  // Clear the canvas
  $scope.clear = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
  
});
