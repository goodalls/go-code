const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const fs = require('fs');

nightmare
  .goto('https://www.google.com/maps/')
  .wait(1000)
  .type('#gs_lc50', 'vocational schools in colorado')
  .click('#searchbox-searchbutton')
  .wait(5000)
  .evaluate(() => {
    const segments = [
      ...document.querySelectorAll('.section-result-text-content')
    ];
    const details = segments.reduce((accumulator, segment) => {
      let url = segment.querySelector('.section-result-title')//is this getting the url?????
      nightmare
        .click(url)
        .wait('body')
        .then(() => {
          let info = [...document.querySelectorAll('.widget-pane-link')];
          let address = info[0].innerText;
          let url = info[1].innerText;
          let phone = info[2].innerText;

          return { address, url, phone };
        })
        .back()
        .evaluate(result => {
          let name = segment.querySelector('.section-result-title').innerText;
          let mapURL = segment.baseURI;
          let type = segment.querySelector('.section-result-details').innerText;
          return accumulator.push({ ...result, name, mapURL, type });
        });
    }, Promise.resolve([]));
    return details;
  })
  .end()
  .then(result => {
    let output = JSON.stringify(result, null, 2);
    fs.writeFile('./vocationalSchoolsNewData.json', output, 'utf8', err => {
      if (err) {
        return console.log(err);
      }
    });
    console.log('file was saved');
  })
  .catch(err => {
    console.log(err);
  });
