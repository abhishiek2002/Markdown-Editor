window.addEventListener("DOMContentLoaded", async () => {
  await init();
});

async function init() {
  const inputArea = document.getElementById("markdown-input");
  const previewArea = document.getElementById("preview");

  inputArea.addEventListener("input", () => {
    const markdownText = inputArea.value;
    const html = parseMarkdown(markdownText);
    previewArea.innerHTML = html;
  });
}

function parseMarkdown(markdown) {
  // first handle # lines

  const lines = markdown.split("\n");

  const html = lines.map((line) => {
    // link

    line = line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    // bold

    line = line.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    // italic

    line = line.replace(/\*(.*?)\*/g, "<i>$1</i>");

    // strikethrough

    line = line.replace(/~~(.*?)~~/g, "<del>$1</del>");

    // code ` `

    line = line.replace(/`(.*?)`/g, "<code>$1</code>");

    // list

    if (line.startsWith("- ") || line.startsWith("* ")) line = `<li> ${line.slice(2)} </li>`;

    //   aggregating li into ul
    

    // headings

    if (line.startsWith("# ")) {
      return `<h1> ${line.slice(2)} </h1><hr>`;
    }
    if (line.startsWith("## ")) {
      return `<h2> ${line.slice(3)} </h2><hr>`;
    }
    if (line.startsWith("### ")) {
      return `<h3> ${line.slice(4)} </h3><hr>`;
    }
    if (line.startsWith("#### ")) {
      return `<h4> ${line.slice(5)} </h4><hr>`;
    }
    if (line.startsWith("##### ")) {
      return `<h5> ${line.slice(6)} </h5><hr>`;
    }
    if (line.startsWith("###### ")) {
      return `<h6> ${line.slice(7)} </h6><hr>`;
    }

    return `<p> ${line} </p>`;
  });


  return html.join("\n");
}
