const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const re = /--(\w+):([\d\.]+.+?);/g;
const grid = 5;

function snap(n) {
  return Math.round(n / grid) * grid;
}

function getProps(el) {
  const { style: { cssText } } = el;
  const matches = [...cssText.matchAll(re)];
  const entries = matches.map(([, k, v]) => ([k, v]));
  return Object.fromEntries(entries);
}

function setProps(el, props) {
  const cssText = Object.entries(props)
    .map(([k, v]) => `--${k}:${v}; `)
    .join('');
  el.style.cssText = cssText;
}

function snapToGrid(el) {
  const props = getProps(el);
  const { top, left } = props;
  const matches = [top, left].map((v) => v.match(/([\d\.]+)(.+)/));
  const snapped = matches.map(([, n, unit]) => snap(+n) + unit);
  [props.top, props.left] = snapped;
  setProps(el, props);
}

window.addEventListener('load', () => {
  const el = document.querySelector('deckgo-drr');
  el.addEventListener('drrDidChange', () => {
    const props = getProps(el);
    snapToGrid(el);
  });
  el.addEventListener('drrSelect', () => {
  });
});


function link(el) {
  if (el == 'button') {
    $('.form-container').innerHTML += `<deckgo-drr drag="all" resize="true" rotation="true" style="--unit:px; --width:10; --height:10; --top:50; --left:50; --rotate:0deg;">
    <button style="display: block; margin: auto; max-width: 100%; max-height: 100%;">button</button>
    </deckgo-drr>`;
  }
  if (el == 'textbox') {
    $('.form-container').innerHTML += `<deckgo-drr drag="all" resize="true" rotation="true" style="--unit:px; --width:10; --height:10; --top:50; --left:50; --rotate:0deg;">
    <input type="text" value="textbox" style="display: block; margin: auto; max-width: 100%; max-height: 100%;" />
    </deckgo-drr>`;
  }
  if (el == 'radio') {
    $('.form-container').innerHTML += `<deckgo-drr drag="all" resize="true" rotation="true" style="--unit:px; --width:10; --height:10; --top:50; --left:50; --rotate:0deg;">
    <input type="radio" name="radio">
    <label for="radio">radio</label>
    </deckgo-drr>`;
  }
}

window.addEventListener('click', (evt) => {
  if (evt.target.id == 'save') {
    const computedStyle = getComputedStyle($('.form-container'));
    const W = +computedStyle.getPropertyValue('width').match(/[\d\.]+/)[0];
    const H = +computedStyle.getPropertyValue('height').match(/[\d\.]+/)[0];

    const elements = [...$$('deckgo-drr')]
      .map((el) => ({
        props: getProps(el),
        child: el.children[0]
      }))
      .map(({ props, child }) => ({
        props: {
          width: Math.round((W / 100) * +props.width.match(/[\d\.]+/)),
          height: Math.round((H / 100) * +props.height.match(/[\d\.]+/)),
          left: Math.round((W / 100) * +props.left.match(/[\d\.]+/)),
          top: Math.round((H / 100) * +props.top.match(/[\d\.]+/)) - 28
        },
        type: child.type,
        value: child.value,
        text: child.textContent,
        tag: child.tagName.toLowerCase()
      }));

    const controls = elements.map(({ props, ...rest }) => ({ ...props, ...rest }));
    const [win] = controls;
    
    const output = TEMPLATE.replace('<body></body>', `
      <body style="width: ${win.width}dip; height: ${win.height}dip">
      ${
      controls.slice(1).map((control) => {
        const tag = control.tag;
        return `<${tag} ${control.type ? `type="${control.type}"` : ''} ${control.value ? `value="${control.value}"` : ''} style="position: absolute; width: ${control.width}dip; height: ${control.height}dip; left: ${control.left}dip; top: ${control.top}dip">${control.text || ''}</${tag}>`;
      }).join('\n')
      }
      </body>
    `);

    console.log(output);

    const link = document.createElement('a');
    link.href = "data:application/octet-stream," + encodeURIComponent(output);
    link.download = 'index.htm';
    link.click();
    link.remove();
  }
});