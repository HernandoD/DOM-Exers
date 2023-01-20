class Modal {
  constructor() {
    this.template = Handlebars.compile(document.querySelector('#modal-temp').innerHTML);
    this.teamDiv = document.querySelector('#team');
    this.bindClickEvent()
  }

  bindClickEvent() {
    document.addEventListener('click', this.handleClick.bind(this))
  }

  handleClick(e) {
    e.preventDefault();
    let target = e.target;

    if (target.dataset.type === 'non-modal') {
      target = target.closest('li').querySelector('a');
      this.profileObj = this.getProfileObj(target);
      this.renderModal(this.profileObj)
    }

    if (target.className === 'close') {
      this.removeModal()
    }
  }

  removeModal() {
    document.querySelector('#modal-layer').remove()
    document.querySelector('#modal').remove()  
  }

  getProfileObj(target) {
    let obj = {};
    obj.source = target.dataset.imageSource;
    obj.name = target.dataset.name;
    obj.text = target.dataset.text;
    return obj; 
  }

  renderModal(profile) {
    this.teamDiv.insertAdjacentHTML('afterbegin', this.template(profile));
    document.querySelector('#modal-layer').classList.remove('hide')
    document.querySelector('#modal').classList.remove('hide')
  }


}


document.addEventListener('DOMContentLoaded', () => {
  new Modal()
})