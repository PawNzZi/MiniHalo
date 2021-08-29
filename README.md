# 演示
![](https://image.lingyikz.cn/miniprodram.png)
![](https://img.shields.io/badge/Author-Roy-brightgreen) ![](https://img.shields.io/badge/Version-v1.0-orange) ![](https://img.shields.io/badge/License-GPL--3.0-blue)
# minihalo

> minihalo是根据halo博客移动api开发的小程序。

halo博客系统部署后只能在web端使用，而halo的强大之处不仅用于写博客，有些业务在web端不是很方便，可以通过api实现小程序端，用户在小程序端就可以更好的增加用户粘性

![](https://image.lingyikz.cn/%E6%8B%BC%E6%8E%A5%E5%9B%BE%20%281%29%20%281%29.jpeg)

## 使用指南
1. 将本项目下载或clone到本地，用微信小程序开发工具打开，打开时选择小程序（非小游戏）,不选择云函数开发，填写自己的appid。
```javascript
git clone https@github.com:PawNzZi/minihalo.git
```

2. 打开根目录app.js文件找到下面代码块，将xxx替换为halo后台设置的签名，访问api时需要鉴权
```javascript
globalData: {AUTHORIZATIONS: 'xxxxxxx'}
```

3. 打开utils/api.js文件找到下面代码块，将xxxx替换为你的halo域名，halo域名必须是https协议
```javascript
const https = 'https://xxx.xxx.xxxx
```

4. 打开pages/user/user.wxml文件找到下面代码块，将图片地址替换为自己的，该图片为个人中心用户头像的背景
```javascript
<view class="user-card" style="background-image: url('http://cdn.lingyikz.cn/1user_backgroud.jpg')"></view>
```

5. 在page目录下的所有js文件里,找到以下代码，将相关信息替换成自己的
```javascript
onShareAppMessage:function(){
    return App.shareAppMessage('13号档案馆', '../../img/share_pictrue.jpg', '/pages/index/index');
  };
onShareTimeline:function(){
    return App.sharePyqMessage('13号档案馆','../../img/share_pictrue.jpg','../../img/share_pictrue.jpg','/pages/index/index');
  };
```

6. 打开微信小程序后台，**开发**==>**开发管理**==>**开发设置**==>**服务器域名**将自己的halo域名添加到request合法域名中

7. 继续在小程序后台，**设置**==>**第三方设置**==>**插件管理**，添加html2wxml富文本组件

8. 登陆halo后台，添加分类和标签

9. 登陆halo后台，打开评论功能

10. 个人中心里的友链，我是利用halo的友链实现的，正常进入halo后台新增友链，
网站名称：填写成你自己的（小程序名称）
分组：```miniprogram```
描述：```{"appId":"小程序appid","path":"小程序跳转路径"}```


# 注意：
- 首页banner后的背景色和状态栏颜色是根据banner图主色动态设置的，如想使用该功能，需满足两个条件；
1. 图片资源必须是https协议，例如我用的是七牛云存储图片，七牛云的域名设置成https协议；
2. 将该域名添加至小程序后台的dowmload合法域名中，参考上面第5步；
- 如不想使用该功能，可注释掉相关代码；
- 项目中img目录是用来存放静态资源的，包括tabbar和空状态等，可根据自己的需要做替换；
- 代码中基本上都写有注释，有条件的基友可根据自己需求自行修改；
- 使用过程有任何疑问和bug可添加QQ245920672或在issue中反馈；
- 目前实现了基本的功能，后续会添加新的需求和管理员操作。
- 在开发工具中搜索：fwmeng_vip@163.com，搜索到的全部修改为自己的邮箱或特定邮箱（该作用主要用来区分评论来自web还是小程序）

# 主要特性

- 首页banner后的背景色动态设置；
- 坚持简约风格，简单粗暴，不喜欢花里胡哨，功能紊乱；
- 用户可对文章进行评论和喜欢；
- 评论数据与web打通，web评论可在小程序查看，并显示该评论来自web、小程序或管理员;
- 可回复他人的评论；

# 感谢
- [halo](https://github.com/halo-dev/halo "halo") ：一款优秀的开源博客发布应用。
- [vant-weapp](https://github.com/youzan/vant-weapp " vant-weapp") ：轻量、可靠的小程序 UI 组件库。
- [html2wxml](https://github.com/qwqoffice/html2wxml "html2wxml") ：用于微信小程序的HTML和Markdown格式的富文本渲染组件，支持代码高亮
- [mini-add-tips](https://github.com/MakerGYT/mini-add-tips "mini-add-tips") ：用于提示用户首次进入小程序时，点击右上角菜单进行【添加到我的小程序】操作


