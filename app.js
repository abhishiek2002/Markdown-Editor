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
  let insideUl = false;
  let insideOl = false;
  let insideCodeBlock = false;

  // console.log(lines);

  for (let line of lines) {
    // close ul list if it should

    if (!line.startsWith("- ") && !line.startsWith("* ") && insideUl) {
      insideUl = false;
      htmlLines.push("</ul>");
    }

    // close ol list if it should

    if (!(/^\d+\. /.test(line)) && insideOl) {
      insideOl = false;
      htmlLines.push("</ol>");
    }

    // code block ```

    if (line.trim().startsWith("```")) {
      insideCodeBlock = !insideCodeBlock;
      line = insideCodeBlock ? "<pre><code>" : "</code></pre>";
    }

    if (insideCodeBlock) {
      htmlLines.push(line); // no parsing inside code blocks
      continue;
    }

    // blockquote

    if (line.startsWith("> ")) {
      line = `<blockquote>${line.slice(2)}</blockquote>`;
      htmlLines.push(line);
      continue;
    }
    
    // image

    line = line.replace(/\!\[(.*?)\]\((.*?)\)/g, `<img alt="$1" src="$2" />`);

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

    // horizontal line

    if (/^---+$/.test(line.trim())) {
      htmlLines.push("<hr/>");
      continue;
    }

    // list

    // open unorder list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!insideUl) {
        insideUl = true;
        htmlLines.push("<ul>");
        line = `<li> ${line.slice(2)} </li>`;
        htmlLines.push(line);
        continue;
      } else {
        htmlLines.push(`<li> ${line.slice(2)} </li>`);
        continue;
      }
    }

    // open order list

    if (/^\d+\. /.test(line)) {
      if (!insideOl) {
        htmlLines.push(`<ol type="${line[0]}">`);
        insideOl = true;
        htmlLines.push(`<li>${line.replace(/^\d+\. /, '')}`);
      } else {
        htmlLines.push(`<li>${line.replace(/^\d+\. /, '')}`);
      }
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
