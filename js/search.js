(function () {
  document.addEventListener("DOMContentLoaded", function () {

    // Afvent React
    waitForReactApp((container) => {

      // Funktion til at håndtere nye eller eksisterende serieelementer
      function processSeriesLists(root = container) {

        // Dan liste med serie objekter, der ikke er behandlet endnu
        const seriesLists = Array.from(
          root.querySelectorAll('[data-cy^="series-list-"]:not([data-processed])')
        );

        // For hvert element i listen
        seriesLists.forEach(list => {
          list.dataset.processed = 'true'; // Marker som behandlet for at undgå dubletter

          // Find det overordnede kort element
          const card = list.closest('[data-cy="card-list-item"]');
          if (!card) return;

          // Find linket til værket
          const workLink = card.querySelector('a[href*="/work/work-of:"]');
          if (!workLink) return;

          // Ekstraher workId fra linket
          const match = workLink.href.match(/work-of:[^/?#]+/);
          if (!match) return;

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
            variables: { workId: match[0] },
          }).then(data => {

            // Opdater innerHTML i liste elementet
            const series = data.data.work.series?.[0];
            if (!series) return;

            list.innerHTML = `
              <h3 class="text-label-bold">
                ${series.numberInSeries}
                <span class="text-small-caption"> i serien</span>
              </h3>
              <span>
                <a href="/serie?sid=${series.seriesId}" rel="noreferrer" class="link-tag" tabindex="0">
                  ${series.title}
                </a>
              </span>
            `;
          });
        });
      }

      // Kør første gang for elementer, der allerede er på siden
      processSeriesLists();

      // Observer DOM for dynamisk tilføjede elementer (React “Vis flere”)
      const observer = new MutationObserver(mutations => {
        let foundNew = false;

        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType !== 1) continue;

            // Hvis node matcher et serieelement eller indeholder serieelementer
            if (node.matches?.('[data-cy^="series-list-"]') || node.querySelector?.('[data-cy^="series-list-"]')) {
              foundNew = true;
              processSeriesLists(node);
            }
          }
        }

        // Kør igen hvis nye elementer blev fundet (for batch-opdateringer)
        if (foundNew) processSeriesLists();
      });

      // Start observering af containeren for nye kort-elementer
      observer.observe(container, {
        childList: true,
        subtree: true,
      });
    });
  });
})();
