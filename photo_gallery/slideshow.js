let photos = [
  {id: 1, link: "https://via.placeholder.com/1200x900"},
  {id: 2, link: "https://via.placeholder.com/1200x900"},
  {id: 3, link: "https://via.placeholder.com/1200x900"},
  {id: 4, link: "https://via.placeholder.com/1200x900"},
]

document.addEventListener('DOMContentLoaded', () => {
  let main = document.querySelector('main');
  let h1 = document.querySelector('h1')

  let photosTemp = Handlebars.compile(document.querySelector('#list-photos').innerHTML);
  let ulTemp = Handlebars.compile(document.querySelector('#ulTemp').innerHTML);

  Handlebars.registerPartial('figPartial', document.querySelector('#figPartial').innerHTML);
  Handlebars.registerPartial('ulPartial', document.querySelector('#ulPartial').innerHTML);

  let SlideShow = {
    setPhotos() {
      h1.insertAdjacentHTML('afterend', photosTemp(photos[0]));
      main.insertAdjacentHTML('beforeend', ulTemp({photos: photos}));
      this.makeActive(1)
    },

    removeActive() {
      let highlighted = document.querySelector('.active');

      if (highlighted) {
        highlighted.classList.remove('active')
      }
    },

    getImage(id) {
      let image;

      document.querySelectorAll('img').forEach(img => {
        if (img.dataset.photo === id) { image = img }
      })

      return image;
    },

    makeActive(id) {
      id = String(id);

      this.removeActive();

      let img = this.getImage(id);

      img.classList.add('active')
    },

    handleClick(e) {
      let target = e.target;

      if (target.tagName === 'IMG' && target.parentNode.tagName === 'LI') {
        this.makeActive(target.dataset.photo);
        this.updateMain(target.dataset.photo);
      }
    },

    updateMain(id) {
      let photo = photos.filter(ph => String(ph.id) === id)[0];
      this.removeMain()
      h1.insertAdjacentHTML('afterend', photosTemp(photo))
    },

    removeMain(){
      document.querySelector('main>figure').remove()
    },

    bind() {
      document.addEventListener('click', this.handleClick.bind(this))
    },

    init() {
      this.setPhotos();
      this.bind()
    }

}
  SlideShow.init()
})