# MfMaestro tester

A tool to develop MfMaestro compatible microfrontends without MfMaestro.  
It simulates a store and events so that you can use all MfMaestro features when developing your MF in an isolated page.  
Just register your app as you would do (```window.MfMaestro.registerMicroApp("micro-app", {start, stop}```).
In your html page's header, add the script node to load it:  
```<script src="https://unpkg.com/mf-maestro-tester@0.0.6/dist/index.js">```  
and put an id equal to the registered name ("micro-app") on the div where you want to start your application:  
```<div id="micro-app"></div>``` 

If you want to emit events listened by your MF, open the console and type:  
```
window.MfMaestro.events.emit("your event name", yourparams...)
``` 
You can also add callbacks to listen some events with the ```on``` method:  
```window.MfMaestro.events.on("your event name", callback)```  

When your Mf is started by MfMaestro, the start function receives params and options.
If you want to inject params into your MF (url params), you can add a "params" argument to your page's query string, with a json5 payload:
```http://localhost:3000/index.html?params={id:12,sub-id:12344}```

You can also add queryParams available in ```options``` using the ```query``` argument :
```http://localhost:3000/index.html?query={order:asc,page:2}```  

You can use both at the same time to inject in params and options as MfMaestro would do.

If you need to inject params and want it to be always activated, you can add a script node before loading the tester in your page:
```
<script>
MfMaestroAppParams={a:1, b: 2};
</script>
```  

This will be merged with ```params``` from query string.  

## events queue for tests

All emitted events are logged in a queue available on ```window.MfMaestro.outputEventsQueue```. An event is logged as a tuple ```[event, args]``` (string, array).  
If you want to test for an event, you can use ```window.MfMaestro.eventHasBeenEmitted(event, args, options)```.  
Args is an array with all args you passed to emit, AFTER the event name. Since it is optional, if you don't specify it, and call ```window.MfMaestro.eventHasBeenEmitted(event)```, it will be equal to an empty array.  
Options is optional and accepts these attributes:  

- **count** : the number of times you expect the event has been emitted  

You can have a look at the ```tests/test.js``` to find examples.  

## navigation

you can test for navigations block/unblock with these methods:

- ```window.MfMaestro.isNavigationBlocked("myContext")```
- ```window.MfMaestro.isNavigationUnblocked("myContext")```

When you call ```options.navigation.blockNavigation()``` or ```options.navigation.unblockNavigation()```, just pass a context as arg. It will do nothing in MfMaestro, but will allow to test that navigation block/unblock have been called.  