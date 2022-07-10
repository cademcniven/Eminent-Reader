var novelCategory = document.getElementById("novelCategory")
novelCategory.addEventListener("change", (event) => {
    console.log(event.target.value)
    UpdateNovelCategory(event.target.value)
})

const UpdateNovelCategory = (category) => {
    fetch(`${window.location.pathname}/category`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category: category })
    })
}

var starRadios = document.querySelectorAll(".rating input")
starRadios.forEach(radio => {
    radio.addEventListener("click", (event) => {
        UpdateNovelRating(event.target.value)
    })
})

const UpdateNovelRating = (rating) => {
    fetch(`${window.location.pathname}/rating`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating: rating })
    })
}