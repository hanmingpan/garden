关于flexible的第一篇介绍文章是`大漠`的《[使用Flexible实现手淘H5页面的终端适配][1]》。请先阅读这篇文章再来看本文。

三年前看的时候就一个感觉`Perfect`，还有这么神奇的操作，但是深入到原理就有点似懂非懂，向其他同学推荐的时候，总有些细节讲不清楚。究其原因是自己没有深入了解“为什么会产生这样的解决方案？”。


rem如何计算？
--------

这种方案受到`vw`这个单位的启发，100vw等于设备宽度，跟具体像素无关，有点类似100%。但百分比无法解决宽高比的问题。

rem单位是参照根节点的font-size为依据，所以只要根据设备宽度来除以100份，动态计算根节点的字体大小，就能hack这个vw的效果。

    1vw = (ClietWidth/100)= htmlFontSize = 1rem

flexible将页面分成了10份，为什么不像vw单位一样是100份呢？拿iPhone4举例，宽度为320px，如果是100份，1rem=3.2px，目前大部分浏览器不支持12px以下的字体大小，所以320/12=26.67，最多可以将页面分成26份，方便计算取整数10，1rem=(320/10)=32px。


dpr有什么用？
-------

先看一下设备的实际像素与css像素的统计图。

![图片描述][2]

在iphone4之前没有视网膜屏幕，一个设备像素等于一个css像素。最开始的移动端网站大多是按照240px或320px的设计图开发，iphone3GS就是320px，那么在iPhone4的640px上，整个网站只能显示一半，看起来很奇怪。就算厂商会自动缩放整个网站来适配
屏幕，也无法解决固定像素的问题。

![图片描述][3]

考虑到这方面的影响，iPhone4的物理像素比（devicePixelRatio）dpr=2，将一个像素的宽度和高度都扩大二倍，手机在底层对网站进行了显示上的放大，这样一来屏幕对于原有的网站还是320px。


viewport的改变能带来什么？
-----------------

这是计算rem的关键代码

    var docEl = document.documentElement
    var rem = docEl.clientWidth / 10
    docEl.style.fontSize = rem + 'px'
    
`clientWidth`是根元素的可视宽度，如果viewport缩放scale=1.0，那么对于iPhone4的clientWidth=320px，如果scale=0.5，那么clientWidth=640px，无论如何改变viewport值，rem都等于根节点可视宽度的1/10。

`老版本0.3.2`里有这样一段。

    var isAndroid = win.navigator.appVersion.match(/android/gi);
    var isIPhone = win.navigator.appVersion.match(/iphone/gi);
    var devicePixelRatio = win.devicePixelRatio;
    if (isIPhone) {
      // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
      if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
          dpr = 3;
      } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
          dpr = 2;
      } else {
          dpr = 1;
      }
    } else {
      // 其他设备下，仍旧使用1倍的方案
      dpr = 1;
    }
    scale = 1 / dpr;
    
动态去计算scale，并不影响rem的计算，好处是解决了1px的问题，坏处是破坏了css媒介media。
老版本对android不支持高清方案，是个缺陷。


`新版本2.0`里面则去掉了动态计算scale的方式，改为检测是否支持0.5px的特性，通过添加类名`hairlines`来向下兼容

    // detect 0.5px supports
    if (dpr >= 2) {
        var fakeBody = document.createElement('body')
        var testElement = document.createElement('div')
        testElement.style.border = '.5px solid transparent'
        fakeBody.appendChild(testElement)
        docEl.appendChild(fakeBody)
        if (testElement.offsetHeight === 1) {
            docEl.classList.add('hairlines')
        }
        docEl.removeChild(fakeBody)
    }


效果图和rem计算方式的联系是什么？
------------------

css里的1rem=clientWidth/10，效果图与设备像素计算的共同关联是都把屏幕分成10份，那么iphone4效果图里的1rem=(640/10)=64px。
所以css的转化基础永远是width/10。


结语
--

这篇文章主要是记录思考为什么这样做的解答。希望有更多的疑问来让我们一起思考。

如今淘宝家也升级了适配方案，拥抱真正的vw。参考大漠后来的文章《[再聊移动端页面的适配》][4]


  [1]: https://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html
  [2]: /img/bVbcwfI
  [3]: /img/bVbcwcv
  [4]: https://www.w3cplus.com/css/vw-for-layout.html