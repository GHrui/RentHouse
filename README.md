# RentHouse
[![License: GPL v3](https://img.shields.io/github/license/ghrui/renthouse.svg)](http://www.gnu.org/licenses/gpl-3.0)<br/>
This web application help people(especialy graduates) to find rental house.<br/>
I had get a data of rental house which is in the data file.<br/>
Idea come from [ShiYanLou](https://www.shiyanlou.com/courses/599)<br/>
Data Source is from [58.com](http://bj.58.com/pinpaigongyu/)
## Language
HTML, JavaScript, Python
## Solution for problem
这个DEMO需要在服务器环境上运行,否则会遇到以下问题.
```
XMLHttpRequest cannot load file:///E:2014/DEMO/html_ajax/header.html. Cross origin requests are only supported for protocol schemes: http, data, chrome-extension, https, chrome-extension-resource. 
```
以上错误提示是由于AJAX方法涉及到跨域的问题导致！
由于该网友没有在服务器环境里运行含有ajax方法的页面,而是直接通过浏览器打开（类似file:///的访问形式，即file协议）
本地页面ajax()请求本地页面,须通过服务器环境运行,类似这样：
localhost:127.0.0.1:8888/index.html

注意:如果是在远程服务器里ajax()请求外域服务器里的页面,即使通过服务器环境运行也会报跨域的错误,此时需要通过JSONP的形式！

什么是JSONP？
JSONP(JSON with Padding)是JSON的一种“使用模式”,可用于解决主流浏览器的跨域数据访问的问题.
