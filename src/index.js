import "bulma/css/bulma.min.css";
import "bulma-extensions/dist/css/bulma-extensions.min.css";
import "./styles.css";

import axios from "axios";
import Cite from "citation-js";

// The following code is based off a toggle menu by @Bradcomp
// source: https://gist.github.com/Bradcomp/a9ef2ef322a8e8017443b626208999c1
function initHamburgerMenu() {
  var burger = document.querySelector(".burger");
  var menu = document.querySelector("#" + burger.dataset.target);
  burger.addEventListener("click", function() {
    burger.classList.toggle("is-active");
    menu.classList.toggle("is-active");
  });
}

window.onload = async function() {
  initHamburgerMenu();

  const templateName = "ieee";

  // ensure that the CSL file is present for citation.js (query it from GitHub)
  if (!["apa", "harvard1", "vancouver", "bibtex"].includes(templateName)) {
    const styleUrl = "https://raw.githubusercontent.com/citation-style-language/styles/master/" + templateName + ".csl";
    const template = (await axios.get(styleUrl)).data;
    const citeConfig = Cite.plugins.config.get("@csl");
    citeConfig.templates.add(templateName, template);
  }

  // retrieve bib files for all sections, transform to HTML, and add to the respective DOM element
  const refs = ["phil-of-science", "general-ese", "theories", "slrs", "glrs", "qualitative-studies", "surveys", "experiments", "design-science", "tool-building-eval", "msr"];
  Promise.all(refs.map(entry => axios.get(`bibs/${entry}.bib`))).then(responses => {
    responses.forEach((res, index) => {
      const html = replaceDoisWithLinks(
        new Cite(res.data).format("bibliography", {
          format: "html",
          template: templateName,
          lang: "en-US"
        })
      );
      document.getElementById(refs[index]).innerHTML = html;
    });

    // remove loading animation
    const el = document.querySelector(".pageloader");
    el.classList.remove("is-active");
  });
};

// replace DOI occurences in the HTML with links
function replaceDoisWithLinks(html) {
  return html.replace(/doi: (.*)\.<\/div>/g, "doi: <a target='_blank' href='https://www.doi.org/$1'>$1</a>.</div>");
}
