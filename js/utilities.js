// Global function

(function () {  

  window.waitForReactApp = function (
    callback,
    {
      selector = '[class^="ssc"]', // matches elements whose class starts with "ssc"
      interval = 300,
      timeout = 10000,
      container = document // optional parent container
    } = {}
  ) {
    const start = Date.now();

    const timer = setInterval(() => {
      const stillRendering = container.querySelectorAll(selector).length > 0;

      if (!stillRendering) {
        clearInterval(timer);
        callback(container);
      }

      // Stop polling after timeout
      if (Date.now() - start > timeout) {
        clearInterval(timer);
      }
    }, interval);
  };

  // Wait for React app to render in specified containers, then execute callback.
  window.waitForReactAppVersion2 = function (callback, selector = '[class^="dpl-react-app-container--"]', interval = 300, timeout = 10000) {

    const start = Date.now();

    const timer = setInterval(() => {
      const containers = document.querySelectorAll(selector);
      containers.forEach(container => {
        if (container.dataset.reactAppDetected) return;

        // Check if container has any children (or specific React markers)
        const hasRendered = container.children.length > 0 ||
          container.querySelector('.page-material__title') ||
          container.querySelector('[data-reactroot], [data-reactid]');

        if (hasRendered) {
          container.dataset.reactAppDetected = 'true';
          callback(container);
        }
      });

      // Stop timer after timeout
      if (Date.now() - start > timeout) {
        clearInterval(timer);
      }
    }, interval);
  };
  
  // --- Helper: get token ---
  async function getToken(type = "library") {
    try {
      const res = await fetch("/dpl-react/user-tokens");
      const js = await res.text();
      
      const matches = {
        library: js.match(/setToken\("library",\s*"([^"]+)"\)/),
        user: js.match(/setToken\("user",\s*"([^"]+)"\)/)
      };

      const token = matches[type]?.[1];
      if (token) return token;

      throw new Error("Library token not found");
    } catch (err) {
      console.error("Error fetching token:", err);
      return "";
    }
  }

  // --- Helper: get query param ---
  function getQueryParam(param) {
    return new URLSearchParams(window.location.search).get(param);
  }

  // --- Helper: fetch GraphQL ---
  async function fetchData(token, gql) {
    const response = await fetch("https://fbi-api.dbc.dk/opac/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: gql,
    });
    if (!response.ok) {
      const msg = await response.text();
      throw new Error(`Remote fetch failed: ${response.status} ${msg}`);
    }
    return response.json();
  } 

  window.fbiQuery = async function (gqlQuery) {
    try {
      const token = await getToken();
      if (!token) throw new Error("Missing library token");
      const data = await fetchData(token, JSON.stringify(gqlQuery));
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  /* Hent query parametre */

  window.getQueryParam = function (param) {
      const params = new URLSearchParams(window.location.search);
      return params.get(param);
    }

  /* Oversættelses funktion */

  window.i18n = function(word) {
    switch (word) {
      case "ANALYSIS":
        return "Analyse";
      case "ARTICLE":
        return "Artikel";
      case "BOOKDESCRIPTION":
        return "Bog beskrivelse";
      case "GAME":
        return "Spil";
      case "LITERATURE":
        return "Bøger";
      case "MAP":
        return "Kort";
      case "MOVIE":
        return "Film";
      case "MUSIC":
        return "Musik";
      case "OTHER":
        return "Andet";
      case "PERIODICA":
        return "Tidsskrift";
      case "PORTRAIT":
        return "Portræt";
      case "REVIEW":
        return "Anmeldelse";
      case "SHEETMUSIC":
        return "Noder";
      case "TRACK":
        return "Nummer";
      default:
        return word;
    }
  }
  
})();

/* Materiallist funktioner */

window.addMaterialistItem = function (list, item) { }

window.removeMaterialistItem = function (list, item) { }

window.isMaterialistItemInList = function (list, item) { }