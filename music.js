/*** STATE ***/
// State starts out empty
let musicList = []


/*** FETCHING ***/
// Communicate with the Back-End (get data, send data)

async function fetchMusicList() {
    // Get/Fetch music entries from the Back-End API
    const response = await fetch("http://localhost:3000/music")
    const fetchedMusic = await response.json()
    // Put the music entries into state
    musicList = fetchedMusic
    // Re-render the page based on the state
    renderMusicList()
}

fetchMusicList()

/*** RENDERING ***/
// Make the User Interface match what the state (data) says it should show

const musicContainer = document.getElementById("music-container")

// Do the work
function renderMusicList() {
    // Clear out whatever we showed/rendered last time
    musicContainer.innerHTML = ""
    // show each music entry in the music container
    for (let i = 0; i < musicList.length; i++) {

        /*** LISTENING ***/
        const deleteMusic = async () => {
            // update the API
            await fetch("http://localhost:3000/music/" + musicList[i].id, {
                method: "DELETE"
            })
            // update the state on the frontend
            musicList.splice(i, 1)
            // Make our page match our state!
            renderMusicList()

        }

        // add divs and bootstrap classes
        const div = document.createElement("div")
        div.className = "border bg-light p-3 m-3"
        div.innerHTML = `
            <h3>${musicList[i].title}</h3>
            <p>${musicList[i].artist}</p>
            <p>${musicList[i].category}</p>
            <button class="btn btn-danger">Delete</button>
        `
        div.querySelector("button").addEventListener("click", deleteMusic)
        musicContainer.append(div)
    }
}


/*** LISTENING ***/

const titleInput = document.getElementById("title-input")
const artistInput = document.getElementById("artist-input")
const categoryInput = document.getElementById("category-input")

async function createMusic(event) {
    event.preventDefault() // don't refresh the page

    // grab the data from the form and make the new music entry
    const newMusicData = {
        title: titleInput.value,
        artist: artistInput.value,
        category: categoryInput.value
    }

    // clear out the inputs
    titleInput.value = ""
    artistInput.value = ""
    categoryInput.value = ""

    // update backend
    const response = await fetch("http://localhost:3000/music", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newMusicData) // make it into JSON
    })
    const createdMusicWithId = await response.json()

    // update frontend state
    musicList.push(createdMusicWithId)

    // re-render
    renderMusicList()
}