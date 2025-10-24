// Serievisning

(function () {
  document.addEventListener("DOMContentLoaded", function () {

      // Find elementet til at indsætte data i
      const container = document.getElementById("main-content");
      
      // Hvis der er et element, så lav en GraphQL forespørgsel
      if (container) {

        // Funktion til at rendere serier
        function renderUniverse(container, data, uniqueWorkTypes, grouped_data, translate) {
          container.innerHTML = `
            <section class="paragraphs univers">
              <div class="material-grid">
                <div class="material-grid__text-wrapper">
                  <h2 class="material-grid__title">${data.data.universe.title}</h2>
                  ${data.data.universe.description ? `<p class="recommended-material__author">${data.data.universe.description}</p>` : ""}
                </div>

                <div class="material-grid__text-wrapper">
                  <div class="flex gap-4">
                    ${uniqueWorkTypes
                      .map(
                        (workType) => `
                        <a class="content-list-item__title no-underline" href="#${workType}">
                          <h3 class="content-list-item__title">
                            <span>${i18n(workType)}</span>
                          </h3>
                          <svg xmlns="http://www.w3.org/2000/svg" width="33" height="8" viewBox="0 0 33 8" fill="black">
                            <path
                              d="M32.287 4.35356C32.4823 4.15829 32.4823 3.84171 32.287 3.64645L29.105 0.464469C28.9098 0.269206 28.5932 0.269206 28.3979 0.464469C28.2027 0.659731 28.2027 0.976313 28.3979 1.17158L31.2264 4L28.3979 6.82843C28.2027 7.02369 28.2027 7.34027 28.3979 7.53554C28.5932 7.7308 28.9098 7.7308 29.105 7.53554L32.287 4.35356ZM0 4.5H31.9335V3.5H0V4.5Z"
                            ></path>
                          </svg>
                        </a>
                      `
                      )
                      .join("")}
                  </div>
                </div>

                <div>
                  ${grouped_data
                    .map(
                      ({ type, works }) =>
                        works.length > 0
                          ? `
                        <div class="material-grid__text-wrapper mt-64">
                          <h3 class="nav-teaser__title mb-0! leading-8" id="${type}">
                            ${i18n(type)}
                          </h3>
                        </div>
                        <ul class="material-grid__items">
                          ${works
                            .map(
                              (work) => `
                                <li tabindex="-1">
                                  <div class="recommended-material recommended-material--in-grid">
                                    ${window.materiallistComponent(work.titles?.main)}
                                    <a href="${work.series[0]?.seriesId ? "/serie?sid=" + work.series[0]?.seriesId : "/work/" + work.workId}" class="cover-stack hide-linkstyle cover cover--size-large cover--aspect-large"  tabindex="-1" aria-hidden="true">  
                                      ${!work.series[0]?.seriesId ? `<img src="${work.manifestations?.bestRepresentation?.cover?.detail}" class="cover__img cover__img--animate cover__img--shadow-medium" alt="">` : ""}
                                      ${typeof work.series?.[0]?.seriesId === "string" 
                                        ? `
                                          ${work.manifestations.all?.map(manifestation => `
                                            <img src="${manifestation.cover?.detail || ""}" 
                                                class="cover__img cover__img--animate cover__img--shadow-medium" 
                                                alt="">
                                          `).join("")}
                                          `
                                        : ""}
                                    </a>
                                    <div class="recommended-material__texts">
                                      ${work.series[0]?.seriesId ?
                                        `<a data-cy="recommended-description" href="/serie?sid=${work.series[0]?.seriesId}" class="recommended-material__description">${work.series[0]?.title || ""} (serie)</a>` :
                                        `<a data-cy="recommended-description" href="/work/${work.workId}" class="recommended-material__description">${work.titles?.main || ""}</a>`
                                      }
                                      <a data-cy="recommended-author" href="/work/${work.workId}" class="recommended-material__author">${work.creators?.map((c) => c.display).join(", ") || ""}</a>
                                    </div>
                                    
                                   </div>
                                </li>                             
                            `
                            )
                            .join("")}
                        </ul>
                      `
                          : ""
                    )
                    .join("")}
                </div>
              </div>
            </section>
          `;

          // Tilføj smooth scroll til anker links
          container.querySelectorAll('a[href^="#"]').forEach((a) => {
            a.addEventListener("click", (e) => {
              e.preventDefault();
              const id = a.getAttribute("href").substring(1);
              const target = container.querySelector(`#${id}`);
              if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            });
          });         

        }


        // Hent sid query param fra URL
        const pid = getQueryParam("pid");
        if (!pid) throw new Error("Missing ?pid= in URL")

        // Kald fbiQuery med forespørgslen
        fbiQuery({
          query: `query Univers($universeId: String!) {
            universe(universeId: $universeId) {
              description
              title
              workTypes
              works {
                creators {
                  display
                }
                series {
                  seriesId
                  title
                }
                manifestations {
                  all {
                    materialTypes {
                      materialTypeSpecific {
                        code
                      }
                    }
                    cover {
                      detail
                    }  
                  }
                  bestRepresentation {
                    cover {
                      detail
                    }
                  }
                }
                materialTypes {
                  materialTypeSpecific {
                    display
                  }
                }
                titles {
                  main
                  standard
                }
                workId
                workTypes
              }
            }
          }`,
          variables: { universeId: pid },
        }).then(data => {
          // Arranger data
          const workTypes = data.data.universe.workTypes;
          const works = data.data.universe.works;

          const grouped_data = workTypes.map((type) => ({
            type,
            works: works.filter((work) => work.workTypes.includes(type)),
          }));

          const uniqueWorkTypes = [...new Set(
            works.flatMap((work) => work.workTypes)
          )].sort((a, b) => workTypes.indexOf(a) - workTypes.indexOf(b));

          // Render univers
          renderUniverse(container, data, uniqueWorkTypes, grouped_data,);
       
          // Polaroid visning af serie covers
          setTimeout(() => {
            const coverStacks = container.querySelectorAll('.cover-stack');

            coverStacks.forEach(stack => {
              const imgs = stack.querySelectorAll('img');
              if (imgs.length <= 1) return;

              stack.style.position = 'relative';

              Promise.all([...imgs].map(img =>
                new Promise(resolve => {
                  if (img.complete) return resolve();
                  img.onload = resolve;
                  img.onerror = resolve;
                })
              )).then(() => {
                // We'll process from bottom to top, so we know which is "topmost"
                const total = imgs.length;
                imgs.forEach((img, i) => {
                  const zIndex = total - i;
                  img.style.zIndex = zIndex;
                  img.style.transition = 'transform 0.3s ease, top 0.3s ease, left 0.3s ease, box-shadow 0.3s ease';
                  img.style.boxShadow = '0 3px 10px rgba(0,0,0,0.25)';
                  img.style.borderRadius = '4px';
                  img.style.background = '#fff';
                  img.style.position = 'absolute';
                });

                // Measure the first image to base offsets on actual size
                const firstRect = imgs[0].getBoundingClientRect();

                imgs.forEach((img, i) => {
                  // Topmost image (highest zIndex) stays static and upright
                  if (i === 0) {
                    img.style.position = 'absolute';
                    img.style.transform = 'rotate(0deg)';
                    img.style.left = '0';
                    img.style.top = '0';
                    return;
                  }

                  // Offset each lower image
                  const offsetX = firstRect.width * (0.08 + Math.random() * 0.05);
                  const offsetY = -firstRect.height * (0.05 + Math.random() * 0.05);
                  const rotation = (Math.random() * 10 - 5).toFixed(2);

                  img.style.left = `${offsetX}px`;
                  img.style.top = `${offsetY}px`;
                  img.style.transform = `rotate(${rotation}deg)`;
                });
              });
            });
          }, 150);

        });     
        
      } else {
        return;
      }
    });

})();