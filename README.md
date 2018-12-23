# fuchsia-web-demo
Pink + Purple + Web == Fuchsia Web Demo - (unofficial)

## Description

The Fuchsia Web Demo tried to simulate the UI and animations of Fuchsia OS Armadillo. RIP Armadillo [LINK](https://mgoulao.github.io/fuchsia-web-demo/)

## Images

![alt text](https://github.com/mgoulao/fuchsia-web-demo/blob/master/resources/print_1.png)
![alt text](https://github.com/mgoulao/fuchsia-web-demo/blob/master/resources/print_2.png)
![alt text](https://github.com/mgoulao/fuchsia-web-demo/blob/master/resources/print_3.png)

## Create Dummy App

This repo goal is also to show simple dummy Apps with a futuristic UI.

To create an App you can use this template:

```
<html>
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css">
</head>
<body>
  
  <!--Content-->
	
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
  <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>
</body>
</html>
```

And then:

* Go to ```js/index.js``` and add your app to the appData variable with this format:
```
"yourAppId": {
    "title": "Title",
    "color": "#3F51B5",
    "id": "yourAppId",
    "image": "resources/empty.png",
    "text": "",
    "content": "<div style='position:relative;height:100%;overflow:hidden'><iframe src='YOUR_APP_HTML' allowfullscreen></iframe></div>"
},
```

## Built With

* [MDC](https://github.com/material-components/material-components-web) - UI components
* [jQuery](https://jquery.com/) - The JavaScript library used
* [jQuery UI](https://jqueryui.com/)
* [Fuse.js](http://fusejs.io/) - Search library

## Authors

* **Manuel Goulão** - [mgoulao](https://github.com/mgoulao)

See also the list of [contributors](https://github.com/mgoulao/fuchsia-web-demo/contributors) who participated in this project.
