
    //绘制背景
    function Sky (ctx,img,speed) {
      this.ctx = ctx;
      this.img = img;
      this.speed = speed || 2;
      this.width = this.img.width;
      this.height = this.img.height;
      //创建一个实例就自增
      Sky.lengths++;
      //根据实例创建个数设置x轴的起始绘制坐标(第一个从0开始,以此类推，所以需要减一)
      this.x = this.width * (Sky.lengths - 1);
      this.y = 0;
    };
    //Sky实例的数量
    Sky.lengths = 0;

    Sky.prototype = {
      constructor: Sky,
      draw: function () {
        this.ctx.drawImage(this.img,this.x,this.y);
      },
      //背景运动，通过x轴的坐标变化
      update: function () {
        this.x -= this.speed;
        //无缝滚动原理
        if(this.x <= -this.width) {
          this.x += this.width * Sky.lengths;
        }
      }
    };

    //绘制大地
    function Land(ctx,img ,speed) {
      this.ctx = ctx;
      this.img = img;
      this.speed = speed || 2;

      Land.lengths++;
      this.x = this.img.width * (Land.lengths - 1);
      this.y = this.ctx.canvas.height - this.img.height;
    };
    Land.lengths = 0;
    Land.prototype = {
      constructor: Land,
      draw: function () {
        this.ctx.drawImage(this.img,this.x,this.y);
      },
      update: function () {
        this.x -= this.speed;
        this.x += this.x <= -this.img.width ? this.img.width * Land.lengths : 0;
      }
    };

    //绘制管道
    //imgDown是开口向下的图片，imgUp是开口向上的图片
    //space是上下图片的间距，landHeight是大地的高度
    function Pipes(ctx,imgDown,imgUp,space,speed,landHeight) {
      this.ctx = ctx;
      this.imgDown = imgDown;
      this.imgUp = imgUp;
      this.speed = speed || 2;
      this.space = space || 100;
      this.landHeight = landHeight;
      this.width = this.imgDown.width;
      this.height = this.imgDown.height;
       Pipes.lengths++;
       //乘以3是因为每个管道需要占3个宽度(就是管道之间的距离，可以调整)
      this.x = 200 + this.width * (Pipes.lengths - 1) * 3;
      this.y = 0;
      this.init();
    };
    Pipes.lengths = 0;
    Pipes.prototype = {
      constructor: Pipes,
      init:function () {
        //管道的最大高度
        var maxHeight = this.ctx.canvas.height - this.landHeight - this.space -50;
        // 随机生成上管道的高度在 50 到 maxHeight 之间
        var randomHeight = maxHeight * Math.random();
        randomHeight = randomHeight < 50 ? 50 : randomHeight;
        //上管道的y轴坐标 = 随机生成的高度-图片本身的高度
        this.downY = randomHeight - this.height;
        //下管道的y轴坐标 = 随机生成的高度+间距
        this.upY = randomHeight + this.space;
      },
      draw: function () {
        this.ctx.drawImage(this.imgDown,this.x,this.downY);
        this.ctx.drawImage(this.imgUp,this.x,this.upY);
        this.drawPath();
      },
      //根据图片绘制相应的路径,路径用来判断小鸟是否撞上管道
      drawPath: function () {
        this.ctx.rect(this.x,this.downY,this.width,this.height);
        this.ctx.rect(this.x,this.upY,this.width,this.height);
      },
      //更新下一帧动画
      update: function () {
        this.x -= this.speed;
        if(this.x <= -this.width) {
          //重新生成高度
          this.init();
          this.x += this.width * Pipes.lengths *3;
        }
      }
    };

    //绘制小鸟
    //wFrame是小鸟横向的帧数，hFrame是纵向的帧数
    function Bird(ctx,img,wFrame,hFrame,x,y) {
      this.ctx = ctx;
      this.img = img;
      this.wFrame = wFrame;
      this.hFrame = hFrame;
      this.x = x;
      this.y = y;
      this.width = this.img.width / this.wFrame;
      this.height = this.img.height / this.hFrame;
      //当前绘制的帧数(从零开始)
      this.currentFrame = 0;
      //小鸟下落速度
      this.speed = 3;
      //加速度
      this.speedPlus = 0.5;
      this.moveup();
    };
    Bird.prototype = {
      constructor: Bird,
      draw: function () {
        // 当下落速度为1的时候，旋转10度，旋转基准值
        var baseRadian = Math.PI / 180 * 10;
        //最大旋转值
        var maxRadian = Math.PI / 180 * 45;
        //动态旋转值，根据速度相应变化
        var rotateRadian = baseRadian * this.speed;
        rotateRadian = rotateRadian >= maxRadian ? maxRadian : rotateRadian;

        //save()可以保存当前状态，而restore()可以还原之前保存的状态。
        this.ctx.save();
        /*
          * 1、平移到小鸟的中心点
          * 2、然后根据下落的速度旋转坐标系
          * 3、绘制小鸟，但是绘制的x和y坐标变为负的宽高一半。
          * */
        this.ctx.translate(this.x + this.width/2,this.y + this.height/2);
        this.ctx.rotate(rotateRadian);
        this.ctx.drawImage(this.img,
          this.currentFrame * this.width,0,
          this.width,this.height,
          -this.width/2,-this.height/2,
          this.width,this.height);
        this.ctx.restore();
      },
      //小鸟帧动画
      update: function () {
        //绘制下一帧
        this.currentFrame = ++this.currentFrame >= this.wFrame ? 0 : this.currentFrame;
        //通过改变Y轴的坐标实现小鸟的下落
        this.y += this.speed;
        //更新速度，实现加速度的效果
        this.speed += this.speedPlus;
      },
      //鼠标点击画布，小鸟向上运动
      moveup: function () {
        this.ctx.canvas.addEventListener('click',function () {
          //修改速度为负值，小鸟就会向上运动
          this.speed = -5;
        }.bind(this))
      }
    };