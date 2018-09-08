 //imgUrl是一个对象
 //fn：是加载完毕后，把资源传给这个回调函数
 function loadImg (imgUrl,fn) {
    //图片加载完以后的数据
    var imgObj = {};
    //零时变量，用于创建图片对象
    var imgTemp;
    //图片的数量
    var imgLength = 0;
    //加载完成的图片数量
    var imgLoad = 0;
    for (var key in imgUrl) {
      //得到有多少张图片
      imgLength++;
      //创建图片对象
      imgTemp = new Image();
      imgTemp.onload = function () {
        //图片加载完成的数量
        imgLoad++;
        //图片加载完成的大于等于有多少张图片时证明图片加载完成了，并执行回调函数
        if(imgLoad >= imgLength) {
          //回调函数传入的参数即遍历得到的数据
          fn(imgObj);
        }
      };
      //设置图片路径
      imgTemp.src = imgUrl[key];
      //把遍历到的数据存入imgObj中
      imgObj[key] = imgTemp;
    }
  }