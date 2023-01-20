let photos = [
  {id: 1, link: "https://via.placeholder.com/1200x900"},
  {id: 2, link: "https://via.placeholder.com/1200x900"},
  {id: 3, link: "https://via.placeholder.com/1200x900"},
  {id: 4, link: "https://via.placeholder.com/1200x900"},
]

class PhotoGallery {
  constructor() {
    this.templates = this.registerTemplates();
    this.mainDiv = document.querySelector('main');
    this.renderUL()
    this.setActive(1);
    let photo = this.getPhotoByID(1)
    this.renderPhoto(photo);
    this.bindClick()
  }

  bindClick() {
    this.mainDiv.querySelector('ul').addEventListener('click', this.handleClick.bind(this))
  }

  removeActive() {
    document.querySelector('.active').classList.remove('active')
  }

  removeFigure() {
    this.mainDiv.querySelector('figure').remove();
  }

  handleClick(e) {
    e.preventDefault();
    let target = e.target;

    if (target.tagName === 'IMG') {
      let id = target.dataset.photo;
      let photo = this.getPhotoByID(Number(id));
      this.removeActive();
      this.removeFigure()  
      this.renderPhoto(photo);
      this.setActive(id);
    }
  }

  getPhotoByID(id) {
    for (let i = 0; i < photos.length; i += 1) {
      if (photos[i].id === id) { return photos[i]}
    }
  }

  renderPhoto(photo) {
    this.mainDiv.querySelector('ul').insertAdjacentHTML('beforebegin', this.templates['list-photos'](photo))
  }

  setActive(id) {
    if (this.mainDiv.querySelector('ul')) {
      this.mainDiv.querySelectorAll('ul>li>img').forEach(img => {
        if (img.dataset.photo === String(id)) { img.classList.add('active') }
      })
    }
  }

  renderUL() {
    this.mainDiv.insertAdjacentHTML('beforeend', this.templates['ulTemp']({photos: photos}));
  }

  registerTemplates() {
    let temps = {};

    [...document.querySelectorAll("script[type='x/text-handlebars']")].forEach(script => {
      temps[script.id] = Handlebars.compile(script.innerHTML)
    })

    Handlebars.registerPartial('figPartial', document.querySelector('#figPartial').innerHTML);
    Handlebars.registerPartial('ulPartial', document.querySelector('#ulPartial').innerHTML);

    return temps;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PhotoGallery()
})