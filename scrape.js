const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const fs = require('fs');

nightmare
  .goto('https://www.google.com/maps/')
  .wait(1000)
  .type('#gs_lc50', 'vocational schools in colorado')
  .click('#searchbox-searchbutton')
  .wait(5000)
  .evaluate(()=>{
    
    const segments = [...document.querySelectorAll('.section-result-text-content')];
    const details = segments.map((segment) => {
      let name = segment.querySelector('.section-result-title').innerText;
      let address = segment.querySelector('.section-result-location').innerText;
      let mapURL = segment.baseURI;
      let type = segment.querySelector('.section-result-details').innerText;
      return {name, address, mapURL, type}
    })
    return details;
  })
  .end()
  .then((result) =>{
    let output = JSON.stringify(result, null, 2);
    fs.writeFile('./vocationalSchoolsData.json', output, 'utf8', err => {
      if (err) {
        return console.log(err);
      }
    });
    console.log('file was saved');
  })
  .catch((err)=> {
    console.log(err);
  })