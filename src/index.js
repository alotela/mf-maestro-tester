import JSON5 from 'json5';

startStubbedMaestro();

function startStubbedMaestro() {
  const callbacksStore = {};
  const options = buildStubbedMfMaestroOptions(callbacksStore);
  const params = getUrlParams();

  window.MfMaestro = {
    events: options.events,
    registerMicroApp: function (microAppName, microAppObject) {
      microAppObject.start(
        document.getElementById(microAppName),
        { ...(window.MfMaestroAppParams || {}), ...params.routeParams },
        { ...options, ...params.queryParams }
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
    navigation: {
      blockNavigation: () => console.log("Navigation blocked"),
      unblockNavigation: () => console.log("Navigation unblocked")
    },
  };
}

function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    routeParams: JSON5.parse(urlParams.get('params')) || {},
    queryParams: JSON5.parse(urlParams.get('query')) || {}
  };
}

