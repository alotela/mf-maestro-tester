import JSON5 from 'json5';
import FDE from 'fast-deep-equal';

startStubbedMaestro();

function startStubbedMaestro() {
  const callbacksStore = {};
  const outputEventsQueue = [];
  const navigationQueue = [];
  const options = buildStubbedMfMaestroOptions(callbacksStore, outputEventsQueue, navigationQueue);
  const params = getUrlParams();

  window.MfMaestro = {
    events: options.events,
    isNavigationBlocked: (context) => {
      return navigationQueue.includes(`Navigation blocked ${context}`);
    },
    isNavigationUnblocked: (context) => {
      return navigationQueue.includes(`Navigation unblocked ${context}`);
    },
    eventHasBeenEmitted: (event, args, options) => {
      if (!options) options = {};
      if (!options.count) options.count = 1;
      const emittedEvents = outputEventsQueue.filter(
        (queuedEvent) => FDE(queuedEvent, [event, args])
      );

      const result = {
        events: emittedEvents,
        count: emittedEvents.length,
        isOk: true,
        errors: []
      }

      result.isOk = result.count === options.count;

      if (result.isOk) return result;

      if(result.count !== options.count) {
        result.errors.push(`events pushed ${result.count} times.`);
      }

      return result;
    },
    navigation: options.navigation,
    outputEventsQueue,
    registerMicroApp: function (microAppName, microAppObject) {
      microAppObject.start(
        document.getElementById(microAppName),
        { ...(window.MfMaestroAppParams || {}), ...params.routeParams },
        { ...options, ...params.queryParams }
      );
    }
  };
}

function buildStubbedMfMaestroOptions(callbacksStore, outputEventsQueue, navigationQueue) {
  return {
    groupRef: "hooked-react-app@groupRef",
    events: {
      emit: (event, ...args) => {
        outputEventsQueue.push([event, args]);
        callbacksStore[event]
        ? callbacksStore[event].forEach(cbk =>  cbk(...args, event) )
          : null;
        },
      on: (event, callback, context) =>
        callbacksStore[event]
          ? callbacksStore[event].push(callback)
          : (callbacksStore[event] = [callback]),
    },
    navigation: {
      blockNavigation: (context) => {
        console.log(`Navigation blocked ${context}`);
        navigationQueue.push(`Navigation blocked ${context}`);
      },
      unblockNavigation: (context) => {
        console.log(`Navigation unblocked ${context}`);
        navigationQueue.push(`Navigation unblocked ${context}`);
      }
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

