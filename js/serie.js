// Serievisning

(function () {
  document.addEventListener("DOMContentLoaded", function () {

      // Find elementet til at indsætte data i
      const container = document.getElementById("main-content");
      
      // Hvis der er et element, så lav en GraphQL forespørgsel
      if (container) {

        // Funktion til at rendere serier
        function renderSeries(container, series) {
          container.innerHTML = `
            <section class="paragraphs serie">
              <div class="material-grid">
                <div class="material-grid__text-wrapper">
                  <h2 class="material-grid__title">${series.title} - serien</h2>
                  ${series.description ? `<p class="description">${series.description}</p>` : ""}
                  ${
                    series.members[0].work.universes.length
                      ? `<p><span>En del af </span>
                        <a href="/univers/?pid=${series.members[0].work.universes[0].universeId}">
                            ${series.members[0].work.universes[0].title}
                        </a></p>`
                      : ""
                  }
                </div>
                <ul class="material-grid__items">
                  ${series.members
                    .map(
                      (m) => `
                      <li tabindex="-1">
                        <div class="recommended-material recommended-material--in-grid">
                          <div class="recommended-material__icon">
                            <button type="button" aria-label="tilføj Hurry up tomorrow : original motion picture score til huskelisten" class="button-favourite"><svg height="24" width="24" class="icon-favourite" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.5 20L10.2675 18.921C5.89 15.1035 3 12.5858 3 9.49591C3 6.9782 5.057 5 7.675 5C9.154 5 10.5735 5.66213 11.5 6.70845C12.4265 5.66213 13.846 5 15.325 5C17.943 5 20 6.9782 20 9.49591C20 12.5858 17.11 15.1035 12.7325 18.9292L11.5 20Z" stroke-width="2"></path></svg></button>
                          </div>
                          <a data-cy="link-no-style" href="/work/${m.work.workId}" class="hide-linkstyle cover cover--size-large cover--aspect-large" tabindex="-1" aria-hidden="true">  
                            <img src="${m.work.manifestations?.bestRepresentation?.cover?.detail || ""}" class="cover__img cover__img--animate cover__img--shadow-medium" alt="">
                          </a>
                          <div class="recommended-material__texts">
                            ${m.work.series[0].numberInSeries ? "<p>" + m.work.series[0].numberInSeries + "</p>" : ""}  
                            <a data-cy="recommended-description" href="/work/${m.work.workId}" class="recommended-material__description">${m.work.titles?.main || ""}</a>
                            <a data-cy="recommended-author" href="/work/${m.work.workId}" class="recommended-material__author">${m.work.creators?.map((c) => c.display).join(", ") || ""}</a>
                          </div>
                        </div>
                      </li>
                    `
                    )
                    .join("")}
                </ul>
              </div>
            </section>
          `;
        }

        // Hent sid query param fra URL
        const sid = getQueryParam("sid");
        if (!sid) throw new Error("Missing ?sid= in URL")

        // Kald fbiQuery med forespørgslen
        fbiQuery({
          query: `query Series($seriesId: String!) {
            series(seriesId: $seriesId) {
              description  
              title
              members {
                work {
                  abstract
                  creators {
                    display
                  }
                  titles {
                    main
                    standard
                  }
                  manifestations {
                    bestRepresentation {
                      cover {
                        detail
                      }
                    }
                    first {
                      edition {
                        publicationYear {
                          display
                        }
                      }
                    }  
                  }
                  series {
                    hitcount
                    numberInSeries  
                  }
                  universes {
                    title
                    universeId
                  }    
                  workId  
                }
              }
            }
          }`,
          variables: { seriesId: sid },
        }).then(data => {
          renderSeries(container, data.data.series);
        });     
        
      } else {
        return;
      }
    });

})();