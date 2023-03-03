const sortByDate = document.getElementById('sort-by-date');
const seeMoreContainer = document.getElementById('see-more-container');

const loadAiTools = async (seeMore, sort) => {
  const url = `https://openapi.programming-hero.com/api/ai/tools`;
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data);
  showAiTools(data.data.tools, seeMore, sort);
}

const showAiTools = (data, seeMore, sort) => {
  const cards = document.getElementById('cards');
  cards.innerHTML = '';


  // if clicked on see more or not
  if (seeMore) {
    seeMoreContainer.classList.add('d-none');
  }
  else {
    data = data.slice(0, 6);
    seeMoreContainer.classList.remove('d-none');
  }

  // if sort clicked
  if (sort) {
    data.sort((a, b) => new Date(a.published_in) - new Date(b.published_in));
    sortByDate.innerText = "Combine";
    // combine.classList.remove('d-none');
  }
  else {
    sortByDate.innerText = "Sort by Date";
    // sortByDate.classList.remove('d-none');
    // combine.classList.add('d-none');
  }

  // turning off the spinner
  togglerSpinner(false);

  data.forEach(card => {
    // console.log(card);
    const { id, image, name, published_in } = card;
    cards.innerHTML += `
        <div class="col d-flex align-items-stretch">
          <div class="card">
            <img src="${image}"
              class="card-img-top rounded p-3 h-100" alt="...">
            <div class="card-body">
              <h5 class="card-title fw-bolder">Features</h5>
              <div class="m-0 p-0"> 
              ${makeFeatures(card)}
              </div>
              <hr class="">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="fs-5 fw-semibold m-0 p-0">${name ? name : 'Name not available'}</p>
                  <div class="d-flex align-items-center gap-2">
                    <i class="fa-regular fa-calendar-days"></i>
                    <p class="card-text">${published_in ? published_in : 'Not found'}</p>
                  </div>
                </div>
                <div>
                  <button onclick="modalDataLoad('${id}')" class="border-0 rounded-circle" style="height: 3rem; width: 3rem;"><i
                      class="m-0 p-0 fa-solid fa-circle-arrow-right fa-2x" data-bs-toggle="modal" data-bs-target="#aiDetails"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
    `
  })
}

const makeFeatures = (data) => {
  let featureHtml = '';
  for (let i = 1; i <= data.features.length; i++) {
    featureHtml += `
      <p class="m-0 p-0"><span>${i}. </span>${data?.features[i - 1]}</p>
    `
  }
  return featureHtml;
}

const modalDataLoad = async id => {
  const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`
  const res = await fetch(url);
  const data = await res.json();
  modalDataShow(data.data)
}

const modalDataShow = data => {
  // console.log(data);
  const modalBody = document.getElementById('modal-body');
  const { id, description, accuracy, image_link, integrations, features } = data;
  modalBody.innerHTML = `
<div class="col">
  <div class="rounded d-flex flex-column justify-content-center border border-warning p-2 p-md-4"
    style="background: rgba(235, 87, 87, 0.05);">
    <p class="fw-bold fs-5">${description ? description : 'No description'}</p>
    <div class="d-flex g-2 justify-content-center align-items-center gap-2">
      <div class="m-0 p-0 bg-white p-2 text-center rounded fw-bolder text-success">
        ${makingP(data, 0)}
      </div>
      <div class="m-0 p-0 bg-white p-2 text-center rounded fw-bolder text-warning-emphasis">
      ${makingP(data, 1)}
      </div>
      <div class="m-0 p-0 bg-white p-2 text-center rounded fw-bolder text-danger">
      ${makingP(data, 2)}
      </div>
    </div>
    <div class="d-flex justify-content-around pt-2 gap-4">
      <div>
        <h6 class="fw-bolder">Features</h6>
        <div>
          <ul class="ms-2 p-0">
            ${makeLiForFeatures(features)}
          </ul>
        </div>
      </div>
      <div>
        <h6 class="fw-bolder">Integrations</h6>
        <div>
          <ul class="ms-2 p-0">
            ${makeLiForIntegrations(integrations)}
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="col">
  <div class="bg-secondary-subtle rounded text-center border border-secondary-subtle p-4">
    <div class="position-relative">
      <div>
          <p id="accuracy${id}-before" class="btn btn-danger position-absolute top-20 end-0" style="transform: translate(-10%, 20%)">
          <span id="accuracy${id}">${accuracy.score ? accuracy.score*100 : 0}</span>% accuracy
          </p>
      </div>
      <img style="height: 15rem"
      src="${image_link[0]}"
      class="img-fluid rounded mb-4 z-1" alt="">
    </div>
    ${inputOutputExamples(data, 0)}
    
  </div>
</div>
  `;
  // remove accuracy part if necessary
  const accuracyFieldBefore = document.getElementById(`accuracy${id}-before`);
  const accuracyField = document.getElementById(`accuracy${id}`);
  if (accuracyField.innerText == 0) {
    accuracyFieldBefore.classList.add('d-none');
  }
}

const makeLiForFeatures = data => {

  let lis = ''

  if (data === null) {
    lis = `
    <li class="m-0 p-0" style="font-size: 0.6rem;">No data Found</li
    `
  }
  else {
    Object.values(data).forEach(singleData => {
      lis += `
      <li class="m-0 p-0" style="font-size: 0.6rem;">${singleData.feature_name}</li>
      `
    });
  }

  return lis;
}
const makeLiForIntegrations = data => {
  let lis = ''

  if (data === null) {
    lis = `
    <li class="m-0 p-0" style="font-size: 0.6rem;">No data Found</li
    `
  }
  else {
    data.forEach(singleData => {
      lis += `
      <li class="m-0 p-0" style="font-size: 0.6rem;">${singleData}</li>
      `
    })
  }

  return lis;
  // console.log(data)
}

const makingP = (data, index) => {
  console.log(data);
  phtml = '';
  if (data.pricing === null) {
    phtml = `
    <p class="m-0 p-0" style="font-size: 0.7rem;">N/A</p>
    `
  }
  else {
    phtml = `
    <p class="m-0 p-0" style="font-size: 0.7rem;"><span>${data.pricing[index].price ? data.pricing[index].price : 'Free of Cost/'}</span><br><span>${data.pricing[index].plan ? data.pricing[index].plan : 'N/A'}</p>
    `
  }
  return phtml;
}

const inputOutputExamples = (data, index) => {
  let inputOutput = '';
  if (data.input_output_examples === null) {
    inputOutput = `
    <h5 class="mb-1 p-0">Can you give me any Examples?</h5>
    <p class="m-0 p-0">No! Not Yet! Take a break!!!</p>
    `
  }

  else {
    inputOutput = `
    <h5 class="mb-1 p-0">${data.input_output_examples[index].input ? data.input_output_examples[index].input : 'Can you give me any Examples?'}</h5>
    <p class="m-0 p-0">${data.input_output_examples[index].output == null ? 'No! Not Yet! Take a break!!!' : data.input_output_examples[index].output ? data.input_output_examples[0].output : 'No! Not Yet! Take a break!!!'}</p>
    `
  }
  return inputOutput;
}

sortByDate.addEventListener('click', function () {
  const seeMore = Array.from(seeMoreContainer.classList).includes('d-none');
  const sortByDateClicked = sortByDate.innerText === 'Combine' ? false : true;
  togglerSpinner(true);
  loadAiTools(seeMore, sortByDateClicked);
})

seeMoreContainer.addEventListener('click', function () {
  // need to check either sort button clicked or not
  const sortByDateClicked = sortByDate.innerText === 'Combine' ? true : false;

  const seeMore = true;
  togglerSpinner(true);

  loadAiTools(seeMore, sortByDateClicked);
})

const togglerSpinner = need => {
  const spinnerSection = document.getElementById('spinner-section');
  if (need) {
    spinnerSection.classList.remove('d-none');
  }
  else {
    spinnerSection.classList.add('d-none');
  }
}

loadAiTools();