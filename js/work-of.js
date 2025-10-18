(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // Afvent React
    waitForReactApp((container) => {

      // Find elementet til at indsætte data i
      const target = container.querySelector('[data-cy="material-description-series-0"]');

      // Hvis der er et element, så lav en GraphQL forespørgsel
      if (target) {

        // GrapgQL forespørgsel
        const graphql = JSON.stringify({
          query: `query WorkSeries($workId: String!) {
            work(id: $workId) {
              series {
                title
                numberInSeries
                seriesId
              }
            }
          }`,
          variables: { workId: "work-of:870970-basis:05086124" },
        });

        // Kald fbiQuery med forespørgslen
        fbiQuery({
          query: `query WorkSeries($workId: String!) {
            work(id: $workId) {
              series {
                title
                numberInSeries
                seriesId
              }
            }
          }`,
          variables: { workId: "work-of:870970-basis:05086124" },
        }).then(data => {

          // Opdater indholdet i target elementet
            target.innerHTML = `
            <h3 class="text-label-bold">Del 3 <span class="text-small-caption"> i serien</span></h3>
            <span><a href="/serie?sid=${data.data.work.series[0].seriesId}" rel="noreferrer" class="link-tag" tabindex="0">${data.data.work.series[0].title}</a></span>
          `;
     
        });     
                  
        } else {
          return;
        }
      });
    });
})();