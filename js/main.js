const MOCK_NOTES = [
    {
    id: 1,
    title: 'Работа с формами',
    content: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
    color: 'green',
    isFavorite: false,
},
]

const colors = {
GREEN: 'green',
BLUE: 'blue',
RED: 'red',
YELLOW: 'yellow',
PURPLE: 'purple',
}

const model = {
    notes: MOCK_NOTES,

    addNote(title, color, content){
        const id = Math.random()
    
        const newNote = {
            id,
            title,
            content,
            color:colors[color],
            isFavorite: false,
        } 
        this.notes.unshift(newNote)
        view.renderNotes(this.notes)
    },

    deleteNote(id){
        this.notes=this.notes.filter((note)=>note.id !== Number(id))
        view.renderNotes(this.notes)
    },

    toggleIsFavorite(id){
        this.notes = this.notes.map((note)=>{
            if(note.id === Number(id)){
                return {
                    id: note.id,
                    title: note.title,
                    content: note.content,
                    color: note.color,
                    isFavorite: !note.isFavorite ,
                }
            }   
            return note
        })
        console.log(id, this.notes);
        
        view.renderNotes(this.notes)
    },

    filterByFavorite(){

        const filteredNotes=this.notes.filter((note)=>note.isFavorite === true)
        view.renderNotes(filteredNotes)
    },

    showAllNotes(){
        view.renderNotes(this.notes)
    }

}

const view = {
init() {
    this.renderNotes(model.notes)

    const form = document.querySelector('.form')
    const inputTitle = document.querySelector('.input-title')
    const inputContent = document.querySelector('.input-content')
    const inputColor = document.querySelectorAll('.radio')
    const notesList = document.querySelector('.notes-list')
    const filterFavorite = document.querySelector ('.filter-favorite')

form.addEventListener('submit', function (event) {
    event.preventDefault()
    const title = inputTitle.value
    const content = inputContent.value
    let color 

    for (let elem in inputColor) {
        if (inputColor[elem].checked){
            color = inputColor[elem].value
        }
    }
    
    controller.addNote(title, color, content)

    if( title.length > 50 )return

    inputTitle.value = ''
    inputContent.value = ''
    })

    notesList.addEventListener('click', function(e){
        e.preventDefault()
        const id = e.target.parentNode.parentNode.id

        if(e.target.parentNode.className === `delete-btn`){
            controller.deleteNote(id)
        } 

        if(e.target.parentNode.className === `favorite-btn`){
            controller.toggleIsFavorite(id)
        }      
    })

    filterFavorite.addEventListener('change', function(e){

        if(e.target.checked){
            controller.filterByFavorite()   
        }

        if(!e.target.checked){
            controller.showAllNotes()     
        }
    })

},
    renderNotes(notes){
        const notesList = document.querySelector('.notes-list')
        const notesCount = document.querySelector('.notes-count')

        const emptyStub = "<p>У вас ещё нет ни одной заметки. Заполните поля выше и создайте свою первую заметку!</p>"

        const newNotesArray = notes.map((item)=>{
            return (`
            <li class="note">
                        <div class="note-header" style="background-color:${item.color}">
                            <h2>${item.title}</h2>
                            <div id="${item.id}">
                                <button class="favorite-btn" type="button">
                                    ${item.isFavorite
                                        ? `<img src="./images/heart active.svg" alt="active">`
                                        :`<img src="./images/heart inactive.svg" alt="inactive">`
                                    }
                                </button>
                                <button class="delete-btn" type="button">
                                    <img src="./images/trash.svg" alt="trash">
                                </button>
                            </div>
                        </div>
                        <div class="note-body">
                            <p>
                                ${item.content}
                            </p>
                        </div>
                    </li> 
            `)
        })
        
        const notesHTML = newNotesArray.join('')
    
        notesList.innerHTML = notes.length ? notesHTML : emptyStub
        notesCount.textContent = `Всего заметок: ${notes.length}`
    },

    displayMessage(message, isError = false){
        const messagesBox = document.querySelector('.messages-box')
        const statusClass = isError ? "messages-error" : "messages-success"

        const messageCard = (`
            <div class="messages ${statusClass}">
                <div>
                ${
                 isError 
                 ? `<img src="./images/warning.svg" alt="warning">`
                 :`<img src="./images/done.svg" alt="done">`
                }
                </div>
                    <div>
                        <p>${message}</p>
                    </div>
            </div>
        `)

        messagesBox.innerHTML = messageCard
            
        const hideMessage = ()=>{
            messagesBox.innerHTML = ''
        }

        setTimeout(hideMessage, 3000)
    }
}

const controller = {
    addNote(title, color, content){

        if(title.length > 50){
            view.displayMessage('Максимальная длина заголовка - 50 символов', true)
            return
        }

        if (title.trim() !== '' && content.trim() !== '') {
            model.addNote(title, color, content)
            view.displayMessage('Заметка добавлна успешно!')
        } 
    },

    deleteNote(id){
        model.deleteNote(id)
        view.displayMessage('Заметка удалена!')
    },

    toggleIsFavorite(id){
        model.toggleIsFavorite(id)
    },

    filterByFavorite(){
        model.filterByFavorite()
    },

    showAllNotes(){
        model.showAllNotes()
    }
}

function init() {
view.init()
}

document.addEventListener('DOMContentLoaded', init)

