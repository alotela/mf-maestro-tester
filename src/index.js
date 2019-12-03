startStubbedMaestro();

function startStubbedMaestro() {
  const callbacksStore = {};
  const options = buildStubbedMfMaestroOptions(callbacksStore);

  window.MfMaestro = {
    events: options.events,
    registerMicroApp: function(microAppName, microAppObject) {
      microAppObject.start(
        document.getElementById(microAppName),
        window.MfMaestroAppParams || {},
        options
      );
    }
  };
}

function buildStubbedMfMaestroOptions(callbacksStore) {
  return {
    groupRef: "hooked-react-app@groupRef",
    events: {
      emit: (event, ...args) =>
        callbacksStore[event]
          ? callbacksStore[event].forEach(cbk => cbk(...args, event))
          : null,
      on: (event, callback, context) =>
        callbacksStore[event]
          ? callbacksStore[event].push(callback)
          : (callbacksStore[event] = [callback]),
    },
  };
}
