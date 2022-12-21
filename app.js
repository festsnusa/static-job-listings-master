let requirements = document.querySelectorAll('.cards__requirement'),
  filterCard = document.querySelector('.cards__filter'),
  filterCardBox = document.querySelector('.cards__filter_box'),
  clearButton = document.querySelector('.cards__clear'),
  cards = document.querySelectorAll('.cards__card'),
  filterItems,
  selections = [],
  rolesArr = [],
  rolesObj = {},
  levelsArr = [],
  levelsObj = {},
  languagesArr = [],
  languagesObj = {},
  toolsArr = [],
  toolsObj = {},
  jsonData

async function getData(url = './data.json') {
  const response = await fetch(url)
  const data = await response.json()

  return data
}

requirements.forEach((requirement, i) => requirement.addEventListener('click', applyFilters.bind(null, requirement.innerHTML)))

clearButton.addEventListener('click', hideFilterSection.bind(null, true))

function applyFilters(userSelect) {

  if (!selections.includes(userSelect)) {

    selections.push(userSelect)

    filterCardBox.insertAdjacentHTML('afterbegin', `
      <ul class="cards__filter_list">
        <li class="cards__filter_item">${userSelect}</li>
      </ul>
    `)

    collectFilterItems()
    filterCards([userSelect], 'add')

    filterCard.classList.add('cards__filter_active')

  }

}

function filterCards(userSelect, operation) {

  if (userSelect.length == 0)
    return

  let result = []

  userSelect.forEach(el => {

    // roles
    if (rolesArr.includes(el)) {
      result = getKeysByValue(rolesObj, el)
    }

    // levels
    else if (levelsArr.includes(el)) {
      result = getKeysByValue(levelsObj, el)
    }

    // languages
    else if (languagesArr.includes(el)) {
      result = getKeysByValue(languagesObj, el, true)
    }
    // tools
    else {
      result = getKeysByValue(toolsObj, el, true)
    }
  })

  cards.forEach((card, i) => {

    if (i == 0)
      return

    if (operation == 'add' && !result.includes(card.id)) {
      card.classList.add('cards__card_invisible')
    }

    if (operation == 'remove' && result.includes(card.id)) {
      card.classList.remove('cards__card_invisible')
    }

  })

}

function getKeysByValue(object, elem, isObj = false) {

  if (isObj) {

    let result = []
    for (const [key, value] of Object.entries(object)) {

      for (let i = 0; i < value.length; i++) {
        if (value[i] == elem) {
          result.push(key)
          break
        }
      }

    }

    return result

  }

  return Object.keys(object).filter(key => object[key] === elem)

}

function collectFilterItems() {

  filterItems = document.querySelectorAll('.cards__filter_item')
  filterItems.forEach(filterItem => {

    filterItem.addEventListener('click', () => {
      filterItem.parentElement.remove()
      selections.splice(selections.indexOf(filterItem.innerHTML), 1)

      filterCards(selections, 'remove')
      hideFilterSection()
    })

  })

}

function hideFilterSection(clear = false) {

  if (document.querySelectorAll('.cards__filter_item').length == 0 || clear) {
    filterCard.classList.remove('cards__filter_active')
    selections = []
    filterCardBox.innerHTML = ''

    cards.forEach(card => {
      card.classList.remove('cards__card_invisible')
    })
  }
}

window.addEventListener('DOMContentLoaded', () => {

  getData()
    .then(data => {

      jsonData = data

      data.forEach(e => {
        rolesArr.push(e.role)
        rolesObj[e.id] = e.role
        levelsArr.push(e.level)
        levelsObj[e.id] = e.level

        let arr1 = []

        e.languages.forEach(item => {
          languagesArr.push(item)
          arr1.push(item)
        })

        languagesObj[e.id] = arr1

        let arr2 = []

        e.tools.forEach(item => {
          toolsArr.push(item)
          arr2.push(item)
        })

        toolsObj[e.id] = arr2

      })
    })

})