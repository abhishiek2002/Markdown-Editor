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
  const lines = markdown.split("\n");
  let htmlLines = [];
  let insideCodeBlock = false;


  // console.log(lines);
  

  for (let line of lines) {
    // code block ```

    if(line.trim().startsWith("```")){
      insideCodeBlock = !insideCodeBlock;
      line = insideCodeBlock ? "<pre><code>" : "</code></pre>";
    }

    if(insideCodeBlock){
      htmlLines.push(line);  // no parsing inside code blocks
      continue;
    }

    // blockquote

    if (line.startsWith('> ')) {
      line = `<blockquote>${line.slice(2)}</blockquote>`;
      htmlLines.push(line);
      continue;
    }

    // link

    line = line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    // bold

    line = line.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    // italic

    line = line.replace(/\*(.*?)\*/g, "<i>$1</i>");

    // strikethrough

    line = line.replace(/~~(.*?)~~/g, "<del>$1</del>");

    // inline code ` `

    line = line.replace(/`(.*?)`/g, "<code>$1</code>");

    // list

    if (line.startsWith("- ") || line.startsWith("* ")){
      line = `<li> ${line.slice(2)} </li>`;
      htmlLines.push(line);
      continue;
    }


    // headings
    // first handle # lines

    if (line.startsWith("# ")) {
      line = `<h1> ${line.slice(2)} </h1>`;
      htmlLines.push(line);
      continue;
    }
    if (line.startsWith("## ")) {
      line = `<h2> ${line.slice(3)} </h2>`;
      htmlLines.push(line);
      continue;
    }
    if (line.startsWith("### ")) {
      line = `<h3> ${line.slice(4)} </h3>`;
      htmlLines.push(line);
      continue;
    }
    if (line.startsWith("#### ")) {
      line = `<h4> ${line.slice(5)} </h4>`;
      htmlLines.push(line);
      continue;
    }
    if (line.startsWith("##### ")) {
      line = `<h5> ${line.slice(6)} </h5>`;
      htmlLines.push(line);
      continue;
    }
    if (line.startsWith("###### ")) {
      line = `<h6> ${line.slice(7)} </h6>`;
      htmlLines.push(line);
      continue;
    }

    htmlLines.push(`<p>${line}</p>`);
  }

  return htmlLines.join("\n");
}
