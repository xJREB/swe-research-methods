import "bulma/css/bulma.min.css";
import "font-awesome/css/font-awesome.min.css";
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

  if (!["apa", "harvard1", "vancouver", "bibtex"].includes(templateName)) {
    const styleUrl = "https://raw.githubusercontent.com/citation-style-language/styles/master/" + templateName + ".csl";
    const template = (await axios.get(styleUrl)).data;
    const citeConfig = Cite.plugins.config.get("@csl");
    citeConfig.templates.add(templateName, template);
  }

  const refs = ["refs1", "refs2", "refs3", "refs4", "refs5", "refs6", "refs7", "refs8"];
  Promise.all(refs.map(entry => axios.get(`bibs/${entry}.bib`))).then(responses => {
    responses.forEach((res, index) => {
      document.getElementById(`refs${index + 1}`).innerHTML = new Cite(res.data).format("bibliography", {
        format: "html",
        template: templateName,
        lang: "en-US"
      });
    });
  });
};
