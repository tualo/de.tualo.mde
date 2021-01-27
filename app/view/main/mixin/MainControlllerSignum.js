
Ext.define('TualoMDE.view.main.mixin.MainControlllerSignum', {

    onSignumMouseMove: function(e,canvas){
        let  model = this.getViewModel(),
            report = model.get('report');
        let viewXY = this.view.el.getXY(),
            pageXY = e.getXY(),
            canvasRect = canvas.getBoundingClientRect();
        let x = pageXY[0] - canvasRect.x;
        let y = pageXY[1] - canvasRect.y;
        if (model.get('signumDown')){
            report.signum().add({x: x, y:y,pos: report.signum().count()});
            this.drawSignum(canvas);
        }
    },
    onSignumSceneResize: function (component, canvas, size) {
        var barCount = 10,
            barWidth = size.width / barCount,
            barHeight = size.height,
            context = canvas.getContext('2d'),
            colors = d3.scaleOrdinal(d3.schemeCategory20),
            i = 0;

        this.drawSignum(canvas);
    },
    drawSignum: function(canvas){
        let  model = this.getViewModel(),
        rect = canvasRect = canvas.getBoundingClientRect(),
        report = model.get('report');


        var ctx = canvas.getContext("2d");
        ctx.lineWidth = 4;
        var last = {x:-1,y:-1};
        ctx.strokeStyle = "#000";

        ctx.save();
        
        ctx.fillStyle = '#ddd';
        ctx.fillRect(0, 0, rect.width,rect.height);

        report.signum().getRange().forEach(function(item){
//            console.log(item);
            if (last.x!=-1){
                if (item.get('x')!=-1){
                    ctx.beginPath();
                    ctx.moveTo(last.x, last.y);
                    ctx.lineTo(item.get('x'), item.get('y'));
                    ctx.stroke();
                }
            }
            last.x = item.get('x');
            last.y = item.get('y');
            
        });
        ctx.restore();
    },
    onSignumMouseDown: function(e,canvas){
        let  model = this.getViewModel(),
            report = model.get('report');
        let viewXY = this.view.el.getXY(),
            pageXY = e.getXY(),
            canvasRect = canvas.getBoundingClientRect();
        let x = pageXY[0] - canvasRect.x;
        let y = pageXY[1] - canvasRect.y;


        model.set('signumDown',true);
         
        report.signum().add({x: -1, y:-1,pos: report.signum().count()});
        report.signum().add({x: x, y:y,pos: report.signum().count()});
         
    },
    onSignumMouseUp: function(e,canvas){
        let  model = this.getViewModel(),
            report = model.get('report');
        let viewXY = this.view.el.getXY(),
            pageXY = e.getXY(),
            canvasRect = canvas.getBoundingClientRect();
        let x = pageXY[0] - canvasRect.x;
        let y = pageXY[1] - canvasRect.y;

        model.set('signumDown',false);

        report.signum().add({x: x, y:y,pos: report.signum().count()});
        report.signum().add({x: -1, y:-1,pos: report.signum().count()});

    },
});