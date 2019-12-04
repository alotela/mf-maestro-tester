# MfMaestro tester

A tool to develop MfMaestro compatible microfrontends without MfMaestro.  
It simulates a store and events so that you can use all MfMaestro features when developing your MF in an isolated page.  
Just register your app as you would do (```window.MfMaestro.registerMicroApp("micro-app", {start, stop}```).
In your html page's header, add the script node to load it:  
```<script src="https://unpkg.com/mf-maestro-tester@0.0.2/dist/index.js">```  
and put an id equal to the registered name ("micro-app") on the div where you want to start your application:  
```<div id="micro-app"></div>``` 

If you want to emit events listened by your MF, open the console and type:  
```
window.MfMaestro.events.emit("your event name", yourparams...)
``` 
You can also add callbacks to listen some events with the ```on``` method:  
```window.MfMaestro.events.on("your event name", callback)```  

When your Mf is started by MfMaestro, the start function receives params and options.
If you want to inject params into your MF, you can add a "route" argument to your page's query string, with a json5 payload:
```http://localhost:3000/index.html?route={id:12,sub-id:12344}```

You can also add queryParams available in ```options``` using the ```query``` argument :
```http://localhost:3000/index.html?query={order:asc,page:2}```  

You can use both at the same time to inject in params and options as MfMaestro would do.

If you need to inject params and want it to be always activated, you can add a script node before loading the tester in your page:
```
<script>
MfMaestroAppParams={a:1, b: 2};
</script>
```  

This will be merged with ```route``` from query string.  